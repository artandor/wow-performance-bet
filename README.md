# WoW Performance Betting Application

A Next.js application for managing World of Warcraft betting pools where guild members can bet on which 5-player group will perform best in game content.

## Features

- **Roster Management**: Import and manage player rosters
- **Bet Creation**: Create bets with gold amounts and time windows
- **Bet Participation**: Place bets on 5-player groups (exactly 5 players required)
- **Bet Controls**: Manually close/reopen bets before scheduled time, or delete them
- **Pot Tracking**: View total pot size and all participants grouped by team
- **Bet Resolution**: Resolve bets with automatic pot splitting among winners, display losers

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Redis (via Vercel KV or Redis Cloud with ioredis)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Redis database (either Vercel KV or Redis Cloud)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/artandor/wow-performance-bet.git
cd wow-performance-bet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the project root with your Redis credentials.

The application automatically detects which Redis backend to use based on environment variables present.

**Option 1: Redis Cloud (using ioredis)**
```env
REDIS_URL=redis://default:your_password@your-host:port
```

**Option 2: Vercel KV (using @vercel/kv REST API)**
```env
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_readonly_token
```

See `.env.example` for a template.

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment to Vercel

### Option A: Using Vercel KV

1. **Create Vercel KV Database**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Storage → Create Database
   - Select "KV" (Redis)
   - Create the database and note the credentials

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Import project in Vercel dashboard
   - Select your repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Link KV Database**
   - In your Vercel project settings
   - Go to Storage → Connect to your KV database
   - Environment variables will be automatically added

### Option B: Using Redis Cloud

1. **Get Redis Cloud credentials**
   - Sign up at [Redis Cloud](https://redis.com/try-free/)
   - Create a database and get the connection URL

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Import project in Vercel dashboard

3. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Add `REDIS_URL` with your Redis Cloud connection string

Or use Vercel CLI:
```bash
vercel
```

### Testing the Application

After deployment:

1. Navigate to your deployment URL
2. Go to "Manage Roster" and import player names (one per line)
3. Create a new bet with gold amount and closing time
4. Place bets on different 5-player groups
5. Optionally close the bet manually, or wait for scheduled closing time
6. Resolve the bet by selecting the winning group
7. Verify winners, losers, and payouts are displayed correctly

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

1. **Import Roster**: Go to "Manage Roster" and paste player names (one per line)
2. **Create Bet**: Click "Create Bet", set gold amount and closing time (future date/time)
3. **Place Bets**: On bet detail page, enter your player ID and select exactly 5 players from roster
4. **Track Progress**: View pot size, all participants grouped by team, and time remaining
5. **Manual Controls** (optional): 
   - Close bet early using "Close Bet Now" button
   - Reopen a closed bet using "Reopen Bet" button
   - Delete a bet from the home page
6. **Resolve**: After bet closes, select the winning group to distribute pot among winners

## How Pot Distribution Works

- Each participant contributes the same gold amount (set when bet is created)
- Total pot = gold amount × number of participants
- If multiple participants select the winning group, pot is split evenly among them
- Winners are shown with their payout: `+X gold`
- Losers are shown with their loss: `-X gold`

## Data Storage

The application uses Redis for all data storage:

- **Bets**: Stored with key pattern `bet:{betId}`
- **Roster**: Stored with key `roster`
- **Bet List**: Maintained as a set with key `bets`

No authentication is implemented in v1, so the application is open to all users who can access the URL.

## License

MIT
