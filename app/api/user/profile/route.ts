import { type NextRequest, NextResponse } from "next/server"
import { dbOps } from "@/lib/database-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const user = await dbOps.getUserByWallet(walletAddress)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user analytics
    const analytics = await dbOps.getUserAnalytics(walletAddress)

    // Get recent eco actions
    const recentActions = await dbOps.getEcoActionsByUser(walletAddress, 5)

    // Get recent transactions
    const recentTransactions = await dbOps.getTransactionsByUser(walletAddress, 10)

    return NextResponse.json({
      user,
      analytics,
      recentActions,
      recentTransactions,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, email, username } = body

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await dbOps.getUserByWallet(walletAddress)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = await dbOps.createUser({
      walletAddress,
      email,
      username,
      ecoTokenBalance: 100, // Welcome bonus
      stakedTokens: 0,
      stakingRewards: 0,
      totalEcoActions: 0,
      totalCarbonOffset: 0,
      ecoScore: 0,
      joinedAt: new Date(),
      lastActive: new Date(),
      tier: "beginner",
      achievements: ["welcome_bonus"],
    })

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
