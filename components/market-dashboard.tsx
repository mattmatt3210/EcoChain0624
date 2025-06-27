"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, RefreshCw } from "lucide-react"

const marketData = [
  { date: "2024-01", volume: 12500000, tokens: 45, avgPrice: 850000 },
  { date: "2024-02", volume: 15200000, tokens: 52, avgPrice: 920000 },
  { date: "2024-03", volume: 18700000, tokens: 61, avgPrice: 980000 },
  { date: "2024-04", volume: 22100000, tokens: 68, avgPrice: 1050000 },
  { date: "2024-05", volume: 26800000, tokens: 74, avgPrice: 1120000 },
  { date: "2024-06", volume: 31500000, tokens: 82, avgPrice: 1180000 },
]

const assetDistribution = [
  { name: "Real Estate", value: 45, color: "#0088FE" },
  { name: "Art & Collectibles", value: 25, color: "#00C49F" },
  { name: "Intellectual Property", value: 20, color: "#FFBB28" },
  { name: "Commodities", value: 10, color: "#FF8042" },
]

const topAssets = [
  { name: "Manhattan Office Complex", value: 2500000, change: 12.5, tokens: 1000 },
  { name: "Picasso Original Painting", value: 1800000, change: -3.2, tokens: 500 },
  { name: "Tech Patent Portfolio", value: 1200000, change: 8.7, tokens: 300 },
  { name: "Gold Reserve Vault", value: 950000, change: 5.1, tokens: 200 },
]

export default function MarketDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [marketStats, setMarketStats] = useState({
    totalVolume: 31500000,
    totalAssets: 82,
    avgPrice: 1180000,
    activeTraders: 1247,
  })

  const refreshData = async () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setMarketStats({
        totalVolume: Math.floor(Math.random() * 5000000) + 30000000,
        totalAssets: Math.floor(Math.random() * 20) + 80,
        avgPrice: Math.floor(Math.random() * 200000) + 1100000,
        activeTraders: Math.floor(Math.random() * 300) + 1200,
      })
      setIsRefreshing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketStats.totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8 new assets this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Asset Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketStats.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.activeTraders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +156 new traders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Market Volume Trend</CardTitle>
                <CardDescription>Monthly trading volume and asset count over time</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "volume" ? `$${value.toLocaleString()}` : value,
                    name === "volume" ? "Volume" : "Assets",
                  ]}
                />
                <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} name="volume" />
                <Line type="monotone" dataKey="tokens" stroke="#dc2626" strokeWidth={2} name="tokens" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Breakdown of tokenized assets by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Assets</CardTitle>
          <CardDescription>Highest valued tokenized assets with recent performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topAssets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{asset.name}</h4>
                    <p className="text-sm text-gray-600">{asset.tokens} tokens issued</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${asset.value.toLocaleString()}</div>
                  <div className="flex items-center gap-1">
                    {asset.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${asset.change > 0 ? "text-green-600" : "text-red-600"}`}>
                      {asset.change > 0 ? "+" : ""}
                      {asset.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
