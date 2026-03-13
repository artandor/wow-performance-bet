#!/usr/bin/env node

/**
 * Migration script to add serverId to existing bets and create server indexes
 * Usage: node --env-file=.env.local scripts/migrate-bets-to-server.js <serverId>
 */

const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error('Error: REDIS_URL not found in environment variables');
  process.exit(1);
}

const serverId = process.argv[2];

if (!serverId) {
  console.error('Error: Server ID is required');
  console.error('Usage: node --env-file=.env.local scripts/migrate-bets-to-server.js <serverId>');
  process.exit(1);
}

const redis = new Redis(REDIS_URL);

async function migrateBets() {
  try {
    console.log('🔍 Finding all bets...\n');
    
    // Get all bet keys
    const betKeys = await redis.keys('bet:*');
    console.log(`Found ${betKeys.length} total bets\n`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const key of betKeys) {
      const betJson = await redis.get(key);
      if (!betJson) continue;
      
      const bet = JSON.parse(betJson);
      const betId = key.replace('bet:', '');
      
      // Skip if bet already has a serverId
      if (bet.serverId) {
        console.log(`⏭️  Skipping bet ${betId} - already has serverId: ${bet.serverId}`);
        skippedCount++;
        continue;
      }
      
      // Add serverId to bet
      bet.serverId = serverId;
      
      // Save updated bet
      await redis.set(key, JSON.stringify(bet));
      
      // Add to server index
      await redis.sadd(`server:${serverId}:bets`, betId);
      
      console.log(`✅ Migrated bet ${betId} to server ${serverId}`);
      console.log(`   Title: ${bet.title || '(no title)'}`);
      console.log(`   Status: ${bet.status}`);
      console.log(`   Participants: ${bet.participants?.length || 0}\n`);
      
      migratedCount++;
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Migrated: ${migratedCount} bets`);
    console.log(`   Skipped: ${skippedCount} bets (already had serverId)`);
    console.log(`   Total: ${betKeys.length} bets`);
    
    // Verify server index
    const serverBets = await redis.smembers(`server:${serverId}:bets`);
    console.log(`\n✅ Server ${serverId} now has ${serverBets.length} bets in its index`);
    
    await redis.quit();
    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('\n❌ Error during migration:', error);
    await redis.quit();
    process.exit(1);
  }
}

migrateBets();
