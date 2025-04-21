// src/pages/LegalAssistancePage.tsx
import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { getLegalGuidance } from '../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const emergencyContacts = [
  { name: "Women's Helpline", number: "1091" },
  { name: "Police", number: "100" },
  { name: "Child Helpline", number: "1098" },
  { name: "Women's Commission", number: "011-26942369" },
];

export default function LegalAssistancePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatResponse = (text: string) => {
    // Replace markdown-style bold with HTML
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace bullet points
    text = text.replace(/•/g, '•  ');
    
    // Add proper line breaks for lists
    text = text.replace(/(\d+\.|•)\s/g, '\n$1 ');
    
    // Add spacing after periods
    text = text.replace(/\./g, '. ');
    
    // Add double line breaks between paragraphs
    text = text.replace(/\n/g, '\n');
    
    return text;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getLegalGuidance(input);
      const formattedResponse = formatResponse(response);
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: formattedResponse 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'I apologize, but I am unable to provide guidance at the moment. Please contact emergency services if you need immediate assistance.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Legal Guidance Assistant</h1>
        
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            This assistant provides general legal information only. For immediate assistance,
            please contact the emergency numbers below.
          </AlertDescription>
        </Alert>

        {/* Emergency Contacts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {emergencyContacts.map((contact) => (
            <Card key={contact.name} className="p-4 text-center">
              <h3 className="font-semibold text-sm mb-1">{contact.name}</h3>
              <p className="text-lg text-blue-600">{contact.number}</p>
            </Card>
          ))}
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content.replace(/\n/g, '<br/>') 
                    }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500">
                Assistant is thinking...
              </div>
            )}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                Ask any question about legal rights and protections for women and children.
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your legal question here..."
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}