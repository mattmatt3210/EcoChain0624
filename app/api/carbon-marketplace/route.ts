import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const mockMarketData = {
      totalVolume: 2847392,
      avgPrice: 12.45,
      activeProjects: 156,
      totalOffset: 8934567,
      carbonCredits: [
        {
          id: "1",
          projectName: "Amazon Rainforest Conservation",
          projectType: "forestry",
          location: "Brazil",
          price: 15.5,
          available: 10000,
          totalSupply: 50000,
          verification: "Verra VCS",
          vintage: "2024",
        },
        {
          id: "2",
          projectName: "Wind Farm Development",
          projectType: "renewable",
          location: "Texas, USA",
          price: 11.25,
          available: 25000,
          totalSupply: 100000,
          verification: "Gold Standard",
          vintage: "2024",
        },
      ],
    }

    return NextResponse.json(mockMarketData)
  } catch (error) {
    console.error("Market data error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, creditId, amount, userId } = body

    if (action === "purchase") {
      // Simulate carbon credit purchase
      const result = {
        success: true,
        transactionId: `tx_${Date.now()}`,
        creditId,
        amount,
        totalCost: amount * 12.45, // Mock price
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json(result)
    }

    if (action === "burn") {
      // Simulate carbon credit burning for offsetting
      const result = {
        success: true,
        burnId: `burn_${Date.now()}`,
        amount,
        certificateUrl: `https://ecochain.org/certificates/burn_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Carbon marketplace error:", error)
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 })
  }
}
