import { getDatabase } from "./mongodb"
import type { User, EcoAction, GovernanceProposal, Transaction, StakingRecord, PlatformStats } from "./database-models"
import { ObjectId } from "mongodb"

export class DatabaseOperations {
  private async getDb() {
    return await getDatabase()
  }

  // User operations
  async createUser(userData: Omit<User, "_id">): Promise<User> {
    const db = await this.getDb()
    const result = await db.collection<User>("users").insertOne(userData)
    return { ...userData, _id: result.insertedId }
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const db = await this.getDb()
    return await db.collection<User>("users").findOne({ walletAddress })
  }

  async updateUserBalance(walletAddress: string, ecoTokenBalance: number): Promise<void> {
    const db = await this.getDb()
    await db.collection<User>("users").updateOne(
      { walletAddress },
      {
        $set: { ecoTokenBalance, lastActive: new Date() },
        $inc: { totalEcoActions: 1 },
      },
    )
  }

  async updateUserEcoScore(walletAddress: string, ecoScore: number, carbonOffset: number): Promise<void> {
    const db = await this.getDb()
    await db.collection<User>("users").updateOne(
      { walletAddress },
      {
        $set: { ecoScore },
        $inc: { totalCarbonOffset: carbonOffset },
      },
    )
  }

  // Eco Action operations
  async createEcoAction(actionData: Omit<EcoAction, "_id">): Promise<EcoAction> {
    const db = await this.getDb()
    const result = await db.collection<EcoAction>("eco_actions").insertOne(actionData)
    return { ...actionData, _id: result.insertedId }
  }

  async getEcoActionsByUser(walletAddress: string, limit = 10): Promise<EcoAction[]> {
    const db = await this.getDb()
    return await db
      .collection<EcoAction>("eco_actions")
      .find({ walletAddress })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
  }

  async verifyEcoAction(actionId: string, transactionHash: string): Promise<void> {
    const db = await this.getDb()
    await db.collection<EcoAction>("eco_actions").updateOne(
      { _id: new ObjectId(actionId) },
      {
        $set: {
          status: "verified",
          verifiedAt: new Date(),
          transactionHash,
        },
      },
    )
  }

  // Governance operations
  async createProposal(proposalData: Omit<GovernanceProposal, "_id">): Promise<GovernanceProposal> {
    const db = await this.getDb()
    const result = await db.collection<GovernanceProposal>("governance_proposals").insertOne(proposalData)
    return { ...proposalData, _id: result.insertedId }
  }

  async getActiveProposals(): Promise<GovernanceProposal[]> {
    const db = await this.getDb()
    return await db
      .collection<GovernanceProposal>("governance_proposals")
      .find({ status: "active", endDate: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .toArray()
  }

  async voteOnProposal(proposalId: string, voterAddress: string, vote: boolean, votingPower: number): Promise<void> {
    const db = await this.getDb()
    const updateField = vote ? "votesFor" : "votesAgainst"

    await db.collection<GovernanceProposal>("governance_proposals").updateOne(
      { _id: new ObjectId(proposalId) },
      {
        $inc: { [updateField]: votingPower },
        $push: {
          votes: {
            voterAddress,
            vote,
            votingPower,
            timestamp: new Date(),
          },
        },
      },
    )
  }

  // Transaction operations
  async createTransaction(transactionData: Omit<Transaction, "_id">): Promise<Transaction> {
    const db = await this.getDb()
    const result = await db.collection<Transaction>("transactions").insertOne(transactionData)
    return { ...transactionData, _id: result.insertedId }
  }

  async getTransactionsByUser(userAddress: string, limit = 20): Promise<Transaction[]> {
    const db = await this.getDb()
    return await db
      .collection<Transaction>("transactions")
      .find({
        $or: [{ fromAddress: userAddress }, { toAddress: userAddress }],
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
  }

  async updateTransactionStatus(
    transactionHash: string,
    status: "confirmed" | "failed",
    blockNumber?: number,
  ): Promise<void> {
    const db = await this.getDb()
    await db.collection<Transaction>("transactions").updateOne(
      { transactionHash },
      {
        $set: {
          status,
          ...(blockNumber && { blockNumber }),
        },
      },
    )
  }

  // Staking operations
  async createStakingRecord(stakingData: Omit<StakingRecord, "_id">): Promise<StakingRecord> {
    const db = await this.getDb()
    const result = await db.collection<StakingRecord>("staking_records").insertOne(stakingData)
    return { ...stakingData, _id: result.insertedId }
  }

  async getActiveStakingRecords(userAddress: string): Promise<StakingRecord[]> {
    const db = await this.getDb()
    return await db.collection<StakingRecord>("staking_records").find({ userAddress, status: "active" }).toArray()
  }

  async updateStakingRewards(stakingId: string, rewardsEarned: number): Promise<void> {
    const db = await this.getDb()
    await db
      .collection<StakingRecord>("staking_records")
      .updateOne({ _id: new ObjectId(stakingId) }, { $set: { rewardsEarned } })
  }

  // Platform statistics
  async updatePlatformStats(statsData: Omit<PlatformStats, "_id">): Promise<void> {
    const db = await this.getDb()
    await db
      .collection<PlatformStats>("platform_stats")
      .replaceOne({ date: statsData.date }, statsData, { upsert: true })
  }

  async getPlatformStats(): Promise<PlatformStats | null> {
    const db = await this.getDb()
    return await db.collection<PlatformStats>("platform_stats").findOne({}, { sort: { date: -1 } })
  }

  // Analytics queries
  async getUserAnalytics(walletAddress: string): Promise<any> {
    const db = await this.getDb()

    const pipeline = [
      { $match: { walletAddress } },
      {
        $lookup: {
          from: "eco_actions",
          localField: "walletAddress",
          foreignField: "walletAddress",
          as: "actions",
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "walletAddress",
          foreignField: "fromAddress",
          as: "transactions",
        },
      },
      {
        $project: {
          walletAddress: 1,
          ecoTokenBalance: 1,
          ecoScore: 1,
          totalCarbonOffset: 1,
          actionsCount: { $size: "$actions" },
          transactionsCount: { $size: "$transactions" },
          actionsByType: {
            $reduce: {
              input: "$actions",
              initialValue: {},
              in: {
                $mergeObjects: [
                  "$$value",
                  {
                    $arrayToObject: [
                      [
                        {
                          k: "$$this.actionType",
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: "$$this.actionType", input: "$$value" } }, 0] },
                              1,
                            ],
                          },
                        },
                      ],
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ]

    const result = await db.collection<User>("users").aggregate(pipeline).toArray()
    return result[0] || null
  }
}

export const dbOps = new DatabaseOperations()
