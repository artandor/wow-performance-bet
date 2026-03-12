## Why

World of Warcraft guild members want a fun way to bet on which 5-player group will perform best in game content, using in-game gold as stakes. Currently, there's no simple, lightweight application to manage these bets, track participants, and resolve winners based on performance rankings.

## What Changes

- Create a new Next.js application for managing WoW gold betting pools
- Implement bet creation with fixed equal stakes per player
- Add roster management to import and manage player lists
- Enable bet lifecycle: open → closed → resolved
- Display pot size and current bet participants
- Deploy to Vercel with minimal infrastructure

## Capabilities

### New Capabilities
- `bet-management`: Create, open, close, and resolve bets with gold amounts and time windows
- `roster-import`: Import and manage player rosters as string lists
- `bet-participation`: Allow users to place bets on specific 5-player groups from the roster
- `pot-tracking`: Display total pot size and all participants with their chosen groups
- `bet-resolution`: Determine winners based on group performance rankings

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- New Next.js application created from scratch
- Vercel deployment configuration required
- Minimal dependencies (Next.js core, basic UI components)
- No backend infrastructure beyond Next.js API routes
- No database initially (can use file-based or Vercel KV if needed)
