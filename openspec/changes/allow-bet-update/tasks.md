## 1. Server-side upsert logic

- [x] 1.1 Modify `addParticipantToBet` in `lib/bet-transactions.ts` to replace an existing participant's entry instead of returning an error when the participant is already present and the bet is open
- [x] 1.2 Update `placePredictionAnswerAction` in `app/actions/bet.ts` to replace the existing `PredictionParticipant` when the user has already answered, instead of throwing
- [x] 1.3 Update `placeH2HAction` in `app/actions/bet.ts` to replace the existing `H2HParticipant` when the user has already chosen a side, instead of throwing

## 2. Demo mode parity

- [x] 2.1 Update `demoPlaceBet` in `lib/demo/bet-actions.ts` to upsert the participant (replace existing group-dps entry) instead of throwing
- [x] 2.2 Update `demoPlacePredictionAnswer` in `lib/demo/bet-actions.ts` to upsert the participant instead of throwing
- [x] 2.3 Update `demoPlaceH2H` in `lib/demo/bet-actions.ts` to upsert the participant instead of throwing

## 3. Server action to expose current user's existing answer

- [x] 3.1 Add `getCurrentUserAnswerAction(betId)` server action in `app/actions/bet.ts` that returns the current user's existing participant entry (or `null`) for the given bet — handle demo mode, all three bet kinds

## 4. Bet detail page — load and pass existing answer

- [x] 4.1 In `app/bets/[id]/page.tsx`, call `getCurrentUserAnswerAction` inside `loadData()` and store the result in a new state variable (e.g. `myAnswer`)
- [x] 4.2 Pass `myAnswer` as an `existingAnswer` prop to all three participation forms

## 5. Form components — pre-fill and relabel

- [x] 5.1 Update `BetParticipationForm`
- [x] 5.2 Update `PredictionParticipationForm`
- [x] 5.3 Update `H2HParticipationForm`
