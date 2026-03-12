## ADDED Requirements

### Requirement: Create bet with gold amount and duration
The system SHALL allow users to create a new bet by specifying a gold amount per participant and a closing time.

#### Scenario: Successful bet creation
- **WHEN** user submits a bet with gold amount (positive integer) and closing time (future timestamp)
- **THEN** system creates a bet with status "open" and returns bet ID

#### Scenario: Invalid gold amount
- **WHEN** user submits a bet with zero or negative gold amount
- **THEN** system rejects the bet with validation error

#### Scenario: Invalid closing time
- **WHEN** user submits a bet with closing time in the past
- **THEN** system rejects the bet with validation error

### Requirement: Close bet at specified time
The system SHALL automatically transition a bet from "open" to "closed" status when the closing time is reached.

#### Scenario: Bet closes after duration expires
- **WHEN** current time reaches or exceeds the bet's closing time
- **THEN** system sets bet status to "closed" and prevents new participants

### Requirement: Resolve bet with winning group
The system SHALL allow a bet to be marked as resolved by selecting the winning 5-player group.

#### Scenario: Successful bet resolution
- **WHEN** user resolves a closed bet by selecting a winning group from participants
- **THEN** system sets bet status to "resolved" and records the winning group

#### Scenario: Cannot resolve open bet
- **WHEN** user attempts to resolve a bet with status "open"
- **THEN** system rejects the resolution with error

#### Scenario: Cannot resolve with invalid group
- **WHEN** user attempts to resolve with a group that has no participants
- **THEN** system rejects the resolution with error

### Requirement: View bet details
The system SHALL display bet information including gold amount, status, closing time, and creation time.

#### Scenario: Display bet information
- **WHEN** user views a bet
- **THEN** system shows gold amount, current status, closing time, and creation timestamp
