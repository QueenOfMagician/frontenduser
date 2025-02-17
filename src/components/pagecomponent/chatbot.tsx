import { MessageCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { useState } from 'react'

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{sender: string, message: string}[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (currentMessage.trim()) {
          setChatMessages([...chatMessages, { sender: 'user', message: currentMessage }])
          setTimeout(() => {
            setChatMessages(prev => [...prev, { sender: 'bot', message: "Thank you for your message. How can I assist you today?" }])
          }, 1000)
          setCurrentMessage('')
        }
      }

    return (
        <>
{/* Chatbot */}
<div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setChatOpen(!chatOpen)}
          className="rounded-full w-12 h-12 flex items-center justify-center"
        >
          <MessageCircle />
        </Button>
        {chatOpen && (
          <Card className="absolute bottom-16 right-0 w-80">
            <CardContent className="p-4">
              <div className="h-64 overflow-y-auto mb-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      {msg.message}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-grow mr-2"
                />
                <Button type="submit">Send</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </>
    )
}