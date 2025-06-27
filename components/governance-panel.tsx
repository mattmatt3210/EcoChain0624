"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Vote, Users, CheckCircle, XCircle, Plus, FileText } from "lucide-react"

interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  category: string
  status: "active" | "passed" | "rejected" | "pending"
  votesFor: number
  votesAgainst: number
  totalVotes: number
  quorum: number
  endDate: string
  createdDate: string
}

const proposalCategories = [
  { id: "rewards", name: "Reward Structure", color: "bg-green-100 text-green-800" },
  { id: "partnerships", name: "Partnerships", color: "bg-blue-100 text-blue-800" },
  { id: "technical", name: "Technical Upgrades", color: "bg-purple-100 text-purple-" },
  { id: "technical", name: "Technical Upgrades", color: "bg-purple-100 text-purple-800" },
  { id: "governance", name: "Governance", color: "bg-orange-100 text-orange-800" },
  { id: "tokenomics", name: "Tokenomics", color: "bg-red-100 text-red-800" },
]

export default function GovernancePanel() {
  const [userVotingPower, setUserVotingPower] = useState({
    ecoBalance: 1247,
    stakedEco: 500,
    totalVotingPower: 1747,
    delegatedVotes: 0,
  })

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Increase Eco Action Rewards by 25%",
      description:
        "Proposal to increase the $ECO token rewards for verified eco-friendly actions by 25% to incentivize more participation in sustainability initiatives.",
      proposer: "0x742d35...6C89",
      category: "rewards",
      status: "active",
      votesFor: 12500000,
      votesAgainst: 3200000,
      totalVotes: 15700000,
      quorum: 10000000,
      endDate: "2024-07-15",
      createdDate: "2024-06-15",
    },
    {
      id: "2",
      title: "Partnership with Tesla for EV Charging",
      description:
        "Establish a strategic partnership with Tesla to allow $ECO token payments at Supercharger stations, promoting electric vehicle adoption.",
      proposer: "0x8ba1f1...57B",
      category: "partnerships",
      status: "active",
      votesFor: 8900000,
      votesAgainst: 6100000,
      totalVotes: 15000000,
      quorum: 10000000,
      endDate: "2024-07-20",
      createdDate: "2024-06-20",
    },
    {
      id: "3",
      title: "Upgrade to Polygon zkEVM",
      description:
        "Migrate the platform to Polygon zkEVM for enhanced scalability, lower costs, and improved privacy features.",
      proposer: "0x1234567...890",
      category: "technical",
      status: "passed",
      votesFor: 18500000,
      votesAgainst: 2100000,
      totalVotes: 20600000,
      quorum: 10000000,
      endDate: "2024-06-30",
      createdDate: "2024-06-01",
    },
  ])

  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "",
  })

  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)

  const voteOnProposal = async (proposalId: string, support: boolean) => {
    const votingPower = userVotingPower.totalVotingPower

    setProposals((prev) =>
      prev.map((proposal) => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            votesFor: support ? proposal.votesFor + votingPower : proposal.votesFor,
            votesAgainst: !support ? proposal.votesAgainst + votingPower : proposal.votesAgainst,
            totalVotes: proposal.totalVotes + votingPower,
          }
        }
        return proposal
      }),
    )

    alert(`Successfully voted ${support ? "FOR" : "AGAINST"} proposal with ${votingPower} voting power!`)
  }

  const createProposal = async () => {
    if (newProposal.title && newProposal.description && newProposal.category) {
      const proposal: Proposal = {
        id: Date.now().toString(),
        title: newProposal.title,
        description: newProposal.description,
        proposer: "0x742d35...6C89", // User's address
        category: newProposal.category,
        status: "pending",
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        quorum: 10000000,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
        createdDate: new Date().toISOString().split("T")[0],
      }

      setProposals((prev) => [proposal, ...prev])
      setNewProposal({ title: "", description: "", category: "" })

      alert("Proposal submitted successfully! It will be reviewed before going live.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "passed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    const cat = proposalCategories.find((c) => c.id === category)
    return cat ? cat.color : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Voting Power</CardTitle>
            <Vote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userVotingPower.totalVotingPower.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {userVotingPower.ecoBalance} $ECO + {userVotingPower.stakedEco} staked
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {proposals.filter((p) => p.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting votes</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12,847</div>
            <p className="text-xs text-muted-foreground">DAO members</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {proposals.filter((p) => p.status === "passed").length}
            </div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
          <TabsTrigger value="create">Create Proposal</TabsTrigger>
          <TabsTrigger value="history">Voting History</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Governance Proposals</CardTitle>
              <CardDescription>Vote on proposals to shape the future of EcoChain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {proposals
                  .filter((p) => p.status === "active")
                  .map((proposal) => (
                    <Card key={proposal.id} className="border-2 hover:border-green-300 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{proposal.title}</h3>
                              <Badge className={getCategoryColor(proposal.category)}>
                                {proposalCategories.find((c) => c.id === proposal.category)?.name}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{proposal.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Proposed by: {proposal.proposer}</span>
                              <span>•</span>
                              <span>Ends: {proposal.endDate}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Voting Progress */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>For: {proposal.votesFor.toLocaleString()}</span>
                            <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
                          </div>
                          <div className="space-y-2">
                            <Progress
                              value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}
                              className="h-3"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                {((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%
                                For
                              </span>
                              <span>
                                {((proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(
                                  1,
                                )}
                                % Against
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Quorum: {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}(
                            {((proposal.totalVotes / proposal.quorum) * 100).toFixed(1)}%)
                          </div>
                        </div>

                        {/* Voting Buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => voteOnProposal(proposal.id, true)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Vote For
                          </Button>
                          <Button
                            onClick={() => voteOnProposal(proposal.id, false)}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Vote Against
                          </Button>
                        </div>

                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          Your voting power: {userVotingPower.totalVotingPower.toLocaleString()} votes
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Proposal</CardTitle>
              <CardDescription>Submit a proposal for the EcoChain community to vote on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="proposalTitle">Proposal Title</Label>
                <Input
                  id="proposalTitle"
                  placeholder="Enter a clear, descriptive title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="proposalCategory">Category</Label>
                <select
                  id="proposalCategory"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newProposal.category}
                  onChange={(e) => setNewProposal((prev) => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {proposalCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="proposalDescription">Description</Label>
                <Textarea
                  id="proposalDescription"
                  placeholder="Provide a detailed description of your proposal, including rationale and expected impact"
                  rows={6}
                  value={newProposal.description}
                  onChange={(e) => setNewProposal((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Proposal Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Minimum 1,000 $ECO tokens required to submit</li>
                  <li>• Proposals are reviewed before going live</li>
                  <li>• Voting period lasts 30 days</li>
                  <li>• Quorum of 10M votes required to pass</li>
                </ul>
              </div>

              <Button
                onClick={createProposal}
                disabled={!newProposal.title || !newProposal.description || !newProposal.category}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Proposal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voting History</CardTitle>
              <CardDescription>Past proposals and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proposals
                  .filter((p) => p.status !== "active")
                  .map((proposal) => (
                    <div key={proposal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{proposal.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(proposal.category)}>
                            {proposalCategories.find((c) => c.id === proposal.category)?.name}
                          </Badge>
                          <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Ended: {proposal.endDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">For: {proposal.votesFor.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Against: {proposal.votesAgainst.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%
                          approval
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
