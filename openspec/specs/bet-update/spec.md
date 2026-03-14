## ADDED Requirements

### Requirement: User can update their bet on an open bet
A user who has already placed a bet on an open bet SHALL be able to submit a new answer, replacing their previous entry, as long as the bet status is `open`.

#### Scenario: User updates a group-dps bet
- **WHEN** a user submits a group selection for a `group-dps` bet they have already answered and the bet is `open`
- **THEN** the system SHALL replace the user's existing participant entry with the new selection and return a success result

#### Scenario: User updates a prediction bet
- **WHEN** a user submits an answer for a `prediction` bet they have already answered and the bet is `open`
- **THEN** the system SHALL replace the user's existing participant entry with the new answer

#### Scenario: User updates an H2H bet
- **WHEN** a user submits a side choice for an `h2h` bet they have already chosen and the bet is `open`
- **THEN** the system SHALL replace the user's existing side choice with the new one

#### Scenario: Update is blocked when bet is not open
- **WHEN** a user tries to update their bet on a bet whose status is `closed` or `resolved`
- **THEN** the system SHALL reject the request with an appropriate error

### Requirement: Participation form pre-fills existing answer
When a user navigates to the detail page of an open bet they have already answered, the participation form SHALL be pre-filled with their current answer and display an "Update" label on the submit button instead of "Place Bet".

#### Scenario: Group-dps form pre-fills selected group
- **WHEN** the user already has a group-dps entry and the bet is open
- **THEN** the player selector SHALL have the user's previously selected players pre-selected and the button SHALL read "Update Bet"

#### Scenario: Prediction form pre-fills answer
- **WHEN** the user already has a prediction entry and the bet is open
- **THEN** the answer input or choice buttons SHALL reflect the user's previous answer and the submit action SHALL be labelled "Update Answer"

#### Scenario: H2H form highlights existing side choice
- **WHEN** the user already has an H2H entry and the bet is open
- **THEN** the previously chosen side SHALL be visually highlighted and the button/interaction SHALL indicate an update action

### Requirement: Success feedback distinguishes new from updated bet
After successfully placing or updating a bet, the form SHALL show a contextually appropriate success message.

#### Scenario: New bet placed
- **WHEN** the user places a bet for the first time
- **THEN** the success message SHALL read "Bet placed!"

#### Scenario: Existing bet updated
- **WHEN** the user updates an existing bet
- **THEN** the success message SHALL read "Bet updated!"
