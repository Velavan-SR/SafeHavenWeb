import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizontal, ShieldCheck, Globe, Mic, MicOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { legalTopics } from '@/data/mockData';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
];

const LegalChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your legal assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // For automatic scrolling to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock function for AI response
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // In a real application, this would call your AI API
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';
        
        // Check if message contains keywords related to legal topics
        const lowercasedMessage = userMessage.toLowerCase();
        const matchedTopic = legalTopics.find(topic => 
          topic.keywords.some(keyword => lowercasedMessage.includes(keyword))
        );
        
        if (matchedTopic) {
          if (matchedTopic.title === 'Domestic Violence') {
            response = "The Protection of Women from Domestic Violence Act 2005 protects women from domestic violence. You can:\n\n1. File a complaint with the nearest police station\n2. Contact a Protection Officer\n3. Get a protection order from court\n4. Seek shelter at a women's shelter\n\nEmergency helpline: 181 for women";
          } else if (matchedTopic.title === 'Sexual Harassment') {
            response = "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act) protects women against sexual harassment at the workplace. Steps to take:\n\n1. Submit a written complaint to the Internal Committee (IC) within 3 months\n2. The IC must complete inquiry within 90 days\n3. You can also file an FIR under IPC Section 354A";
          } else if (matchedTopic.title === 'Child Safety Laws') {
            response = "POCSO Act (Protection of Children from Sexual Offences) protects children from sexual abuse. Important provisions:\n\n1. Child-friendly reporting and investigation procedures\n2. Special courts for speedy trials\n3. Strict punishment for offenders\n\nChildline helpline: 1098 (available 24/7)";
          } else if (matchedTopic.title === 'Cybercrime') {
            response = "Under the Information Technology Act, you are protected against cybercrimes like harassment, stalking, and privacy violations. Actions you can take:\n\n1. Report on www.cybercrime.gov.in\n2. Contact your local cyber crime cell\n3. File an FIR under IT Act and relevant IPC sections\n\nCyber helpline: 1930";
          }
        } else if (lowercasedMessage.includes('help') || lowercasedMessage.includes('assistance')) {
          response = "I can provide information on various legal topics including domestic violence, sexual harassment, child protection laws, and cybercrime. What specific legal information are you looking for?";
        } else if (lowercasedMessage.includes('rights') || lowercasedMessage.includes('law')) {
          response = "There are several important laws in India that protect women and children, including the Domestic Violence Act, POSH Act, POCSO Act, and provisions in the Indian Penal Code. Which specific rights or laws would you like to know more about?";
        } else {
          response = "I understand you're looking for legal assistance. To help you better, could you provide more details about your situation? I can provide information on topics like domestic violence, sexual harassment, child protection, or cybercrime.";
        }
        
        // Simulate translation if language is not English
        if (language !== 'en') {
          response += "\n\n[Note: In a fully implemented version, this response would be provided in your selected language.]";
        }
        
        resolve(response);
      }, 1500);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponse = await generateAIResponse(userMessage.text);
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  // Mock function for voice recognition
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // In a real app, you'd use the Web Speech API here
      setTimeout(() => {
        setInputValue('I need help with domestic violence laws');
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-safehaven-primary text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ShieldCheck className="h-6 w-6 mr-2" />
            <div>
              <CardTitle className="text-xl">Legal Assistant</CardTitle>
              <CardDescription className="text-white text-opacity-80">
                Free & confidential legal guidance
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[130px] bg-white bg-opacity-10 border-0 text-white">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-safehaven-primary text-white rounded-tr-none'
                  : 'bg-safehaven-soft-purple text-gray-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{message.text}</div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white text-opacity-70' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={`rounded-full ${isListening ? 'bg-red-100' : ''}`}
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 text-red-500" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          
          <Input
            placeholder="Type your legal question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isListening}
            className="safehaven-input"
          />
          
          <Button
            type="button"
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-safehaven-primary text-white rounded-full"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LegalChatbot;
