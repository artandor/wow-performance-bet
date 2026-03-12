## ADDED Requirements

### Requirement: Resolve bet by selecting winning group
The system SHALL allow resolution of a closed bet by designating which 5-player group performed best.

#### Scenario: Successful resolution
- **WHEN** user selects a winning group from bet participants and resolves a closed bet
- **THEN** system marks bet as "resolved" and records the winning group

#### Scenario: Cannot resolve open bet
- **WHEN** user attempts to resolve a bet that is still open
- **THEN** system rejects resolution with error

### Requirement: Identify winners
The system SHALL identify all participants who selected the winning group.

#### Scenario: Display winners
- **WHEN** bet is resolved
- **THEN** system displays all participants who chose the winning group

#### Scenario: No winners
- **WHEN** bet is resolved but no participant selected the winning group
- **THEN** system indicates no winners for this bet

### Requirement: Calculate winner payouts
The system SHALL calculate each winner's payout as the total pot divided equally among all winners.

#### Scenario: Calculate equal split
- **WHEN** bet is resolved with N winners
- **THEN** each winner receives (total pot / N) gold

#### Scenario: Display individual payout
- **WHEN** user views resolved bet
- **THEN** system shows each winner and their individual payout amount

### Requirement: Handle resolution with no winners
The system SHALL handle the case where no participant selected the winning group.

#### Scenario: Pot with no winners
- **WHEN** bet is resolved and no participant chose the winning group
- **THEN** system marks pot as unclaimed and displays message indicating no winners
