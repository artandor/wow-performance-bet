## Context

Currently, when a user tries to place a bet on a bet they have already answered, the server action throws an `Error`. In production Next.js, thrown errors from Server Actions are sanitised and the user sees a generic "Server Components render" error. Even in development, the message is not user-friendly for non-developers.

The data layer is Redis (KV) with no unique constraints — duplicate prevention is purely application-level via `Array.find()` before pushing a new participant. There is no locking; upsert is a safe operation because each user can only appear once per bet (the logic will replace rather than append).

The page (`app/bets/[id]/page.tsx`) is a Client Component. It fetches the bet via `getBetAction` on mount, but does **not** currently pass the current user's existing answer to the participation forms. Session/user identity is only available server-side via `getCurrentUser()`.

## Goals / Non-Goals

**Goals:**
- Allow a user to change their answer on an **open** bet, replacing their previous entry.
- Show the user's current answer pre-filled in the participation form.
- Label the action "Update Bet" (instead of "Place Bet") when the user already has an entry.
- Produce a user-friendly confirmation message on success ("Bet updated!").
- Apply the same logic consistently to all three bet kinds (group-dps, prediction, h2h) and demo mode.

**Non-Goals:**
- Allowing updates after a bet is closed or resolved.
- Changing the gold-ledger / accounting model (entries simply replace in-place).
- Adding concurrency / locking (same risk level as before).
- Adding a withdraw/cancel option.

## Decisions

### 1. Upsert in `addParticipantToBet` for group-dps

**Decision:** Modify `addParticipantToBet` to replace the existing participant if one is found, rather than returning an error.

**Rationale:** The helper already owns the read-modify-write cycle for group-dps bets; it is the right place to centralise the logic. The `prediction` and `h2h` actions currently perform inline duplicate checks — they will be updated similarly.

**Alternative considered:** A separate `updateParticipantInBet` helper. Rejected because it would duplicate the read-modify-write boilerplate without adding clarity.

### 2. Pass `currentUserAnswer` from page to forms via a new server action

**Decision:** Add a lightweight server action `getCurrentUserAnswerAction(betId)` that returns the current user's existing answer (or `null`) for a given bet. The page calls this on load and passes the result as a prop to the participation form components.

**Rationale:** The participation form components are Client Components. The current user's identity is only available server-side. The cleanest way to bridge this is a dedicated server action returning a serialisable value, called from the client-side `loadData()` effect alongside `getBetAction`.

**Alternative considered:** Embedding the current user's answer inside the `Bet` object returned by `getBetAction`. Rejected because it would couple the public bet shape to per-user state and require type changes throughout.

**Alternative considered:** Using a `<Suspense>`-wrapped Server Component for the form. Rejected because the page is already a Client Component; mixing Server Component islands here would add significant architectural complexity for minimal benefit.

### 3. Form UX: pre-fill and relabel

**Decision:** Pass `existingAnswer` (the current value, typed per-bet-kind) as an optional prop to each participation form. When set, initialise local state with this value and change the submit button label to "Update Bet" / "Update Answer" / "Update Side". On success, show "Bet updated!" instead of "Bet placed!".

**Rationale:** Re-using the same form component avoids duplicating layout code. The pre-fill makes it obvious to the user what they previously chose.

## Risks / Trade-offs

- **Race condition on double submit:** The read-modify-write is not atomic (same as before). Two simultaneous submits from the same user could theoretically result in a stale write. Mitigation: Disable the submit button while the action is in-flight (already done via `isLoading` state in all three form components).
- **Gold ledger impact:** The ledger computes winnings from the participants array. Replacing a participant's answer in-place is safe — the player still participates, just with a different selection. No ledger changes needed.
- **Demo mode parity:** All demo functions will receive the same upsert treatment to stay consistent.

## Migration Plan

No data migration required. The change is purely additive at the data level (existing participant objects are only ever mutated in memory before the whole bet is re-saved to KV). Deployment is a standard Next.js build-and-deploy. Rollback: revert to previous build (old behavior: error on duplicate).

## Open Questions

None.
