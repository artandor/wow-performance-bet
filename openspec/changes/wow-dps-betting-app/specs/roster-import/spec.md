## ADDED Requirements

### Requirement: Import roster from string list
The system SHALL allow users to import a player roster by providing a list of player names as strings.

#### Scenario: Successful roster import
- **WHEN** user submits a list of player name strings
- **THEN** system stores the roster and makes it available for bet group selection

#### Scenario: Import with empty list
- **WHEN** user submits an empty list
- **THEN** system rejects the import with validation error

#### Scenario: Import with duplicate names
- **WHEN** user submits a list containing duplicate player names
- **THEN** system removes duplicates and stores unique names only

### Requirement: View current roster
The system SHALL display the complete list of imported player names.

#### Scenario: Display roster
- **WHEN** user views the roster
- **THEN** system shows all player names in the current roster

### Requirement: Update roster
The system SHALL allow users to replace the existing roster with a new list of player names.

#### Scenario: Replace roster
- **WHEN** user submits a new roster list
- **THEN** system replaces the current roster with the new list

#### Scenario: Clear roster
- **WHEN** user submits an empty list to replace roster
- **THEN** system rejects the update and maintains existing roster
