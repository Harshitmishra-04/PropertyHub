import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useProperties } from "@/contexts/PropertiesContext";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const formatMessage = (content: string) => {
  
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  
  return paragraphs.map((paragraph, pIndex) => {
    const trimmed = paragraph.trim();
    
    const hasListMarkers = /^[\s]*[-*•]\s|^[\s]*\d+\.\s/m.test(trimmed);
    
    if (hasListMarkers) {

      const items = trimmed.split(/\n(?=[-*•\d])/).filter(item => item.trim());
      
      return (
        <ul key={pIndex} className="list-disc list-inside space-y-1.5 my-2 ml-2">
          {items.map((item, iIndex) => {
            
            const cleanItem = item.replace(/^[\s]*[-*•]\s|^[\s]*\d+\.\s/, '').trim();
            if (!cleanItem) return null;
            return (
              <li key={iIndex} className="text-sm leading-relaxed">
                {cleanItem}
              </li>
            );
          })}
        </ul>
      );
    }
    
    const lines = trimmed.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;
    
    return (
      <p key={pIndex} className="mb-2 last:mb-0 text-sm leading-relaxed">
        {lines.map((line, lIndex) => (
          <span key={lIndex}>
            {line.trim()}
            {lIndex < lines.length - 1 && <br className="mb-1" />}
          </span>
        ))}
      </p>
    );
  });
};

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI property assistant. I can help you find properties, answer questions, or provide recommendations. What are you looking for?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { properties } = useProperties();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiService.getSearchAssistance(userMessage, properties);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      const message =
        /status 401/.test(msg)
          ? "Please login to use the AI assistant."
          : /status 503/.test(msg)
          ? "AI is not configured on the server yet. Add OPENROUTER_API_KEY on Render (not VITE_*) and redeploy."
          : /status 402/.test(msg)
          ? "OpenRouter credits are too low. Add credits at openrouter.ai/settings/credits, or set MAX_AI_OUTPUT_TOKENS lower on Render (e.g. 512) and redeploy."
          : /status 502/.test(msg)
          ? "The AI provider rejected the request (invalid key, model, or rate limit). Check Render logs for \"OpenRouter error\"."
          : /status 500/.test(msg)
          ? "Server error while calling AI. Check Render logs for POST /ai/chat."
          : /Failed to fetch|NetworkError|Load failed/i.test(msg)
          ? "Cannot reach the API (often CORS or wrong URL). On Vercel set VITE_API_URL to your Render API. On Render set CLIENT_ORIGIN to your exact site origin(s), comma-separated, e.g. https://your-app.vercel.app"
          : `Sorry, I encountered an error. Please try again in a moment.${msg ? ` (${msg})` : ""}`;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">AI Property Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {formatMessage(message.content)}
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about properties..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button onClick={handleSend} size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatAssistant;
