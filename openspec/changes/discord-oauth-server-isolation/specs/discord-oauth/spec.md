## ADDED Requirements

### Requirement: User can authenticate with Discord OAuth

The system SHALL provide a Discord OAuth 2.0 authentication flow that allows users to log in with their Discord account.

#### Scenario: Unauthenticated user visits the application
- **WHEN** an unauthenticated user visits any protected page
- **THEN** the system redirects the user to a login page

#### Scenario: User clicks "Login with Discord"
- **WHEN** a user clicks the "Login with Discord" button
- **THEN** the system redirects the user to Discord's OAuth authorization page

#### Scenario: User authorizes the application
- **WHEN** a user authorizes the application on Discord's OAuth page
- **THEN** the system receives an authorization code and exchanges it for an access token
- **THEN** the system creates an authenticated session for the user
- **THEN** the system redirects the user to the homepage

#### Scenario: User denies authorization
- **WHEN** a user denies the application on Discord's OAuth page
- **THEN** the system redirects the user to the login page with an error message

### Requirement: System stores user identity from Discord

The system SHALL retrieve and store the user's Discord identity information in their session.

#### Scenario: User completes authentication
- **WHEN** a user successfully authenticates via Discord OAuth
- **THEN** the system stores the user's Discord ID, username, and avatar URL in the session
- **THEN** the system stores the list of Discord servers (guilds) the user belongs to

#### Scenario: User session contains guild membership
- **WHEN** a user's session is created
- **THEN** the session MUST include an array of guilds with id, name, and icon for each guild

### Requirement: User can log out

The system SHALL allow authenticated users to log out and clear their session.

#### Scenario: User clicks logout
- **WHEN** an authenticated user clicks the "Logout" button
- **THEN** the system destroys the user's session
- **THEN** the system redirects the user to the login page

#### Scenario: Logged out user accesses protected page
- **WHEN** a logged-out user attempts to access a protected page
- **THEN** the system redirects the user to the login page

### Requirement: System requests appropriate Discord OAuth scopes

The system SHALL request the minimum necessary Discord OAuth scopes to function.

#### Scenario: OAuth authorization request
- **WHEN** the system redirects a user to Discord's OAuth authorization page
- **THEN** the system MUST request the `identify` scope to retrieve user identity
- **THEN** the system MUST request the `guilds` scope to retrieve server membership

#### Scenario: No write permissions requested
- **WHEN** the system constructs the OAuth authorization URL
- **THEN** the system MUST NOT request any write scopes (guilds.join, bot, etc.)

### Requirement: Session persists across page refreshes

The system SHALL maintain user authentication state across browser sessions using HTTP-only cookies.

#### Scenario: User refreshes the page
- **WHEN** an authenticated user refreshes the page
- **THEN** the user remains authenticated
- **THEN** the system retrieves user data from the session without re-authentication

#### Scenario: User closes and reopens browser
- **WHEN** an authenticated user closes their browser and reopens the application within the session expiry period
- **THEN** the user remains authenticated without needing to log in again

### Requirement: Sessions expire after inactivity

The system SHALL expire user sessions after a defined period to balance security and user experience.

#### Scenario: Session expires
- **WHEN** a user's session exceeds the expiry period (7 days of inactivity)
- **THEN** the system destroys the session
- **THEN** the next request redirects the user to the login page

### Requirement: User can refresh server membership

The system SHALL allow users to manually refresh their Discord server membership data.

#### Scenario: User clicks "Refresh Servers"
- **WHEN** an authenticated user clicks the "Refresh Servers" button
- **THEN** the system fetches the user's current guild membership from Discord API
- **THEN** the system updates the user's session with the new guild list
- **THEN** the system displays a success message

#### Scenario: Refresh fails due to Discord API error
- **WHEN** the system attempts to refresh guild membership and Discord API returns an error
- **THEN** the system displays an error message to the user
- **THEN** the system retains the existing guild data in the session
