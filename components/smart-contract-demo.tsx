"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Play, CheckCircle, Clock, AlertCircle } from "lucide-react"

const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIAssetToken is ERC721, Ownable {
    struct AssetData {
        string assetType;
        uint256 aiValuation;
        uint256 riskScore;
        uint256 lastUpdate;
        bool isActive;
    }
    
    mapping(uint256 => AssetData) public assets;
    mapping(uint256 => address) public aiOracles;
    
    event AssetTokenized(uint256 tokenId, uint256 aiValuation);
    event ValuationUpdated(uint256 tokenId, uint256 newValuation);
    
    constructor() ERC721("AI Asset Token", "AIAT") {}
    
    function tokenizeAsset(
        address to,
        uint256 tokenId,
        string memory assetType,
        uint256 aiValuation,
        uint256 riskScore
    ) external onlyOwner {
        _mint(to, tokenId);
        
        assets[tokenId] = AssetData({
            assetType: assetType,
            aiValuation: aiValuation,
            riskScore: riskScore,
            lastUpdate: block.timestamp,
            isActive: true
        });
        
        emit AssetTokenized(tokenId, aiValuation);
    }
    
    function updateAIValuation(
        uint256 tokenId,
        uint256 newValuation
    ) external {
        require(aiOracles[tokenId] == msg.sender, "Unauthorized oracle");
        
        assets[tokenId].aiValuation = newValuation;
        assets[tokenId].lastUpdate = block.timestamp;
        
        emit ValuationUpdated(tokenId, newValuation);
    }
}`

interface ContractTransaction {
  id: string
  function: string
  status: "pending" | "success" | "failed"
  timestamp: string
  gasUsed?: string
}

export default function SmartContractDemo() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [contractAddress, setContractAddress] = useState("")
  const [transactions, setTransactions] = useState<ContractTransaction[]>([])

  const deployContract = async () => {
    setIsDeploying(true)

    // Simulate contract deployment
    setTimeout(() => {
      setIsDeployed(true)
      setContractAddress("0x742d35Cc6634C0532925a3b8D4C9db96590c6C89")
      setIsDeploying(false)

      // Add deployment transaction
      const deployTx: ContractTransaction = {
        id: "deploy-1",
        function: "Contract Deployment",
        status: "success",
        timestamp: new Date().toLocaleTimeString(),
        gasUsed: "2,847,392",
      }
      setTransactions([deployTx])
    }, 3000)
  }

  const executeFunction = async (functionName: string) => {
    const newTx: ContractTransaction = {
      id: `tx-${Date.now()}`,
      function: functionName,
      status: "pending",
      timestamp: new Date().toLocaleTimeString(),
    }

    setTransactions((prev) => [newTx, ...prev])

    // Simulate transaction execution
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === newTx.id
            ? { ...tx, status: "success", gasUsed: Math.floor(Math.random() * 100000 + 50000).toLocaleString() }
            : tx,
        ),
      )
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Contract Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            AI-Enhanced Smart Contract
          </CardTitle>
          <CardDescription>ERC-721 compliant smart contract with AI oracle integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={isDeployed ? "default" : "secondary"}>{isDeployed ? "Deployed" : "Not Deployed"}</Badge>
                {isDeployed && <span className="text-sm text-gray-600">Contract: {contractAddress}</span>}
              </div>
              <p className="text-sm text-gray-600">
                Smart contract with AI-powered valuation updates and risk assessment
              </p>
            </div>
            <Button onClick={deployContract} disabled={isDeploying || isDeployed}>
              {isDeploying ? "Deploying..." : isDeployed ? "Deployed" : "Deploy Contract"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code">Contract Code</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Source Code</CardTitle>
              <CardDescription>
                Solidity contract with AI oracle integration and automated valuation updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{contractCode}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tokenize Asset</CardTitle>
                <CardDescription>Create a new asset token with AI-powered initial valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Parameters:</strong>
                    <ul className="list-disc list-inside mt-1 text-gray-600">
                      <li>Recipient address</li>
                      <li>Token ID</li>
                      <li>Asset type</li>
                      <li>AI valuation</li>
                      <li>Risk score</li>
                    </ul>
                  </div>
                  <Button onClick={() => executeFunction("tokenizeAsset")} disabled={!isDeployed} className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Execute Function
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update AI Valuation</CardTitle>
                <CardDescription>Update asset valuation based on AI oracle data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Parameters:</strong>
                    <ul className="list-disc list-inside mt-1 text-gray-600">
                      <li>Token ID</li>
                      <li>New AI valuation</li>
                      <li>Oracle signature</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => executeFunction("updateAIValuation")}
                    disabled={!isDeployed}
                    className="w-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Execute Function
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Set AI Oracle</CardTitle>
                <CardDescription>Configure AI oracle address for automated updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Parameters:</strong>
                    <ul className="list-disc list-inside mt-1 text-gray-600">
                      <li>Token ID</li>
                      <li>Oracle address</li>
                      <li>Update frequency</li>
                    </ul>
                  </div>
                  <Button onClick={() => executeFunction("setAIOracle")} disabled={!isDeployed} className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Execute Function
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get Asset Data</CardTitle>
                <CardDescription>Retrieve complete asset information and AI metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Returns:</strong>
                    <ul className="list-disc list-inside mt-1 text-gray-600">
                      <li>Asset type</li>
                      <li>Current AI valuation</li>
                      <li>Risk score</li>
                      <li>Last update timestamp</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => executeFunction("getAssetData")}
                    disabled={!isDeployed}
                    className="w-full"
                    variant="outline"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Query Function
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent smart contract interactions and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet. Deploy the contract and execute functions to see activity.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {tx.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : tx.status === "pending" ? (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <div className="font-semibold">{tx.function}</div>
                          <div className="text-sm text-gray-600">{tx.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            tx.status === "success" ? "default" : tx.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {tx.status}
                        </Badge>
                        {tx.gasUsed && <div className="text-sm text-gray-600 mt-1">Gas: {tx.gasUsed}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
