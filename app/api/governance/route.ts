import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const mockGovernanceData = {
      activeProposals: 2,
      totalParticipants: 12847,
      proposalsPassed: 8,
      userVotingPower: 1747,
      proposals: [
        {
          id: "1",
          title: "Increase Eco Action Rewards by 25%",
          description: "Proposal to increase rewards for eco-friendly actions",
          status: "active",
          votesFor: 12500000,
          votesAgainst: 3200000,
          quorum: 10000000,
          endDate: "2024-07-15",
        },
      ],
    }

    return NextResponse.json(mockGovernanceData)
  } catch (error) {
    console.error("Governance data error:", error)
    return NextResponse.json({ error: "Failed to fetch governance data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, proposalId, vote, userId } = body

    if (action === "vote") {
      // Simulate voting on proposal
      const result = {
        success: true,
        proposalId,
        vote, // true for "for", false for "against"
        votingPower: 1747,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json(result)
    }

    if (action === "create") {
      // Simulate proposal creation
      const result = {
        success: true,
        proposalId: `prop_${Date.now()}`,
        status: "pending",
        reviewPeriod: "7 days",
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Governance action error:", error)
    return NextResponse.json({ error: "Action failed" }, { status: 500 })
  }
}
