## Why

When a user submits an answer to a bet they have already answered, the server throws an error that surfaces in production as an opaque "Server Components render" message — unintelligible to non-developers. Beyond the UX problem, the product intention should actually be to allow users to *update* their bet while the bet is still open, not just block them.

## What Changes

- Server actions (`placeBetAction`, `placePredictionAnswerAction`, `placeH2HAction`) will **update** an existing participant's answer instead of throwing an error when the bet is open and the user has already placed a bet.
- Demo mode equivalents (`demoPlaceBet`, `demoPlacePredictionAnswer`, `demoPlaceH2H`) receive the same change.
- `addParticipantToBet` helper in `lib/bet-transactions.ts` gains an upsert behaviour (update if participant exists, insert otherwise).
- The three participation form components (`BetParticipationForm`, `PredictionParticipationForm`, `H2HParticipationForm`) will pre-fill the user's current answer when one exists, and display a "Update your bet" label instead of "Place Bet".
- The bet detail page (`app/bets/[id]/page.tsx`) will pass the current user's existing answer (if any) down to the participation forms.

## Capabilities

### New Capabilities
- `bet-update`: Ability for a user to change their bet/answer on an open bet after having already submitted one.

### Modified Capabilities

## Impact

- `app/actions/bet.ts` — all three place-bet actions
- `lib/bet-transactions.ts` — `addParticipantToBet`
- `lib/demo/bet-actions.ts` — all three demo place-bet functions
- `components/BetParticipationForm.tsx`
- `components/PredictionParticipationForm.tsx`
- `components/H2HParticipationForm.tsx`
- `app/bets/[id]/page.tsx` — needs to derive current user's existing answer and pass it to forms
- No new dependencies. No breaking API changes.
