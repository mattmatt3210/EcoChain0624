import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { actionType, data, userId } = body

    // Simulate IoT verification and reward calculation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const rewardCalculation = {
      energy: { baseReward: 25, carbonOffset: 0.12 },
      water: { baseReward: 20, carbonOffset: 0.08 },
      recycling: { baseReward: 30, carbonOffset: 0.1 },
      transport: { baseReward: 40, carbonOffset: 0.25 },
      planting: { baseReward: 50, carbonOffset: 0.35 },
    }

    const reward = rewardCalculation[actionType as keyof typeof rewardCalculation] || {
      baseReward: 15,
      carbonOffset: 0.05,
    }

    const result = {
      success: true,
      actionId: `action_${Date.now()}`,
      ecoReward: reward.baseReward,
      carbonOffset: reward.carbonOffset,
      verificationMethod: "IoT Device Verification",
      status: "verified",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Eco action verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return user's eco action history
    const mockHistory = [
      {
        id: "1",
        type: "energy",
        description: "Reduced electricity usage by 15%",
        ecoReward: 25,
        carbonOffset: 0.12,
        status: "verified",
        timestamp: "2024-06-20T10:30:00Z",
      },
      {
        id: "2",
        type: "transport",
        description: "Used public transport for 5 days",
        ecoReward: 40,
        carbonOffset: 0.25,
        status: "verified",
        timestamp: "2024-06-19T14:15:00Z",
      },
    ]

    return NextResponse.json({ actions: mockHistory })
  } catch (error) {
    console.error("Error fetching eco actions:", error)
    return NextResponse.json({ error: "Failed to fetch actions" }, { status: 500 })
  }
}
