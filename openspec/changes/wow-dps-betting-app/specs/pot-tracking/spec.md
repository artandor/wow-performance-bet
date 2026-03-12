## ADDED Requirements

### Requirement: Calculate total pot size
The system SHALL calculate and display the total pot size as the gold amount multiplied by the number of participants.

#### Scenario: Display pot size for bet
- **WHEN** user views a bet
- **THEN** system displays total pot as (gold amount × participant count)

#### Scenario: Pot size with zero participants
- **WHEN** user views a bet with no participants
- **THEN** system displays pot size as zero

### Requirement: Display participant count
The system SHALL show the current number of participants for a bet.

#### Scenario: Display participant count
- **WHEN** user views a bet
- **THEN** system shows the total number of participants who have placed bets

### Requirement: List all participants with groups
The system SHALL display a list of all participants and their chosen 5-player groups for a bet.

#### Scenario: Display participant details
- **WHEN** user views bet participants
- **THEN** system shows each participant's identifier and their selected group of 5 players

#### Scenario: Group participants by chosen group
- **WHEN** multiple participants select the same 5-player group
- **THEN** system groups them together in the display
