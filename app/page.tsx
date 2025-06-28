"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EcoActionsTracker from "@/components/eco-actions-tracker"
import TokenDashboard from "@/components/token-dashboard"
import GovernancePanel from "@/components/governance-panel"
import AIChatBoard from "@/components/ai-chat-board"
import { Leaf, Coins, Vote, Recycle, Zap, MessageCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">EcoChain</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leveraging Blockchain for a Greener Future. Earn EcoChain tokens for eco-friendly actions and participate in
            our sustainable ecosystem powered by blockchain technology.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Powered by Polygon Layer 2</span>
            <span>•</span>
            <span>Carbon Negative Blockchain</span>
            <span>•</span>
            <span>Low Gas Fees</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-green-200">
            <CardHeader>
              <Recycle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Eco Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Earn $ECO tokens by performing verified eco-friendly actions tracked via IoT devices
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200">
            <CardHeader>
              <Coins className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">EcoChain Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Earn EcoChain tokens for verified eco-friendly actions and sustainable behaviors
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200">
            <CardHeader>
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Utility Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Pay electricity bills with $ECO tokens through our partner utility companies
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-orange-200">
            <CardHeader>
              <Vote className="h-12 w-12 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">DAO Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Vote on platform decisions and reward structures using your $ECO holdings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="actions">Eco Actions</TabsTrigger>
            <TabsTrigger value="tokens">Token Dashboard</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="mt-6">
            <EcoActionsTracker />
          </TabsContent>

          <TabsContent value="tokens" className="mt-6">
            <TokenDashboard />
          </TabsContent>

          <TabsContent value="governance" className="mt-6">
            <GovernancePanel />
          </TabsContent>

          <TabsContent value="ai-chat" className="mt-6">
            <AIChatBoard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
