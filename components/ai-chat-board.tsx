"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Leaf, Coins } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "eco-tip" | "token-info" | "general"
}

export default function AIChatBoard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your EcoChain AI assistant. I can help you with eco-friendly tips, token information, and sustainable practices. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
      type: "general"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    "How can I earn more ECO tokens?",
    "What are the best eco-friendly practices?",
    "Tell me about carbon credits",
    "How does the governance system work?",
    "What sustainable actions give the most rewards?"
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          context: "eco-friendly blockchain platform, sustainability, carbon credits, green tokens"
        })
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm sorry, I couldn't process your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        type: determineMessageType(content)
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again.")
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
        type: "general"
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const determineMessageType = (content: string): "eco-tip" | "token-info" | "general" => {
    const lowerContent = content.toLowerCase()
    if (lowerContent.includes("token") || lowerContent.includes("eco") || lowerContent.includes("reward")) {
      return "token-info"
    }
    if (lowerContent.includes("tip") || lowerContent.includes("practice") || lowerContent.includes("sustainable")) {
      return "eco-tip"
    }
    return "general"
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "eco-tip":
        return <Leaf className="h-4 w-4 text-green-600" />
      case "token-info":
        return <Coins className="h-4 w-4 text-yellow-600" />
      default:
        return <Sparkles className="h-4 w-4 text-blue-600" />
    }
  }

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case "eco-tip":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Eco Tip</Badge>
      case "token-info":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Token Info</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-green-100">
            <AvatarImage src="/placeholder-logo.png" />
            <AvatarFallback className="bg-green-100 text-green-700">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">EcoChain AI Assistant</CardTitle>
            <p className="text-sm text-gray-600">Your sustainable blockchain companion</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Quick Prompts */}
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="text-xs h-8"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-green-100">
                    <AvatarImage src="/placeholder-logo.png" />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                  <div className={`rounded-lg p-3 ${
                    message.role === "user" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-900"
                  }`}>
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && getMessageIcon(message.type)}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.role === "assistant" && getMessageBadge(message.type)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-blue-100">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-green-100">
                  <AvatarImage src="/placeholder-logo.png" />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about eco-friendly practices, tokens, or sustainability..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 