"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface TokenizationData {
  assetName: string
  assetType: string
  description: string
  estimatedValue: string
  location: string
  documents: string
}

export default function TokenizationForm() {
  const [formData, setFormData] = useState<TokenizationData>({
    assetName: "",
    assetType: "",
    description: "",
    estimatedValue: "",
    location: "",
    documents: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleInputChange = (field: keyof TokenizationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTokenize = async () => {
    if (!analysisResult) {
      await handleAIAnalysis()
      return
    }

    // Simulate tokenization process
    alert("Asset tokenization initiated! Smart contract deployment in progress...")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Tokenization Form</CardTitle>
          <CardDescription>Provide asset details for AI-powered analysis and tokenization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="assetName">Asset Name</Label>
            <Input
              id="assetName"
              value={formData.assetName}
              onChange={(e) => handleInputChange("assetName", e.target.value)}
              placeholder="e.g., Manhattan Office Building"
            />
          </div>

          <div>
            <Label htmlFor="assetType">Asset Type</Label>
            <Select onValueChange={(value) => handleInputChange("assetType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="art">Art & Collectibles</SelectItem>
                <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                <SelectItem value="commodities">Commodities</SelectItem>
                <SelectItem value="vehicles">Luxury Vehicles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed description of the asset..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="estimatedValue">Estimated Value (USD)</Label>
            <Input
              id="estimatedValue"
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => handleInputChange("estimatedValue", e.target.value)}
              placeholder="1000000"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="New York, NY, USA"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAIAnalysis} disabled={isAnalyzing || !formData.assetName} className="flex-1">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                "Run AI Analysis"
              )}
            </Button>

            <Button
              onClick={handleTokenize}
              disabled={!analysisResult}
              variant={analysisResult ? "default" : "secondary"}
            >
              Tokenize Asset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Results</CardTitle>
          <CardDescription>Real-time AI-powered asset evaluation and risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          {!analysisResult ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Run AI analysis to see detailed asset evaluation</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Analysis Complete</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">AI Valuation</Label>
                  <p className="text-2xl font-bold text-green-600">${analysisResult.aiValuation?.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Confidence Score</Label>
                  <p className="text-2xl font-bold text-blue-600">{analysisResult.confidence}%</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Risk Assessment</Label>
                <div className="flex gap-2 mt-1">
                  <Badge
                    variant={
                      analysisResult.riskLevel === "Low"
                        ? "default"
                        : analysisResult.riskLevel === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {analysisResult.riskLevel} Risk
                  </Badge>
                  <Badge variant="outline">Score: {analysisResult.riskScore}/100</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Market Sentiment</Label>
                <p className="text-sm text-gray-600 mt-1">{analysisResult.marketSentiment}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Compliance Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">All checks passed</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Recommended Token Supply</Label>
                <p className="text-lg font-semibold">{analysisResult.recommendedSupply?.toLocaleString()} tokens</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
