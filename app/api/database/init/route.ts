import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const db = await getDatabase()

    // Create indexes for better performance
    await Promise.all([
      // Users collection indexes
      db
        .collection("users")
        .createIndex({ walletAddress: 1 }, { unique: true }),
      db.collection("users").createIndex({ email: 1 }, { sparse: true }),
      db.collection("users").createIndex({ ecoScore: -1 }),

      // Eco actions collection indexes
      db
        .collection("eco_actions")
        .createIndex({ walletAddress: 1 }),
      db.collection("eco_actions").createIndex({ timestamp: -1 }),
      db.collection("eco_actions").createIndex({ status: 1 }),
      db.collection("eco_actions").createIndex({ actionType: 1 }),

      // Governance proposals collection indexes
      db
        .collection("governance_proposals")
        .createIndex({ status: 1 }),
      db.collection("governance_proposals").createIndex({ endDate: 1 }),
      db.collection("governance_proposals").createIndex({ createdAt: -1 }),

      // Transactions collection indexes
      db
        .collection("transactions")
        .createIndex({ transactionHash: 1 }, { unique: true }),
      db.collection("transactions").createIndex({ fromAddress: 1 }),
      db.collection("transactions").createIndex({ toAddress: 1 }),
      db.collection("transactions").createIndex({ timestamp: -1 }),

      // Staking records collection indexes
      db
        .collection("staking_records")
        .createIndex({ userAddress: 1 }),
      db.collection("staking_records").createIndex({ status: 1 }),
      db.collection("staking_records").createIndex({ endDate: 1 }),

      // Platform stats collection indexes
      db
        .collection("platform_stats")
        .createIndex({ date: -1 }),
    ])

    // Insert initial platform stats
    const initialStats = {
      date: new Date(),
      totalUsers: 0,
      activeUsers: 0,
      totalEcoActions: 0,
      totalCarbonOffset: 0,
      ecoTokensDistributed: 0,
      totalStaked: 0,
      governanceParticipation: 0,
      utilityPaymentsVolume: 0,
    }

    await db.collection("platform_stats").replaceOne({ date: initialStats.date }, initialStats, { upsert: true })

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      collections: [
        "users",
        "eco_actions",
        "governance_proposals",
        "transactions",
        "staking_records",
        "platform_stats",
      ],
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
      },
      { status: 500 },
    )
  }
}
