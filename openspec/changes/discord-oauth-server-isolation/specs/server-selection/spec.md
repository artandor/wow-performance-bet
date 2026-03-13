## ADDED Requirements

### Requirement: User can view list of accessible Discord servers

The system SHALL display a list of Discord servers the user can access based on their session guild membership.

#### Scenario: User views server list
- **WHEN** an authenticated user opens the server selection interface
- **THEN** the system displays all Discord servers (guilds) from the user's session
- **THEN** each server is displayed with its name and icon (if available)

#### Scenario: User has no servers
- **WHEN** an authenticated user has an empty guild list in their session
- **THEN** the system displays a message indicating no accessible servers
- **THEN** the system prompts the user to join a Discord server or refresh their session

### Requirement: User can select an active server

The system SHALL allow users to switch their active Discord server context.

#### Scenario: User selects a server from the list
- **WHEN** an authenticated user clicks on a server in the server selection interface
- **THEN** the system sets that server as the active server
- **THEN** the system stores the active server ID in a cookie
- **THEN** the system reloads or updates the current view to show content from the selected server

#### Scenario: Active server persists across navigation
- **WHEN** an authenticated user navigates to different pages
- **THEN** the system maintains the same active server context
- **THEN** all bet operations use the active server ID

### Requirement: System defaults to first server if none selected

The system SHALL automatically select a default active server when the user first logs in.

#### Scenario: User logs in for the first time
- **WHEN** a user completes authentication and has no active server cookie
- **THEN** the system sets the first server in the user's guild list as the active server
- **THEN** the system stores this selection in a cookie

#### Scenario: User has no guilds
- **WHEN** a user logs in with no Discord servers in their guild list
- **THEN** the system displays an error or empty state
- **THEN** the system does not set an active server

### Requirement: Active server indicator is visible

The system SHALL clearly indicate which Discord server is currently active.

#### Scenario: User views any page
- **WHEN** an authenticated user views any page in the application
- **THEN** the system displays the currently active server name and icon in the UI
- **THEN** the indicator is visible in the navigation bar or header

#### Scenario: User hovers over server indicator
- **WHEN** a user hovers over or clicks the active server indicator
- **THEN** the system displays the server selection interface
- **THEN** the current active server is visually highlighted in the list

### Requirement: Server selection UI is accessible

The system SHALL make the server selection interface easily accessible from any page.

#### Scenario: User clicks server selector
- **WHEN** an authenticated user clicks the server selector in the navigation
- **THEN** the system opens a dropdown or modal showing all available servers
- **THEN** the user can select a different server

#### Scenario: Server selector displays on mobile
- **WHEN** a user accesses the application on a mobile device
- **THEN** the server selector is accessible and functional
- **THEN** the UI adapts to smaller screen sizes

### Requirement: Switching servers updates content immediately

The system SHALL update the displayed content when a user switches servers.

#### Scenario: User switches server on bet list page
- **WHEN** a user is viewing the bet list and switches to a different server
- **THEN** the system immediately reloads the bet list showing bets from the new server
- **THEN** the previous server's bets are no longer visible

#### Scenario: User switches server on bet detail page
- **WHEN** a user is viewing a bet detail page and switches to a different server
- **THEN** the system redirects the user to the bet list for the new server (if the current bet is not accessible in the new server)
- **THEN** the system remains on the bet detail page if the bet belongs to the new server

### Requirement: Server selection reflects current membership

The system SHALL ensure the server list reflects the user's current Discord membership.

#### Scenario: User refreshes server membership
- **WHEN** a user clicks "Refresh Servers" button
- **THEN** the system fetches the latest guild list from Discord API
- **THEN** the system updates the server selection list with any added or removed servers

#### Scenario: User left a server externally
- **WHEN** a user left a Discord server outside the application
- **THEN** the removed server remains in the selection list until session refresh or manual refresh
- **THEN** attempting to access bets from that server may fail authorization (graceful degradation)

### Requirement: Server selection persists active server choice

The system SHALL remember the user's active server selection across sessions.

#### Scenario: User returns to application
- **WHEN** a user closes and reopens the application within the session expiry period
- **THEN** the system loads the previously active server from the cookie
- **THEN** the user sees content from the same server they last viewed

#### Scenario: Active server cookie is invalid
- **WHEN** the user's active server cookie contains a server ID not in their guild list
- **THEN** the system defaults to the first server in the guild list
- **THEN** the system updates the cookie with the new active server ID
