import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get API key from environment variable
    const apiKey = process.env.AI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 500 }
      )
    }

    // Prepare the prompt with eco-friendly context
    const systemPrompt = `You are an AI assistant for EcoChain, a sustainable blockchain platform. You help users with:
- Eco-friendly practices and sustainability tips
- Information about ECO tokens and rewards
- Carbon credit and environmental impact guidance
- Blockchain and DeFi concepts related to green finance
- General questions about the platform

Always provide helpful, accurate, and encouraging responses focused on sustainability and environmental consciousness.`

    const userPrompt = `${systemPrompt}

Context: ${context || 'eco-friendly blockchain platform'}

User Question: ${message}

Please provide a helpful response:`

    // Make request to AI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AI API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at the moment.'

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
