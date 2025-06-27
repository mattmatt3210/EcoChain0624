const { MongoClient } = require("mongodb")

const uri =
  "mongodb+srv://puppyhappy344:01234567890@cluster0.blrig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "ecochain"

async function setupDatabase() {
  console.log("🚀 Setting up EcoChain MongoDB Database...")

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB Atlas")

    const db = client.db(dbName)

    // Create collections with validation schemas
    const collections = [
      {
        name: "users",
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["walletAddress", "ecoTokenBalance", "joinedAt"],
            properties: {
              walletAddress: { bsonType: "string" },
              email: { bsonType: "string" },
              username: { bsonType: "string" },
              ecoTokenBalance: { bsonType: "number", minimum: 0 },
              stakedTokens: { bsonType: "number", minimum: 0 },
              ecoScore: { bsonType: "number", minimum: 0, maximum: 100 },
              tier: { enum: ["beginner", "intermediate", "advanced", "expert"] },
            },
          },
        },
      },
      {
        name: "eco_actions",
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["walletAddress", "actionType", "ecoReward", "timestamp"],
            properties: {
              walletAddress: { bsonType: "string" },
              actionType: { enum: ["energy", "water", "recycling", "transport", "planting"] },
              ecoReward: { bsonType: "number", minimum: 0 },
              carbonOffset: { bsonType: "number", minimum: 0 },
              status: { enum: ["pending", "verified", "rejected"] },
            },
          },
        },
      },
      {
        name: "governance_proposals",
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["title", "proposer", "status", "createdAt"],
            properties: {
              title: { bsonType: "string" },
              proposer: { bsonType: "string" },
              status: { enum: ["active", "passed", "rejected", "executed"] },
              votesFor: { bsonType: "number", minimum: 0 },
              votesAgainst: { bsonType: "number", minimum: 0 },
            },
          },
        },
      },
      {
        name: "transactions",
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["transactionHash", "fromAddress", "amount", "type", "timestamp"],
            properties: {
              transactionHash: { bsonType: "string" },
              fromAddress: { bsonType: "string" },
              toAddress: { bsonType: "string" },
              amount: { bsonType: "number", minimum: 0 },
              type: { enum: ["transfer", "stake", "unstake", "reward", "governance", "utility_payment"] },
              status: { enum: ["pending", "confirmed", "failed"] },
            },
          },
        },
      },
      {
        name: "staking_records",
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["userAddress", "amount", "startDate", "status"],
            properties: {
              userAddress: { bsonType: "string" },
              amount: { bsonType: "number", minimum: 0 },
              stakingPeriod: { bsonType: "number", minimum: 1 },
              status: { enum: ["active", "completed", "withdrawn"] },
              rewardsEarned: { bsonType: "number", minimum: 0 },
            },
          },
        },
      },
      {
        name: "platform_stats",
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["date", "totalUsers"],
            properties: {
              date: { bsonType: "date" },
              totalUsers: { bsonType: "number", minimum: 0 },
              activeUsers: { bsonType: "number", minimum: 0 },
              totalEcoActions: { bsonType: "number", minimum: 0 },
              totalCarbonOffset: { bsonType: "number", minimum: 0 },
            },
          },
        },
      },
    ]

    // Create collections
    for (const collection of collections) {
      try {
        await db.createCollection(collection.name, {
          validator: collection.validator,
        })
        console.log(`✅ Created collection: ${collection.name}`)
      } catch (error) {
        if (error.code === 48) {
          console.log(`ℹ️  Collection ${collection.name} already exists`)
        } else {
          console.error(`❌ Error creating collection ${collection.name}:`, error.message)
        }
      }
    }

    // Create indexes
    console.log("📊 Creating database indexes...")

    const indexOperations = [
      { collection: "users", index: { walletAddress: 1 }, options: { unique: true } },
      { collection: "users", index: { ecoScore: -1 } },
      { collection: "eco_actions", index: { walletAddress: 1 } },
      { collection: "eco_actions", index: { timestamp: -1 } },
      { collection: "governance_proposals", index: { status: 1 } },
      { collection: "transactions", index: { transactionHash: 1 }, options: { unique: true } },
      { collection: "transactions", index: { fromAddress: 1 } },
      { collection: "staking_records", index: { userAddress: 1 } },
      { collection: "platform_stats", index: { date: -1 } },
    ]

    for (const { collection, index, options = {} } of indexOperations) {
      try {
        await db.collection(collection).createIndex(index, options)
        console.log(`✅ Created index on ${collection}:`, Object.keys(index).join(", "))
      } catch (error) {
        console.error(`❌ Error creating index on ${collection}:`, error.message)
      }
    }

    // Insert sample data
    console.log("📝 Inserting sample data...")

    const sampleUser = {
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C89",
      username: "EcoChampion",
      email: "demo@ecochain.org",
      ecoTokenBalance: 1500,
      stakedTokens: 500,
      stakingRewards: 25,
      totalEcoActions: 12,
      totalCarbonOffset: 2.5,
      ecoScore: 85,
      joinedAt: new Date(),
      lastActive: new Date(),
      tier: "advanced",
      achievements: ["welcome_bonus", "first_action", "eco_warrior", "carbon_saver"],
    }

    try {
      await db.collection("users").insertOne(sampleUser)
      console.log("✅ Inserted sample user")
    } catch (error) {
      if (error.code === 11000) {
        console.log("ℹ️  Sample user already exists")
      } else {
        console.error("❌ Error inserting sample user:", error.message)
      }
    }

    const sampleProposal = {
      title: "Increase Eco Action Rewards by 25%",
      description: "Proposal to increase rewards for all eco-friendly actions to encourage more participation",
      proposer: "EcoChampion",
      proposerAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C89",
      status: "active",
      votesFor: 12500000,
      votesAgainst: 3200000,
      quorum: 10000000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      votes: [],
    }

    try {
      await db.collection("governance_proposals").insertOne(sampleProposal)
      console.log("✅ Inserted sample governance proposal")
    } catch (error) {
      console.error("❌ Error inserting sample proposal:", error.message)
    }

    const initialStats = {
      date: new Date(),
      totalUsers: 1,
      activeUsers: 1,
      totalEcoActions: 12,
      totalCarbonOffset: 2.5,
      ecoTokensDistributed: 1500,
      totalStaked: 500,
      governanceParticipation: 78.5,
      utilityPaymentsVolume: 2500,
    }

    try {
      await db.collection("platform_stats").insertOne(initialStats)
      console.log("✅ Inserted initial platform statistics")
    } catch (error) {
      console.error("❌ Error inserting platform stats:", error.message)
    }

    console.log("\n🎉 EcoChain Database Setup Complete!")
    console.log("📊 Database Name:", dbName)
    console.log("🔗 Connection URI:", uri.replace(/\/\/.*@/, "//***:***@"))
    console.log("📁 Collections Created:", collections.length)
    console.log("📈 Indexes Created:", indexOperations.length)
  } catch (error) {
    console.error("❌ Database setup failed:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the setup
setupDatabase().catch(console.error)
