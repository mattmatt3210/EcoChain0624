"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Coins, Zap, TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft, PiggyBank, Gift } from "lucide-react"
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
import SmartContractInterface from "@/components/smart-contract-interface" // Declare the SmartContractInterface variable

const priceData = [
  { date: "Jan", eco: 0.45 },
  { date: "Feb", eco: 0.52 },
  { date: "Mar", eco: 0.48 },
  { date: "Apr", eco: 0.61 },
  { date: "May", eco: 0.58 },
  { date: "Jun", eco: 0.67 },
]

const portfolioDistribution = [
  { name: "ECO Tokens", value: 75, color: "#10B981" },
  { name: "Staked ECO", value: 25, color: "#8B5CF6" },
]

export default function TokenDashboard() {
  const [userBalances, setUserBalances] = useState({
    ecoBalance: 1247,
    stakedEco: 500,
    stakingRewards: 23.5,
    totalValue: 2847.5,
  })

  const [stakingInfo, setStakingInfo] = useState({
    apy: 12.5,
    stakingPeriod: 30,
    minStake: 100,
    totalStaked: 45000000,
    userStakeValue: 335.5,
  })

  const [utilityPayments, setUtilityPayments] = useState([
    {
      id: "1",
      provider: "Green Energy Co.",
      amount: 125,
      ecoUsed: 187,
      date: "2024-06-15",
      status: "completed",
    },
    {
      id: "2",
      provider: "EcoWater Utilities",
      amount: 89,
      ecoUsed: 133,
      date: "2024-06-10",
      status: "completed",
    },
    {
      id: "3",
      provider: "Solar Power Inc.",
      amount: 156,
      ecoUsed: 234,
      date: "2024-06-05",
      status: "completed",
    },
  ])

  const [stakeAmount, setStakeAmount] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")

  const stakeTokens = async () => {
    const amount = Number(stakeAmount)
    if (amount >= stakingInfo.minStake && amount <= userBalances.ecoBalance) {
      setUserBalances((prev) => ({
        ...prev,
        ecoBalance: prev.ecoBalance - amount,
        stakedEco: prev.stakedEco + amount,
        userStakeValue: prev.userStakeValue + amount * 0.67, // Assuming $ECO price of $0.67
      }))

      alert(`Successfully staked ${amount} $ECO tokens!`)
      setStakeAmount("")
    }
  }

  const payUtilityBill = async () => {
    const amount = Number(paymentAmount)
    const ecoNeeded = Math.ceil(amount / 0.67) // Convert USD to ECO tokens

    if (ecoNeeded <= userBalances.ecoBalance && selectedProvider) {
      setUserBalances((prev) => ({
        ...prev,
        ecoBalance: prev.ecoBalance - ecoNeeded,
      }))

      const newPayment = {
        id: Date.now().toString(),
        provider: selectedProvider,
        amount: amount,
        ecoUsed: ecoNeeded,
        date: new Date().toISOString().split("T")[0],
        status: "completed" as const,
      }

      setUtilityPayments((prev) => [newPayment, ...prev])

      alert(`Successfully paid $${amount} utility bill using ${ecoNeeded} $ECO tokens!`)
      setPaymentAmount("")
      setSelectedProvider("")
    }
  }

  const claimStakingRewards = async () => {
    if (userBalances.stakingRewards > 0) {
      setUserBalances((prev) => ({
        ...prev,
        ecoBalance: prev.ecoBalance + prev.stakingRewards,
        stakingRewards: 0,
      }))

      alert(`Claimed ${userBalances.stakingRewards} $ECO staking rewards!`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ECO Balance</CardTitle>
            <Coins className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userBalances.ecoBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">≈ ${(userBalances.ecoBalance * 0.67).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staked ECO</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{userBalances.stakedEco}</div>
            <p className="text-xs text-muted-foreground">Earning {stakingInfo.apy}% APY</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Gift className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userBalances.stakingRewards}</div>
            <p className="text-xs text-muted-foreground">ECO rewards</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userBalances.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +8.5% this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="payments">Utility Payments</TabsTrigger>
          <TabsTrigger value="contract">Smart Contract</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Price Chart</CardTitle>
                <CardDescription>$ECO and $CCT price trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`$${value}`, name === "eco" ? "$ECO" : "$CCT"]} />
                    <Line type="monotone" dataKey="eco" stroke="#10B981" strokeWidth={2} name="eco" />
                    <Line type="monotone" dataKey="cct" stroke="#3B82F6" strokeWidth={2} name="cct" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Distribution</CardTitle>
                <CardDescription>Your token holdings breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common token operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                  <ArrowUpRight className="h-6 w-6" />
                  <span>Buy $ECO</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                  <ArrowDownLeft className="h-6 w-6" />
                  <span>Sell $CCT</span>
                </Button>
                <Button
                  className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={claimStakingRewards}
                  disabled={userBalances.stakingRewards === 0}
                >
                  <Gift className="h-6 w-6" />
                  <span>Claim Rewards</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stake $ECO Tokens</CardTitle>
                <CardDescription>Earn rewards by staking your $ECO tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Current APY:</span>
                    <div className="text-2xl font-bold text-green-600">{stakingInfo.apy}%</div>
                  </div>
                  <div>
                    <span className="font-medium">Min. Stake:</span>
                    <div className="text-2xl font-bold">{stakingInfo.minStake} $ECO</div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="stakeAmount">Amount to Stake</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="stakeAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      max={userBalances.ecoBalance}
                    />
                    <Button
                      onClick={stakeTokens}
                      disabled={!stakeAmount || Number(stakeAmount) < stakingInfo.minStake}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Stake
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Available: {userBalances.ecoBalance} $ECO</p>
                </div>

                {stakeAmount && Number(stakeAmount) >= stakingInfo.minStake && (
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <p>
                      <strong>Estimated Annual Rewards:</strong>{" "}
                      {((Number(stakeAmount) * stakingInfo.apy) / 100).toFixed(2)} $ECO
                    </p>
                    <p>
                      <strong>Monthly Rewards:</strong>{" "}
                      {((Number(stakeAmount) * stakingInfo.apy) / 100 / 12).toFixed(2)} $ECO
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staking Statistics</CardTitle>
                <CardDescription>Platform-wide staking information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Staked</span>
                    <span>{stakingInfo.totalStaked.toLocaleString()} $ECO</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">75% of total supply staked</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Your Stake:</span>
                    <span className="font-semibold">{userBalances.stakedEco} $ECO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Stake Value:</span>
                    <span className="font-semibold">${stakingInfo.userStakeValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Rewards:</span>
                    <span className="font-semibold text-green-600">{userBalances.stakingRewards} $ECO</span>
                  </div>
                </div>

                <Button
                  onClick={claimStakingRewards}
                  disabled={userBalances.stakingRewards === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pay Utility Bills</CardTitle>
                <CardDescription>Use your $ECO tokens to pay electricity and water bills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="provider">Utility Provider</Label>
                  <select
                    id="provider"
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    <option value="">Select provider</option>
                    <option value="Green Energy Co.">Green Energy Co.</option>
                    <option value="EcoWater Utilities">EcoWater Utilities</option>
                    <option value="Solar Power Inc.">Solar Power Inc.</option>
                    <option value="Wind Energy Corp.">Wind Energy Corp.</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="paymentAmount">Bill Amount (USD)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="paymentAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <Button
                      onClick={payUtilityBill}
                      disabled={!paymentAmount || !selectedProvider}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Pay
                    </Button>
                  </div>
                </div>

                {paymentAmount && (
                  <div className="bg-blue-50 p-3 rounded-lg text-sm">
                    <p>
                      <strong>$ECO Required:</strong> {Math.ceil(Number(paymentAmount) / 0.67)} tokens
                    </p>
                    <p>
                      <strong>Exchange Rate:</strong> 1 $ECO = $0.67
                    </p>
                    <p>
                      <strong>Available Balance:</strong> {userBalances.ecoBalance} $ECO
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent utility bill payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {utilityPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{payment.provider}</h4>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${payment.amount}</div>
                        <div className="text-sm text-gray-600">{payment.ecoUsed} $ECO</div>
                        <Badge variant="default" className="bg-green-100 text-green-800 mt-1">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contract" className="mt-6">
          <SmartContractInterface />
        </TabsContent>
      </Tabs>
    </div>
  )
}
