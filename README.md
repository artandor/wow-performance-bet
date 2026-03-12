# WoW DPS Betting Application

A Next.js application for managing World of Warcraft betting pools where guild members can bet on which 5-player group will perform best in game content.

## Features

- **Roster Management**: Import and manage player rosters
- **Bet Creation**: Create bets with gold amounts and time windows
- **Bet Participation**: Place bets on 5-player groups
- **Bet Controls**: Manually close/reopen bets, or delete them
- **Pot Tracking**: View total pot size and all participants
- **Bet Resolution**: Resolve bets and calculate winners

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Redis (via Vercel KV or Redis Cloud)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Redis database (either Vercel KV or Redis Cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with your Redis credentials:

**Option 1: Redis Cloud**
```
REDIS_URL=redis://default:your_password@your-host:port
```

**Option 2: Vercel KV**
```
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_readonly_token
```

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment to Vercel

### 10.2 Set up Vercel KV in Vercel dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Create Database
3. Select "KV" (Redis)
4. Create the database and note the credentials

### 10.3 Add environment variables to Vercel project

1. In your Vercel project settings
2. Go to Settings → Environment Variables
3. Add the following from your KV database:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 10.4 Deploy to Vercel

Push your code to GitHub, then:

1. Import project in Vercel dashboard
2. Select your repository
3. Vercel will auto-detect Next.js
4. Click "Deploy"

Or use Vercel CLI:
```bash
vercel
```

### 10.5 Test bet lifecycle end-to-end in production

After deployment:

1. Navigate to your Vercel URL
2. Go to "Manage Roster" and import player names
3. Create a new bet with gold amount and closing time
4. Place bets on different 5-player groups
5. Wait for bet to close (or set a short closing time)
6. Resolve the bet by selecting the winning group
7. Verify winners and payouts are calculated correctly

## Project Structure

```
├── app/
│   ├── actions/          # Server Actions
│   ├── bets/            # Bet pages
│   ├── roster/          # Roster management
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Utility functions
│   ├── bet-storage.ts   # Bet CRUD operations
│   ├── roster-storage.ts # Roster operations
│   ├── bet-transactions.ts # Participant management
│   ├── bet-status.ts    # Status logic
│   └── kv.ts           # KV wrapper
└── types/              # TypeScript types
```

## Usage

1. **Import Roster**: Go to Manage Roster and paste player names (one per line)
2. **Create Bet**: Click "Create Bet", set gold amount and closing time
3. **Place Bets**: Select exactly 5 players from roster and submit
4. **Track Progress**: View pot size and all participants on bet detail page
5. **Resolve**: After bet closes, select winning group to distribute winnings

## License

MIT
# wow-performance-bet
