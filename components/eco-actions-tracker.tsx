"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Zap, Droplets, Recycle, Car, TreePine, CheckCircle, Clock, Coins, TrendingUp } from "lucide-react"

interface EcoAction {
  id: string
  type: string
  description: string
  ecoReward: number
  carbonOffset: number
  status: "pending" | "verified" | "completed"
  timestamp: string
  verificationMethod: string
}

const ecoActionTypes = [
  {
    id: "energy",
    name: "Energy Conservation",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  {
    id: "water",
    name: "Water Conservation",
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "recycling",
    name: "Recycling",
    icon: Recycle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "transport",
    name: "Green Transport",
    icon: Car,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: "planting",
    name: "Tree Planting",
    icon: TreePine,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
]

export default function EcoActionsTracker() {
  const [userStats, setUserStats] = useState({
    totalEcoEarned: 1247,
    totalCarbonOffset: 2.8,
    actionsCompleted: 156,
    currentStreak: 12,
  })

  const [recentActions, setRecentActions] = useState<EcoAction[]>([
    {
      id: "1",
      type: "energy",
      description: "Reduced electricity usage by 15% this week",
      ecoReward: 25,
      carbonOffset: 0.12,
      status: "verified",
      timestamp: "2 hours ago",
      verificationMethod: "Smart Meter IoT",
    },
    {
      id: "2",
      type: "transport",
      description: "Used public transport for 5 days",
      ecoReward: 40,
      carbonOffset: 0.25,
      status: "verified",
      timestamp: "1 day ago",
      verificationMethod: "GPS Tracking",
    },
    {
      id: "3",
      type: "recycling",
      description: "Recycled 10kg of plastic waste",
      ecoReward: 30,
      carbonOffset: 0.08,
      status: "pending",
      timestamp: "2 days ago",
      verificationMethod: "Partner Verification",
    },
  ])

  const [availableActions, setAvailableActions] = useState([
    {
      id: "energy-1",
      title: "Smart Thermostat Challenge",
      description: "Optimize your home temperature for 7 days",
      reward: "50 ECO",
      carbonOffset: "0.3 tons CO2",
      difficulty: "Easy",
      duration: "7 days",
    },
    {
      id: "water-1",
      title: "Water Conservation Week",
      description: "Reduce water usage by 20% for one week",
      reward: "35 ECO",
      carbonOffset: "0.15 tons CO2",
      difficulty: "Medium",
      duration: "7 days",
    },
    {
      id: "transport-1",
      title: "Car-Free Challenge",
      description: "Use only eco-friendly transport for 5 days",
      reward: "60 ECO",
      carbonOffset: "0.4 tons CO2",
      difficulty: "Hard",
      duration: "5 days",
    },
  ])

  const startEcoAction = async (actionId: string) => {
    // Simulate starting an eco action
    alert(`Started eco action! IoT devices will track your progress automatically.`)
  }

  const claimRewards = async (actionId: string) => {
    // Simulate claiming rewards
    const action = recentActions.find((a) => a.id === actionId)
    if (action && action.status === "verified") {
      setUserStats((prev) => ({
        ...prev,
        totalEcoEarned: prev.totalEcoEarned + action.ecoReward,
        totalCarbonOffset: prev.totalCarbonOffset + action.carbonOffset,
      }))

      setRecentActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status: "completed" } : a)))

      alert(`Claimed ${action.ecoReward} $ECO tokens!`)
    }
  }

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total $ECO Earned</CardTitle>
            <Coins className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.totalEcoEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Leaf className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userStats.totalCarbonOffset} tons</div>
            <p className="text-xs text-muted-foreground">CO2 equivalent saved</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{userStats.actionsCompleted}</div>
            <p className="text-xs text-muted-foreground">Eco-friendly actions</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Actions</TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Eco Actions</CardTitle>
              <CardDescription>Start these actions to earn $ECO tokens and offset carbon emissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableActions.map((action) => (
                  <Card key={action.id} className="border-2 hover:border-green-300 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Reward:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {action.reward}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Carbon Offset:</span>
                        <Badge variant="outline" className="border-blue-300 text-blue-700">
                          {action.carbonOffset}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm text-gray-600">{action.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Difficulty:</span>
                        <Badge
                          variant={
                            action.difficulty === "Easy"
                              ? "default"
                              : action.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {action.difficulty}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => startEcoAction(action.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Start Action
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Eco Actions</CardTitle>
              <CardDescription>Your completed and pending eco-friendly actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActions.map((action) => {
                  const actionType = ecoActionTypes.find((t) => t.id === action.type)
                  const Icon = actionType?.icon || Leaf

                  return (
                    <div
                      key={action.id}
                      className={`p-4 border rounded-lg ${actionType?.borderColor || "border-gray-200"} ${actionType?.bgColor || "bg-gray-50"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-6 w-6 mt-1 ${actionType?.color || "text-gray-600"}`} />
                          <div>
                            <h4 className="font-semibold">{action.description}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Verified by: {action.verificationMethod} • {action.timestamp}
                            </p>
                            <div className="flex gap-4 mt-2">
                              <span className="text-sm">
                                <Coins className="inline h-4 w-4 mr-1 text-green-600" />
                                {action.ecoReward} ECO
                              </span>
                              <span className="text-sm">
                                <Leaf className="inline h-4 w-4 mr-1 text-blue-600" />
                                {action.carbonOffset} tons CO2
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={
                              action.status === "completed"
                                ? "default"
                                : action.status === "verified"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              action.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : action.status === "verified"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {action.status}
                          </Badge>
                          {action.status === "verified" && (
                            <Button
                              size="sm"
                              onClick={() => claimRewards(action.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Claim Rewards
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
