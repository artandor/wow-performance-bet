## ADDED Requirements

### Requirement: Bets are isolated by Discord server

The system SHALL ensure that bets created in a Discord server are only visible and accessible to members of that server.

#### Scenario: User creates a bet in a server
- **WHEN** an authenticated user creates a bet
- **THEN** the system MUST associate the bet with the user's currently active Discord server ID
- **THEN** the bet MUST be stored with the `serverId` field set to the active server's ID

#### Scenario: User views bet list
- **WHEN** an authenticated user views the bet list
- **THEN** the system MUST display only bets that belong to the user's currently active server
- **THEN** the system MUST NOT display bets from other servers

#### Scenario: User attempts to access bet from different server
- **WHEN** an authenticated user attempts to access a bet detail page for a bet from a server they don't belong to
- **THEN** the system MUST return a 403 Forbidden error
- **THEN** the system MUST display an error message indicating insufficient permissions

#### Scenario: User switches servers
- **WHEN** an authenticated user switches their active server
- **THEN** the system reloads the bet list showing only bets from the newly selected server
- **THEN** previously visible bets from the old server are no longer displayed

### Requirement: Server context is required for all bet operations

The system SHALL require a valid server context for all bet-related operations.

#### Scenario: User places a bet
- **WHEN** an authenticated user places a bet on a bet detail page
- **THEN** the system MUST verify the user is a member of the bet's server
- **THEN** the system MUST verify the bet's `serverId` matches the user's active server
- **THEN** the system rejects the operation if either verification fails

#### Scenario: User resolves a bet
- **WHEN** an authenticated user attempts to resolve a bet
- **THEN** the system MUST verify the user is a member of the bet's server
- **THEN** the system proceeds with resolution only if verification succeeds

#### Scenario: User closes a bet
- **WHEN** an authenticated user attempts to close a bet
- **THEN** the system MUST verify the user is a member of the bet's server
- **THEN** the system proceeds with closing only if verification succeeds

#### Scenario: User deletes a bet
- **WHEN** an authenticated user attempts to delete a bet
- **THEN** the system MUST verify the user is a member of the bet's server
- **THEN** the system proceeds with deletion only if verification succeeds

### Requirement: Rosters are scoped to Discord servers

The system SHALL maintain separate rosters for each Discord server.

#### Scenario: User imports roster in a server
- **WHEN** an authenticated user imports a roster
- **THEN** the system stores the roster with the key `roster:{serverId}`
- **THEN** the roster is only accessible when the user's active server matches the `serverId`

#### Scenario: User views roster in different servers
- **WHEN** an authenticated user switches between servers with different rosters
- **THEN** the system displays the roster specific to the currently active server
- **THEN** each server's roster is independent

#### Scenario: Server has no roster
- **WHEN** an authenticated user accesses a server that has no roster configured
- **THEN** the system displays an empty roster
- **THEN** the user can import or create a roster for that server

### Requirement: Existing bets are migrated to default server

The system SHALL handle existing bets created before multi-tenancy was implemented.

#### Scenario: System encounters bet without serverId
- **WHEN** the system loads a bet that has no `serverId` field
- **THEN** the system treats the bet as belonging to a special "default" server with ID "default"
- **THEN** the bet is displayed in a "Legacy Bets" or "Default Server" section

#### Scenario: User views legacy bets
- **WHEN** an authenticated user has access to the "default" server
- **THEN** the system displays all legacy bets (bets without `serverId`)
- **THEN** the user can interact with legacy bets like normal bets

### Requirement: User identity replaces manual playerId

The system SHALL use the authenticated user's Discord ID as their player identifier in bets.

#### Scenario: User places a bet while authenticated
- **WHEN** an authenticated user places a bet
- **THEN** the system MUST use the user's Discord ID as the `playerId` in the participant record
- **THEN** the system MUST NOT prompt the user to manually enter a playerId

#### Scenario: Bet displays participant information
- **WHEN** a bet is displayed with participants
- **THEN** the system MUST display the Discord username for each participant
- **THEN** the system MAY display the Discord avatar for each participant

### Requirement: Authorization checks prevent unauthorized access

The system SHALL verify server membership before allowing bet operations.

#### Scenario: User not in server attempts to view bet
- **WHEN** a user attempts to access a bet from a server they are not a member of
- **THEN** the system checks the user's session guild list
- **THEN** the system rejects the request with a 403 Forbidden error if the server is not in the list

#### Scenario: User left server mid-bet
- **WHEN** a user placed a bet in a server and then left that Discord server
- **THEN** the user MUST NOT be able to access the bet until they rejoin the server or refresh their session
- **THEN** the bet remains in the system but is inaccessible to that user
