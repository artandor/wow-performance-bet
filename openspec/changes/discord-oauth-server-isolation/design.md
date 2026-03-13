## Context

The application currently uses Next.js 15 with Server Actions, Redis (Vercel KV/ioredis) for storage, and has **no authentication system**. Users manually enter a `playerId` string when placing bets with no verification. The entire betting pool is global—all bets are stored in a single Redis namespace without any server/tenant isolation.

The current architecture:
- **Frontend**: Next.js App Router with React, Tailwind CSS, local component state (no global state management)
- **Backend**: Next.js Server Actions (no REST API), TypeScript
- **Database**: Redis with key-value storage (`bet:{betId}`, `roster:main`)
- **Auth/Session**: None - manual playerId text input only

Bets are stored with participants containing a `playerId` string. There's no user table, no session management, and no multi-tenancy support.

## Goals / Non-Goals

**Goals:**
- Implement Discord OAuth 2.0 for user authentication
- Add server-based multi-tenancy where each Discord server (guild) has isolated bets
- Enable users to switch between Discord servers they belong to
- Maintain backward compatibility with existing bet data structure where feasible
- Secure all bet operations behind authentication and server context

**Non-Goals:**
- Supporting authentication providers other than Discord
- Role-based permissions within a server (admin/member distinction can come later)
- Real-time synchronization of Discord server membership changes
- Migration of existing bets to specific servers (will assign to a default/global server)

## Decisions

### 1. Authentication Strategy: NextAuth.js v5 (Auth.js)

**Decision**: Use NextAuth.js v5 with Discord provider for OAuth flow and session management.

**Rationale**:
- Well-maintained, Next.js App Router compatible
- Built-in Discord OAuth provider
- Handles token refresh, session cookies, callbacks
- Supports middleware for route protection

**Alternatives Considered**:
- **Clerk**: More feature-rich but adds external dependency and cost at scale
- **Custom OAuth implementation**: More control but significant development overhead
- **Passport.js**: Better suited for traditional Express apps, not App Router

### 2. Session Storage: JWT with HTTP-only Cookies

**Decision**: Use NextAuth.js JWT strategy with HTTP-only secure cookies.

**Rationale**:
- Stateless - no session store needed (fits Redis KV-only usage)
- Works with serverless deployments (Vercel)
- Secure against XSS attacks
- Discord tokens stored encrypted in JWT

**Alternatives Considered**:
- **Database sessions**: Would require adding a sessions table to Redis; adds complexity
- **Redis sessions**: Would work but adds KV read overhead on every request

### 3. Multi-Tenancy Model: Server ID Scoping

**Decision**: Add `serverId` field to all bets, store server membership in user session.

**Schema Changes**:
- Bets: Add `serverId: string` field (Discord guild ID)
- New Redis keys: `server:{serverId}:bets` (set of bet IDs for server)
- Users: Store in session JWT: `{ userId, username, guilds: [{ id, name, icon }] }`
- Rosters: Change from `roster:main` to `roster:{serverId}`

**Rationale**:
- Simple, explicit tenant isolation
- Discord guild ID is stable and unique
- Easy to query bets per server
- Fits Redis key-value model

**Alternatives Considered**:
- **Separate Redis databases per server**: Complex, hard to scale, not supported by Vercel KV
- **Global bets with ACL**: More complex querying, harder to enforce isolation

### 4. Server Context Management: Cookie-based Active Server

**Decision**: Store `activeServerId` in a separate cookie, default to first guild in user's list.

**Rationale**:
- Decouples server selection from auth session
- Easy to change without re-authentication
- Can be read by Server Actions and API routes
- Persists across page refreshes

**Alternatives Considered**:
- **URL parameter** (`/bets?server=123`): Loses context on navigation, awkward UX
- **Local storage only**: Doesn't work for Server Actions (server-side needs context)

### 5. API Architecture: Keep Server Actions, Add API Routes for OAuth

**Decision**: Keep existing Server Actions pattern, add minimal API routes for OAuth callbacks.

**New API Routes**:
- `/api/auth/[...nextauth]` - NextAuth.js OAuth handlers
- `/api/user/servers` - Optional: Fetch user's current Discord servers (refresh membership)

**Rationale**:
- Minimal disruption to existing codebase
- Server Actions are good fit for this app's mutation patterns
- OAuth requires traditional API routes (redirect flow)

### 6. Discord Permissions: Require `guilds` Scope

**Decision**: Request Discord OAuth scopes: `identify` + `guilds`.

**Rationale**:
- `identify`: Get user ID, username, avatar
- `guilds`: Get list of servers user belongs to (for server switcher)
- No write permissions needed (don't need `guilds.join` or `bot` scope)

### 7. Authorization Model: Server Membership Check

**Decision**: On every bet operation, verify user is member of target server via session data.

**Flow**:
1. User session contains `guilds: [{ id, name }]` from OAuth
2. Server Action checks if `activeServerId` is in user's `guilds` array
3. Reject operation if not authorized

**Limitation**: Guild membership data is cached in session (expires in 30 days by default). If user leaves a server, they retain access until session expires or manual refresh.

**Mitigation**: Add a "Refresh Servers" button that re-fetches guild membership from Discord API.

**Alternatives Considered**:
- **Check Discord API on every request**: Too slow, rate limit concerns
- **Webhook updates**: Requires Discord bot with GUILD_MEMBERS intent - out of scope

## Risks / Trade-offs

1. **[Risk] Stale server membership in session** → Mitigation: Manual refresh button + short session expiry (7 days instead of 30)

2. **[Risk] Existing bet data has no serverId** → Mitigation: Migration script assigns all existing bets to `serverId: "default"`, show in special "Legacy" server in UI

3. **[Risk] Discord API rate limits** → Mitigation: Cache guild data in session JWT, only refresh on explicit user action

4. **[Risk] Increased Redis key complexity** → Mitigation: Use consistent key patterns, add key indexing via sets (`server:{serverId}:bets`)

5. **[Trade-off] Users without Discord can't access app** → Accepted: Discord-only is the desired constraint

6. **[Trade-off] No fine-grained permissions (admin vs member)** → Accepted: Can add role checks in future iteration

## Migration Plan

### Phase 1: Add Authentication (Non-Breaking)
1. Install NextAuth.js, configure Discord provider
2. Add login/logout UI components
3. Add middleware to protect routes (redirect to login if unauthenticated)
4. **Backward compat**: Existing bets remain accessible, no serverId filtering yet

### Phase 2: Add Multi-Tenancy (Breaking for New Bets)
1. Update bet schema to include `serverId` field
2. Modify Server Actions to require `activeServerId` from cookies
3. Add server selection UI component (dropdown/sidebar)
4. Migration script: Assign all existing bets `serverId: "default"`
5. Update Redis keys: Create `server:{serverId}:bets` indexes

### Phase 3: Enforce Authorization
1. Add server membership validation to all bet operations
2. Filter bet lists by active server
3. Scope roster to `roster:{serverId}`
4. Add "Refresh Servers" functionality

### Rollback Strategy
- Phase 1: Remove NextAuth middleware, revert to public access
- Phase 2: If critical issues, expose all bets globally again (ignore serverId temporarily)
- Database: Redis changes are additive (new keys), old bets retain structure

### Deployment
- Deploy behind feature flag if possible
- Test with single server first
- Monitor NextAuth session storage size (JWT payload limits)

## Open Questions

1. **Should we add a bot to fetch real-time server membership?** → Defer to v2, use session refresh for now
2. **Max number of servers per user?** → Discord limit is ~200, should be fine for JWT payload
3. **Should admins be able to delete bets?** → Defer role-based permissions to future work
4. **How to handle user leaves server mid-bet?** → Bets remain valid, user just can't access (graceful degradation)
