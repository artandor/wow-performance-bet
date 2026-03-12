## ADDED Requirements

### Requirement: Place bet on 5-player group
The system SHALL allow users to participate in an open bet by selecting exactly 5 players from the roster as their chosen group.

#### Scenario: Successful bet placement
- **WHEN** user selects exactly 5 players from roster and submits for an open bet
- **THEN** system records the participant with their chosen group and bet amount

#### Scenario: Invalid group size
- **WHEN** user selects fewer than or more than 5 players
- **THEN** system rejects the bet with validation error

#### Scenario: Players not in roster
- **WHEN** user selects players not present in the current roster
- **THEN** system rejects the bet with validation error

#### Scenario: Bet on closed bet
- **WHEN** user attempts to place a bet on a bet with status "closed" or "resolved"
- **THEN** system rejects the participation with error

### Requirement: Prevent duplicate participation
The system SHALL prevent a user from placing multiple bets on the same bet.

#### Scenario: User already participated
- **WHEN** user attempts to place a second bet on the same bet
- **THEN** system rejects the participation with error indicating already participated

### Requirement: View participant's chosen group
The system SHALL display each participant's selected 5-player group for a bet.

#### Scenario: Display participant groups
- **WHEN** user views bet participants
- **THEN** system shows each participant ID and their selected 5-player group
