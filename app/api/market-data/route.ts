import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulate real-time market data
    const marketData = {
      totalVolume: Math.floor(Math.random() * 5000000) + 30000000,
      totalAssets: Math.floor(Math.random() * 20) + 80,
      avgPrice: Math.floor(Math.random() * 200000) + 1100000,
      activeTraders: Math.floor(Math.random() * 300) + 1200,
      trends: {
        volume: Math.random() > 0.5 ? "up" : "down",
        price: Math.random() > 0.3 ? "up" : "down",
        activity: Math.random() > 0.4 ? "up" : "down",
      },
      topAssets: [
        {
          name: "Manhattan Office Complex",
          value: Math.floor(Math.random() * 500000) + 2000000,
          change: (Math.random() - 0.5) * 20,
          volume24h: Math.floor(Math.random() * 1000000) + 500000,
        },
        {
          name: "Picasso Original Painting",
          value: Math.floor(Math.random() * 300000) + 1500000,
          change: (Math.random() - 0.5) * 15,
          volume24h: Math.floor(Math.random() * 800000) + 300000,
        },
      ],
    }

    return NextResponse.json(marketData)
  } catch (error) {
    console.error("Market data error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
