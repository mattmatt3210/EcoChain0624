import type { ObjectId } from "mongodb"

// User model
export interface User {
  _id?: ObjectId
  walletAddress: string
  email?: string
  username?: string
  ecoTokenBalance: number
  stakedTokens: number
  stakingRewards: number
  totalEcoActions: number
  totalCarbonOffset: number
  ecoScore: number
  joinedAt: Date
  lastActive: Date
  tier: "beginner" | "intermediate" | "advanced" | "expert"
  achievements: string[]
}

// Eco Action model
export interface EcoAction {
  _id?: ObjectId
  userId: ObjectId
  walletAddress: string
  actionType: "energy" | "water" | "recycling" | "transport" | "planting"
  description: string
  ecoReward: number
  carbonOffset: number
  verificationMethod: string
  status: "pending" | "verified" | "rejected"
  aiAnalysis?: {
    impactScore: number
    confidence: number
    sustainabilityRating: number
    recommendations: string[]
  }
  timestamp: Date
  verifiedAt?: Date
  transactionHash?: string
}

// Governance Proposal model
export interface GovernanceProposal {
  _id?: ObjectId
  title: string
  description: string
  proposer: string
  proposerAddress: string
  status: "active" | "passed" | "rejected" | "executed"
  votesFor: number
  votesAgainst: number
  quorum: number
  startDate: Date
  endDate: Date
  createdAt: Date
  votes: Array<{
    voterAddress: string
    vote: boolean
    votingPower: number
    timestamp: Date
  }>
}

// Transaction model
export interface Transaction {
  _id?: ObjectId
  transactionHash: string
  fromAddress: string
  toAddress: string
  amount: number
  type: "transfer" | "stake" | "unstake" | "reward" | "governance" | "utility_payment"
  status: "pending" | "confirmed" | "failed"
  blockNumber?: number
  gasUsed?: number
  timestamp: Date
  metadata?: any
}

// Staking record model
export interface StakingRecord {
  _id?: ObjectId
  userAddress: string
  amount: number
  stakingPeriod: number
  startDate: Date
  endDate: Date
  status: "active" | "completed" | "withdrawn"
  rewardsEarned: number
  transactionHash: string
}

// Platform Statistics model
export interface PlatformStats {
  _id?: ObjectId
  date: Date
  totalUsers: number
  activeUsers: number
  totalEcoActions: number
  totalCarbonOffset: number
  ecoTokensDistributed: number
  totalStaked: number
  governanceParticipation: number
  utilityPaymentsVolume: number
}
