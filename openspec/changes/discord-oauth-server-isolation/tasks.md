## 1. Dependencies and Environment Setup

- [x] 1.1 Install NextAuth.js v5 (next-auth@beta) package
- [x] 1.2 Add environment variables for Discord OAuth (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [x] 1.3 Create Discord application at https://discord.com/developers/applications and configure OAuth2 redirect URLs

## 2. NextAuth.js Configuration

- [x] 2.1 Create `/app/api/auth/[...nextauth]/route.ts` with NextAuth.js handlers
- [x] 2.2 Configure Discord provider with `identify` and `guilds` scopes
- [x] 2.3 Set up JWT strategy for session management
- [x] 2.4 Implement session callback to store user ID, username, avatar, and guilds array
- [x] 2.5 Configure session expiry to 7 days
- [x] 2.6 Set HTTP-only, secure cookies configuration

## 3. Authentication Middleware and Route Protection

- [x] 3.1 Create `/middleware.ts` to protect routes requiring authentication
- [x] 3.2 Configure middleware to redirect unauthenticated users to login page
- [x] 3.3 Add public routes exception list (login page, static assets)

## 4. Login and Logout UI

- [x] 4.1 Create `/app/login/page.tsx` login page with "Login with Discord" button
- [x] 4.2 Create `/components/UserMenu.tsx` component displaying user avatar and username
- [x] 4.3 Add logout button to UserMenu component
- [x] 4.4 Implement signIn and signOut actions from NextAuth.js
- [x] 4.5 Add error handling for OAuth denial/failure cases

## 5. Server Selection Infrastructure

- [x] 5.1 Create utility to get/set `activeServerId` cookie
- [x] 5.2 Create `/lib/server-context.ts` helper to retrieve active server from cookies in Server Actions
- [x] 5.3 Implement default server selection logic (first guild in session)
- [x] 5.4 Add validation to ensure activeServerId exists in user's guild list

## 6. Server Selection UI Components

- [x] 6.1 Create `/components/ServerSelector.tsx` dropdown/modal component
- [x] 6.2 Display server list with name and icon from session guilds
- [x] 6.3 Highlight currently active server in the selector
- [x] 6.4 Implement server switch action that updates activeServerId cookie
- [x] 6.5 Add server indicator to navigation bar/header showing active server
- [x] 6.6 Make server selector responsive for mobile devices

## 7. Guild Membership Refresh

- [ ] 7.1 Create `/app/api/user/servers/route.ts` API endpoint to fetch fresh guild data from Discord API
- [ ] 7.2 Implement "Refresh Servers" button in ServerSelector component
- [ ] 7.3 Update session with fresh guild list on successful refresh
- [ ] 7.4 Handle Discord API errors and rate limits gracefully
- [ ] 7.5 Display success/error messages after refresh attempt

## 8. Database Schema Updates

- [x] 8.1 Update `Bet` interface to include optional `serverId?: string` field
- [x] 8.2 Modify `createBet` function in `/lib/bet-storage.ts` to require and store serverId
- [x] 8.3 Create migration utility to add `serverId: "default"` to all existing bets
- [x] 8.4 Update Redis key pattern to support `server:{serverId}:bets` index sets
- [x] 8.5 Change roster key from `roster:main` to `roster:{serverId}` pattern

## 9. Server Context in Bet Operations

- [x] 9.1 Update `createBetAction` to get activeServerId from cookies and add to bet
- [x] 9.2 Update `getAllBetsAction` to filter bets by activeServerId
- [x] 9.3 Update `getBetAction` to verify bet's serverId matches user's active server
- [x] 9.4 Add authorization helper function `verifyServerAccess(userId, serverId, guilds)`
- [x] 9.5 Update `placeBetAction` to verify user has access to bet's server

## 10. Replace Manual playerId with Discord ID

- [x] 10.1 Remove playerId text input from `BetParticipationForm.tsx`
- [x] 10.2 Update `placeBetAction` to get userId from session instead of form input
- [x] 10.3 Store Discord user ID as playerId in participant records
- [ ] 10.4 Update participant display to show Discord username (fetch from session or store in participant)
- [ ] 10.5 Optionally add Discord avatar display in `ParticipantList.tsx`

## 11. Authorization Checks for Bet Operations

- [x] 11.1 Add server membership check to `resolveBetAction`
- [x] 11.2 Add server membership check to `closeBetAction`
- [x] 11.3 Add server membership check to `reopenBetAction`
- [x] 11.4 Add server membership check to `deleteBetAction`
- [x] 11.5 Add server membership check to `updateBetInfoAction`
- [x] 11.6 Return 403 Forbidden error with appropriate message for unauthorized access

## 12. Roster Server Scoping

- [x] 12.1 Update roster storage functions to accept serverId parameter
- [x] 12.2 Modify `getRoster` in `/lib/roster-storage.ts` to use `roster:{serverId}` key
- [x] 12.3 Modify `setRoster` to store with server-specific key
- [x] 12.4 Update `RosterImport.tsx` to get activeServerId and pass to storage functions
- [x] 12.5 Update `RosterDisplay.tsx` to load roster for active server

## 13. Server Switching Behavior

- [ ] 13.1 Add event listener or page refresh trigger when activeServerId cookie changes
- [ ] 13.2 Implement bet list reload on server switch in homepage
- [ ] 13.3 Add redirect logic on bet detail page if bet's server doesn't match new active server
- [ ] 13.4 Update roster page to reload roster when server changes

## 14. Legacy Bets Support

- [ ] 14.1 Update getAllBets to include bets without serverId when activeServerId is "default"
- [ ] 14.2 Add UI indicator for "Legacy Bets" or "Default Server" in server selector
- [ ] 14.3 Ensure bet operations handle bets without serverId gracefully (treat as serverId: "default")
- [ ] 14.4 Document migration path for existing users in README

## 15. Error Handling and Edge Cases

- [ ] 15.1 Handle user with no guilds (display empty state message)
- [ ] 15.2 Handle invalid activeServerId cookie (reset to first guild)
- [ ] 15.3 Add error boundary for OAuth failures
- [ ] 15.4 Handle session expiry gracefully (redirect to login with message)
- [ ] 15.5 Add loading states for server switching operations

## 16. Testing and Validation

- [ ] 16.1 Test OAuth flow from login to authenticated session
- [ ] 16.2 Test server isolation (create bet in server A, verify not visible in server B)
- [ ] 16.3 Test server switching updates visible bets
- [ ] 16.4 Test authorization rejection for cross-server bet access
- [ ] 16.5 Test refresh servers functionality
- [ ] 16.6 Test session persistence and expiry
- [ ] 16.7 Test roster isolation per server
- [ ] 16.8 Test legacy bet migration and display

## 17. Documentation and Deployment

- [ ] 17.1 Update README.md with Discord OAuth setup instructions
- [ ] 17.2 Document environment variable requirements
- [ ] 17.3 Add instructions for creating Discord application
- [ ] 17.4 Document multi-tenancy behavior and server selection
- [ ] 17.5 Create deployment checklist (env vars, Discord app redirect URLs)
