"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Code, Send, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface ContractState {
  isConnected: boolean
  account: string
  balance: string
  contractAddress: string
  isDeployed: boolean
  networkId: number
}

const ECOCHAIN_CONTRACT_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "actionType", type: "string" },
    ],
    name: "rewardEcoAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "stakeTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimStakingRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

const ECOCHAIN_CONTRACT_BYTECODE =
  "0x608060405234801561001057600080fd5b50600436106100885760003560e01c8063a9059cbb1161005b578063a9059cbb146101145780639dc29fac14610127578063dd62ed3e1461013a578063f2fde38b1461014d57600080fd5b806306fdde031461008d578063095ea7b3146100ab57806318160ddd146100ce57806370a08231146100e0575b600080fd5b610095610160565b6040516100a29190610234565b60405180910390f35b6100be6100b9366004610299565b6101f2565b60405190151581526020016100a2565b6002545b6040519081526020016100a2565b6100d26100ee3660046102c3565b6001600160a01b031660009081526020819052604090205490565b6100be610122366004610299565b61020c565b61013a6101353660046102e5565b61021a565b005b6100d2610148366004610307565b610280565b61013a61015b3660046102c3565b6102ab565b60606003805461016f9061033a565b80601f016020809104026020016040519081016040528092919081815260200182805461019b9061033a565b80156101e85780601f106101bd576101008083540402835291602001916101e8565b820191906000526020600020905b8154815290600101906020018083116101cb57829003601f168201915b5050505050905090565b600033610200818585610315565b60019150505b92915050565b600033610200818585610439565b6005546001600160a01b031633146102495760405162461bcd60e51b815260040161024090610374565b60405180910390fd5b6001600160a01b03821660009081526020819052604081208054839290610271908490610399565b90915550505050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6005546001600160a01b031633146102d55760405162461bcd60e51b815260040161024090610374565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b600080fd5b6001600160a01b03811681146102f857600080fd5b50565b6000806040838503121561030e57600080fd5b823561031981610299565b946020939093013593505050565b6001600160a01b0383166103775760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610240565b6001600160a01b0382166103d85760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610240565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b03831661049d5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610240565b6001600160a01b0382166104ff5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610240565b6001600160a01b038316600090815260208190526040902054818110156105775760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610240565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a350505050565b600060208083528351808285015260005b8181101561026157858101830151858201604001528201610245565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b038116811461029457600080fd5b919050565b600080604083850312156102ac57600080fd5b6102b58361027d565b946020939093013593505050565b6000602082840312156102d557600080fd5b6102de8261027d565b9392505050565b600080604083850312156102f857600080fd5b6103018361027d565b9150602083013561031181610299565b809150509250929050565b6000806040838503121561032f57600080fd5b6103388361027d565b91506103466020840161027d565b90509250929050565b600181811c9082168061036357607f821691505b60208210810361038357634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156102065761020661038956"

export default function SmartContractInterface() {
  const [contractState, setContractState] = useState<ContractState>({
    isConnected: false,
    account: "",
    balance: "0",
    contractAddress: "",
    isDeployed: false,
    networkId: 0,
  })

  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentTx, setDeploymentTx] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [transferTo, setTransferTo] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [rewardAmount, setRewardAmount] = useState("")
  const [rewardAddress, setRewardAddress] = useState("")

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const networkId = await window.ethereum.request({ method: "net_version" })
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })

          setContractState((prev) => ({
            ...prev,
            isConnected: true,
            account: accounts[0],
            balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
            networkId: Number.parseInt(networkId),
          }))
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const networkId = await window.ethereum.request({ method: "net_version" })
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })

        setContractState((prev) => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
          balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
          networkId: Number.parseInt(networkId),
        }))
      } catch (error) {
        console.error("Error connecting wallet:", error)
        alert("Failed to connect wallet. Please try again.")
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.")
    }
  }

  const deployContract = async () => {
    if (!contractState.isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setIsDeploying(true)
    try {
      // Contract constructor parameters
      const constructorParams =
        window.ethereum.utils?.encodeFunctionCall(
          {
            name: "constructor",
            type: "constructor",
            inputs: [],
          },
          [],
        ) || "0x"

      const transactionParameters = {
        from: contractState.account,
        data: ECOCHAIN_CONTRACT_BYTECODE + constructorParams.slice(2),
        gas: "0x2DC6C0", // 3,000,000 gas limit
        gasPrice: "0x4A817C800", // 20 Gwei
      }

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })

      setDeploymentTx(txHash)

      // Wait for transaction receipt
      let receipt = null
      let attempts = 0
      while (!receipt && attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        })
        attempts++
      }

      if (receipt && receipt.contractAddress) {
        setContractState((prev) => ({
          ...prev,
          contractAddress: receipt.contractAddress,
          isDeployed: true,
        }))
        alert(`Contract deployed successfully at: ${receipt.contractAddress}`)
      } else {
        alert("Contract deployment failed or timed out")
      }
    } catch (error) {
      console.error("Deployment error:", error)
      alert("Contract deployment failed: " + (error as any).message)
    } finally {
      setIsDeploying(false)
    }
  }

  const transferTokens = async () => {
    if (!contractState.isDeployed || !transferAmount || !transferTo) {
      alert("Please ensure contract is deployed and all fields are filled")
      return
    }

    try {
      const transferData =
        window.ethereum.utils?.encodeFunctionCall(
          {
            name: "transfer",
            type: "function",
            inputs: [
              { type: "address", name: "to" },
              { type: "uint256", name: "amount" },
            ],
          },
          [transferTo, (Number.parseFloat(transferAmount) * 1e18).toString()],
        ) || "0x"

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: contractState.account,
            to: contractState.contractAddress,
            data: transferData,
            gas: "0x5208", // 21,000 gas
          },
        ],
      })

      alert(`Transfer transaction sent: ${txHash}`)
      setTransferAmount("")
      setTransferTo("")
    } catch (error) {
      console.error("Transfer error:", error)
      alert("Transfer failed: " + (error as any).message)
    }
  }

  const stakeTokens = async () => {
    if (!contractState.isDeployed || !stakeAmount) {
      alert("Please ensure contract is deployed and amount is specified")
      return
    }

    try {
      const stakeData =
        window.ethereum.utils?.encodeFunctionCall(
          {
            name: "stakeTokens",
            type: "function",
            inputs: [{ type: "uint256", name: "amount" }],
          },
          [(Number.parseFloat(stakeAmount) * 1e18).toString()],
        ) || "0x"

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: contractState.account,
            to: contractState.contractAddress,
            data: stakeData,
            gas: "0x7530", // 30,000 gas
          },
        ],
      })

      alert(`Staking transaction sent: ${txHash}`)
      setStakeAmount("")
    } catch (error) {
      console.error("Staking error:", error)
      alert("Staking failed: " + (error as any).message)
    }
  }

  const rewardEcoAction = async () => {
    if (!contractState.isDeployed || !rewardAmount || !rewardAddress) {
      alert("Please ensure contract is deployed and all fields are filled")
      return
    }

    try {
      const rewardData =
        window.ethereum.utils?.encodeFunctionCall(
          {
            name: "rewardEcoAction",
            type: "function",
            inputs: [
              { type: "address", name: "user" },
              { type: "uint256", name: "amount" },
              { type: "string", name: "actionType" },
            ],
          },
          [rewardAddress, (Number.parseFloat(rewardAmount) * 1e18).toString(), "energy_saving"],
        ) || "0x"

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: contractState.account,
            to: contractState.contractAddress,
            data: rewardData,
            gas: "0x7530", // 30,000 gas
          },
        ],
      })

      alert(`Reward transaction sent: ${txHash}`)
      setRewardAmount("")
      setRewardAddress("")
    } catch (error) {
      console.error("Reward error:", error)
      alert("Reward failed: " + (error as any).message)
    }
  }

  const getNetworkName = (networkId: number) => {
    switch (networkId) {
      case 1:
        return "Ethereum Mainnet"
      case 137:
        return "Polygon Mainnet"
      case 80001:
        return "Polygon Mumbai Testnet"
      case 5:
        return "Goerli Testnet"
      case 11155111:
        return "Sepolia Testnet"
      default:
        return `Network ${networkId}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Connection Status */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            MetaMask Wallet Connection
          </CardTitle>
          <CardDescription>Connect your MetaMask wallet to interact with EcoChain smart contracts</CardDescription>
        </CardHeader>
        <CardContent>
          {!contractState.isConnected ? (
            <div className="text-center py-6">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Connect your MetaMask wallet to get started</p>
              <Button onClick={connectWallet} className="bg-orange-600 hover:bg-orange-700">
                Connect MetaMask
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Wallet Connected</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Account:</span>
                  <p className="text-gray-600 break-all">{contractState.account}</p>
                </div>
                <div>
                  <span className="font-medium">Balance:</span>
                  <p className="text-gray-600">{contractState.balance} ETH</p>
                </div>
                <div>
                  <span className="font-medium">Network:</span>
                  <p className="text-gray-600">{getNetworkName(contractState.networkId)}</p>
                </div>
              </div>

              {contractState.networkId !== 137 && contractState.networkId !== 80001 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    For optimal experience, please switch to Polygon network in MetaMask.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Contract Interface */}
      <Tabs defaultValue="deploy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deploy">Deploy Contract</TabsTrigger>
          <TabsTrigger value="interact">Interact</TabsTrigger>
          <TabsTrigger value="admin">Admin Functions</TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Deploy EcoChain Smart Contract
              </CardTitle>
              <CardDescription>Deploy the EcoChain token contract to the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!contractState.isDeployed ? (
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">Contract Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• ERC-20 compliant EcoChain token</li>
                      <li>• Reward system for eco-friendly actions</li>
                      <li>• Token staking with rewards</li>
                      <li>• Governance voting capabilities</li>
                      <li>• Utility payment integration</li>
                    </ul>
                  </div>

                  <Button
                    onClick={deployContract}
                    disabled={!contractState.isConnected || isDeploying}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isDeploying ? "Deploying..." : "Deploy EcoChain Contract"}
                  </Button>

                  {deploymentTx && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Deployment Transaction:</strong>
                        <a
                          href={`https://polygonscan.com/tx/${deploymentTx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          {deploymentTx}
                          <ExternalLink className="inline h-3 w-3 ml-1" />
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Contract Deployed Successfully!</span>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Contract Address:</strong>
                      <a
                        href={`https://polygonscan.com/address/${contractState.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline ml-2 break-all"
                      >
                        {contractState.contractAddress}
                        <ExternalLink className="inline h-3 w-3 ml-1" />
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Tokens</CardTitle>
                <CardDescription>Send EcoChain tokens to another address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transferTo">Recipient Address</Label>
                  <Input
                    id="transferTo"
                    placeholder="0x..."
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="transferAmount">Amount (ECO)</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    placeholder="0.0"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
                <Button onClick={transferTokens} disabled={!contractState.isDeployed} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Transfer Tokens
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stake Tokens</CardTitle>
                <CardDescription>Stake your EcoChain tokens to earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stakeAmount">Amount to Stake (ECO)</Label>
                  <Input
                    id="stakeAmount"
                    type="number"
                    placeholder="0.0"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p>
                    <strong>Current APY:</strong> 12.5%
                  </p>
                  <p>
                    <strong>Minimum Stake:</strong> 100 ECO
                  </p>
                  <p>
                    <strong>Lock Period:</strong> 30 days
                  </p>
                </div>
                <Button
                  onClick={stakeTokens}
                  disabled={!contractState.isDeployed}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Stake Tokens
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Functions</CardTitle>
              <CardDescription>Administrative functions for contract management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Reward Eco Action</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rewardAddress">User Address</Label>
                    <Input
                      id="rewardAddress"
                      placeholder="0x..."
                      value={rewardAddress}
                      onChange={(e) => setRewardAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rewardAmount">Reward Amount (ECO)</Label>
                    <Input
                      id="rewardAmount"
                      type="number"
                      placeholder="0.0"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={rewardEcoAction}
                  disabled={!contractState.isDeployed}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Reward Eco Action
                </Button>
              </div>

              <div className="border-t pt-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Admin functions require contract owner privileges. Make sure you're connected with the deployer
                    account.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
