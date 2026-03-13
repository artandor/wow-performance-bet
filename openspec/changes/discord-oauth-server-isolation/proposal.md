## Why

The current betting system lacks user authentication and multi-tenancy support. Users from different Discord servers share a single global betting pool, creating confusion and limiting the ability to have server-specific betting communities. Implementing Discord OAuth with server-based isolation will enable authenticated, per-server betting experiences.

## What Changes

- Add Discord OAuth 2.0 authentication flow for user login
- Implement server-based bet isolation where each Discord server has its own betting pool
- Create user session management tied to Discord accounts
- Add server selection UI for users who belong to multiple Discord servers
- Modify bet creation and retrieval to be server-scoped
- Add database schema changes to support multi-tenancy with Discord server IDs

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `discord-oauth`: Discord OAuth 2.0 authentication flow, session management, and user identity
- `server-isolation`: Server-based multi-tenancy for bets, ensuring users only access bets from servers they belong to
- `server-selection`: UI and API for users to switch between Discord servers they have access to

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **Database**: Requires schema migration to add user tables, Discord server associations, and server_id foreign keys to bets table
- **API**: All bet-related endpoints need server context (requires authentication middleware)
- **Frontend**: Login flow, server switcher component, and authenticated state management required
- **Dependencies**: New packages needed (Discord OAuth library, session management library)
- **Security**: Introduction of authentication layer, session tokens, and authorization checks
- **Existing Data**: Current bets in database will need to be assigned to a default server or migrated appropriately
