## Context

This is a greenfield Next.js application for managing World of Warcraft betting pools. The application must be minimal, serverless-friendly (Vercel deployment), and handle the complete lifecycle of bets: creation, participation, and resolution. The primary users are WoW guild members who want a simple interface to bet on which 5-player group will perform best.

**Constraints:**
- Must be deployable to Vercel with minimal configuration
- No complex backend infrastructure (use Next.js API routes)
- Keep dependencies minimal
- Must handle bet lifecycle state transitions clearly

## Goals / Non-Goals

**Goals:**
- Create a functional betting system for WoW players with equal stakes
- Support roster import and management
- Track bet state (open/closed/resolved) with proper transitions
- Display real-time pot size and participant information
- Enable winner resolution based on group performance

**Non-Goals:**
- Real money transactions or payment processing
- Integration with WoW APIs or game data
- User authentication/authorization (initial version)
- Mobile native apps
- Complex analytics or historical bet tracking

## Decisions

### 1. Data Storage: Vercel KV (Redis)
**Decision:** Use Vercel KV for data persistence
**Rationale:** 
- Serverless-friendly (no connection pooling issues)
- Built-in Vercel integration
- Simple key-value operations sufficient for our needs
- Free tier adequate for initial usage
**Alternatives considered:**
- File-based storage: Not suitable for serverless (ephemeral filesystem)
- PostgreSQL/Prisma: Overkill for simple data model, adds complexity

### 2. State Management: React Context + Server Actions
**Decision:** Use React Context for client state, Next.js Server Actions for mutations
**Rationale:**
- Next.js 14+ App Router with Server Actions provides simple data mutations
- No need for external state management library (Redux, Zustand)
- Server Actions handle form submissions and data updates cleanly
**Alternatives considered:**
- REST API routes: More boilerplate than Server Actions
- Client-side state libraries: Adds unnecessary complexity

### 3. UI Framework: No framework (native CSS + Tailwind)
**Decision:** Use Tailwind CSS without component library
**Rationale:**
- Keeps bundle size minimal
- Simple UI requirements don't justify component library overhead
- Tailwind provides utility classes for rapid development
**Alternatives considered:**
- shadcn/ui: Good components but adds complexity for our minimal needs
- Material-UI: Too heavy for this use case

### 4. Roster Storage Format: JSON array in KV
**Decision:** Store roster as simple JSON array of strings
**Rationale:**
- Matches import format (list of strings)
- Easy to query and display
- No need for complex player data structure initially
**Alternatives considered:**
- Separate player entities: Premature optimization

### 5. Bet Model Structure
**Decision:** Store bets with embedded participants array
**Schema:**
```typescript
Bet {
  id: string
  goldAmount: number
  status: 'open' | 'closed' | 'resolved'
  createdAt: timestamp
  closesAt: timestamp
  participants: Array<{
    playerId: string
    selectedGroup: string[] // 5 player names
  }>
  winningGroup?: string[]
}
```
**Rationale:**
- Simple denormalized structure fits KV storage
- Avoids multiple lookups for display
- Participant count is small (guild-sized)

### 6. Group Selection: Multi-select from roster
**Decision:** UI allows selecting exactly 5 players from roster as a group
**Rationale:**
- Enforces 5-player group requirement
- Prevents invalid bets
- Clear UX for group selection

## Risks / Trade-offs

**Risk:** Vercel KV has limited free tier storage
**Mitigation:** Start with free tier, monitor usage, can upgrade or add cleanup for old bets

**Risk:** No authentication means anyone can modify bets
**Mitigation:** Document as v1 limitation, add auth in future iteration if needed

**Risk:** Race conditions on bet participation (multiple users betting simultaneously)
**Mitigation:** Use Redis transactions (WATCH/MULTI/EXEC) for atomic participant updates

**Trade-off:** Embedded participants array doesn't scale to thousands of bets
**Acceptance:** Guild-sized betting pools won't hit scaling issues (typically <50 participants)

**Risk:** Manual winner resolution requires trust
**Mitigation:** Document resolution process, future: integrate with WoW Logs API

## Migration Plan

**Initial Deployment:**
1. Set up Next.js project with App Router
2. Configure Vercel KV in Vercel dashboard
3. Deploy to Vercel (automatic via Git push)
4. Set environment variables (KV credentials)

**Rollback:**
- Vercel allows instant rollback to previous deployment
- KV data persists across deployments

## Open Questions

- Should we add basic authentication (password-protected app) even in v1?
- How should duplicate group selections be handled (multiple people bet on same group)?
- Should we add a simple admin role for bet resolution, or allow anyone to resolve?
