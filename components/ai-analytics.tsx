"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Brain, AlertTriangle, CheckCircle } from "lucide-react"

const mockPriceData = [
  { date: "2024-01", price: 950000, prediction: 960000 },
  { date: "2024-02", price: 965000, prediction: 975000 },
  { date: "2024-03", price: 980000, prediction: 990000 },
  { date: "2024-04", price: 995000, prediction: 1005000 },
  { date: "2024-05", price: 1010000, prediction: 1020000 },
  { date: "2024-06", price: 1025000, prediction: 1035000 },
]

const mockRiskFactors = [
  { factor: "Market Volatility", score: 25, status: "low" },
  { factor: "Liquidity Risk", score: 40, status: "medium" },
  { factor: "Regulatory Risk", score: 15, status: "low" },
  { factor: "Credit Risk", score: 30, status: "medium" },
  { factor: "Operational Risk", score: 20, status: "low" },
]

export default function AIAnalytics() {
  const [selectedMetric, setSelectedMetric] = useState("valuation")
  const [isLoading, setIsLoading] = useState(false)
  const [aiInsights, setAiInsights] = useState({
    marketTrend: "Bullish",
    confidenceLevel: 87,
    nextPrediction: 1045000,
    riskScore: 28,
    recommendation: "BUY",
  })

  const refreshAnalysis = async () => {
    setIsLoading(true)
    // Simulate AI analysis
    setTimeout(() => {
      setAiInsights({
        marketTrend: Math.random() > 0.5 ? "Bullish" : "Bearish",
        confidenceLevel: Math.floor(Math.random() * 20) + 80,
        nextPrediction: Math.floor(Math.random() * 100000) + 1000000,
        riskScore: Math.floor(Math.random() * 50) + 10,
        recommendation: Math.random() > 0.3 ? "BUY" : "HOLD",
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Market Intelligence
              </CardTitle>
              <CardDescription>Real-time AI-powered market analysis and predictions</CardDescription>
            </div>
            <Button onClick={refreshAnalysis} disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Refresh Analysis"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {aiInsights.marketTrend === "Bullish" ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">{aiInsights.marketTrend}</span>
              </div>
              <p className="text-sm text-gray-600">Market Trend</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{aiInsights.confidenceLevel}%</div>
              <p className="text-sm text-gray-600">AI Confidence</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-green-600 mb-2">${aiInsights.nextPrediction.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Next Month Prediction</p>
            </div>

            <div className="text-center">
              <Badge variant={aiInsights.recommendation === "BUY" ? "default" : "secondary"} className="mb-2">
                {aiInsights.recommendation}
              </Badge>
              <p className="text-sm text-gray-600">AI Recommendation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Prediction vs Actual</CardTitle>
            <CardDescription>AI model predictions compared to actual market prices</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} name="Actual Price" />
                <Line
                  type="monotone"
                  dataKey="prediction"
                  stroke="#dc2626"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Prediction"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Analysis</CardTitle>
            <CardDescription>AI-assessed risk factors and their impact scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockRiskFactors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="factor" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Risk Assessment</CardTitle>
          <CardDescription>Comprehensive AI-powered risk analysis with mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRiskFactors.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {risk.status === "low" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <h4 className="font-semibold">{risk.factor}</h4>
                    <p className="text-sm text-gray-600">
                      {risk.status === "low" ? "Low impact on asset value" : "Moderate monitoring required"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{risk.score}/100</div>
                  <Progress value={risk.score} className="w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
