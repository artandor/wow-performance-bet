## 1. Project Setup

- [x] 1.1 Initialize Next.js 14 project with App Router and TypeScript
- [x] 1.2 Configure Tailwind CSS
- [x] 1.3 Set up Vercel KV for data storage
- [x] 1.4 Create environment variables configuration
- [x] 1.5 Set up basic project structure (app/, lib/, types/)

## 2. Data Models and Storage

- [x] 2.1 Define TypeScript types for Bet, Participant, and Roster
- [x] 2.2 Create KV storage utility functions (get, set, delete)
- [x] 2.3 Implement bet CRUD operations with KV
- [x] 2.4 Implement roster storage operations with KV
- [x] 2.5 Add transaction support for atomic participant updates

## 3. Roster Management

- [x] 3.1 Create roster import UI component with textarea input
- [x] 3.2 Implement roster parsing (string array)
- [x] 3.3 Create Server Action for roster import
- [x] 3.4 Add roster display component showing current players
- [x] 3.5 Implement roster update functionality
- [x] 3.6 Add duplicate name detection and removal

## 4. Bet Creation

- [x] 4.1 Create bet creation form (gold amount, closing time)
- [x] 4.2 Add form validation for positive gold amounts
- [x] 4.3 Add form validation for future closing times
- [x] 4.4 Implement Server Action to create bet
- [x] 4.5 Add bet creation success feedback

## 5. Bet Participation

- [x] 5.1 Create multi-select UI for choosing 5 players from roster
- [x] 5.2 Enforce exactly 5 player selection validation
- [x] 5.3 Add participant identifier input (player name/ID)
- [x] 5.4 Implement Server Action for placing bet with transaction
- [x] 5.5 Add duplicate participation prevention
- [x] 5.6 Prevent participation on closed/resolved bets

## 6. Pot Tracking and Display

- [x] 6.1 Create bet details display component
- [x] 6.2 Calculate and display total pot size
- [x] 6.3 Display participant count
- [x] 6.4 Create participant list component showing all groups
- [x] 6.5 Group participants by identical chosen groups
- [x] 6.6 Add real-time bet status display (open/closed/resolved)

## 7. Bet Lifecycle Management

- [x] 7.1 Implement bet status check logic (compare current time vs closing time)
- [x] 7.2 Create UI to display bet status with visual indicators
- [x] 7.3 Add automatic status transition handling on page load/refresh
- [x] 7.4 Prevent participation when bet is closed

## 8. Bet Resolution

- [x] 8.1 Create resolution UI for selecting winning group
- [x] 8.2 Display all unique groups that participants bet on
- [x] 8.3 Implement Server Action to resolve bet and record winner
- [x] 8.4 Add validation to prevent resolving open bets
- [x] 8.5 Calculate and display winners
- [x] 8.6 Calculate individual payouts (pot / winner count)
- [x] 8.7 Handle no-winner scenario display

## 9. Main Application Pages

- [x] 9.1 Create home page with bet list
- [x] 9.2 Create new bet page
- [x] 9.3 Create bet detail page with participation and tracking
- [x] 9.4 Create roster management page
- [x] 9.5 Add navigation between pages

## 10. Deployment

- [x] 10.1 Configure vercel.json if needed
- [x] 10.2 Set up Vercel KV in Vercel dashboard
- [x] 10.3 Add environment variables to Vercel project
- [x] 10.4 Deploy to Vercel and verify all functionality
- [x] 10.5 Test bet lifecycle end-to-end in production
