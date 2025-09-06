import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Globe } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  language: string;
}

interface KnowledgeBase {
  planets: any[];
  missions: any[];
}

export default function Chatbot() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>({ planets: [], missions: [] });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchChatHistory();
      fetchKnowledgeBase();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: true })
        .limit(20);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const [planetsResponse, missionsResponse] = await Promise.all([
        supabase.from('planets').select('*'),
        supabase.from('missions').select('*')
      ]);

      setKnowledgeBase({
        planets: planetsResponse.data || [],
        missions: missionsResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
    }
  };

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Planet-related questions
    if (lowerQuestion.includes('planet') || lowerQuestion.includes('mars') || 
        lowerQuestion.includes('earth') || lowerQuestion.includes('jupiter')) {
      const planets = knowledgeBase.planets;
      if (lowerQuestion.includes('mars')) {
        const mars = planets.find(p => p.name.toLowerCase() === 'mars');
        return mars ? `Mars is ${mars.description} It's located ${mars.distance_from_earth} from Earth and is ${mars.size_comparison} in size.` 
                   : "Mars is the fourth planet from the Sun, known as the Red Planet due to its rusty color.";
      }
      if (lowerQuestion.includes('earth')) {
        const earth = planets.find(p => p.name.toLowerCase() === 'earth');
        return earth ? earth.description : "Earth is our home planet, the only known planet with life.";
      }
      if (lowerQuestion.includes('jupiter')) {
        const jupiter = planets.find(p => p.name.toLowerCase() === 'jupiter');
        return jupiter ? `Jupiter is ${jupiter.description} It's ${jupiter.distance_from_earth} from Earth.` 
                      : "Jupiter is the largest planet in our solar system, a gas giant with many moons.";
      }
      return `Our solar system has 8 planets: ${knowledgeBase.planets.map(p => p.name).join(', ')}. Which planet would you like to know more about?`;
    }

    // Mission-related questions
    if (lowerQuestion.includes('mission') || lowerQuestion.includes('isro') || 
        lowerQuestion.includes('nasa') || lowerQuestion.includes('chandrayaan')) {
      const missions = knowledgeBase.missions;
      if (lowerQuestion.includes('chandrayaan')) {
        const chandrayaan = missions.find(m => m.name.toLowerCase().includes('chandrayaan'));
        return chandrayaan ? `${chandrayaan.name} was an ${chandrayaan.agency} mission launched on ${new Date(chandrayaan.mission_date).toLocaleDateString()}. ${chandrayaan.description}` 
                          : "Chandrayaan-3 was India's successful lunar mission that achieved a soft landing on the Moon's south pole.";
      }
      if (lowerQuestion.includes('isro')) {
        const isroMissions = missions.filter(m => m.agency === 'ISRO');
        return `ISRO has conducted several notable missions including: ${isroMissions.map(m => m.name).join(', ')}. Which mission interests you most?`;
      }
      return `Here are some notable space missions: ${missions.slice(0, 3).map(m => `${m.name} (${m.agency})`).join(', ')}. What would you like to know about them?`;
    }

    // ISS questions
    if (lowerQuestion.includes('iss') || lowerQuestion.includes('space station')) {
      return "The International Space Station (ISS) is a space laboratory orbiting Earth at about 408 km altitude. It travels at 17,500 mph and completes an orbit every 90 minutes. You can track it live in our Live Tracker section!";
    }

    // General space questions
    if (lowerQuestion.includes('space') || lowerQuestion.includes('universe')) {
      return "Space is vast and mysterious! Our universe contains billions of galaxies, each with billions of stars. We've discovered thousands of exoplanets and continue exploring through missions like James Webb Space Telescope.";
    }

    // Quiz questions
    if (lowerQuestion.includes('quiz') || lowerQuestion.includes('test')) {
      return "Test your space knowledge with our interactive quiz! You can find questions about planets, missions, and space technology. Head to the Quiz section to get started.";
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! I can help you learn about planets, space missions, the ISS, and more. Try asking about Mars, ISRO missions, or the International Space Station.",
      "I'm here to help you explore the wonders of space! Ask me about any planet in our solar system, space missions, or astronomical phenomena.",
      "Great question! I have knowledge about planets, space agencies like ISRO and NASA, satellites, and space exploration. What would you like to discover?",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const translateToHindi = (text: string): string => {
    // Basic translation mapping for common space terms
    const translations: { [key: string]: string } = {
      'planet': 'ग्रह',
      'planets': 'ग्रह',
      'Mars': 'मंगल',
      'Earth': 'पृथ्वी',
      'Jupiter': 'बृहस्पति',
      'mission': 'मिशन',
      'space': 'अंतरिक्ष',
      'Moon': 'चांद',
      'Sun': 'सूर्य',
      'satellite': 'उपग्रह',
      'ISRO': 'इसरो',
      'NASA': 'नासा',
    };

    let translatedText = text;
    for (const [english, hindi] of Object.entries(translations)) {
      translatedText = translatedText.replace(new RegExp(english, 'gi'), hindi);
    }

    // Add Hindi prefix for common responses
    if (text.includes('Mars')) {
      translatedText = `मंगल ग्रह के बारे में: ${translatedText}`;
    } else if (text.includes('mission')) {
      translatedText = `अंतरिक्ष मिशन: ${translatedText}`;
    }

    return translatedText;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = input;
    setInput("");

    try {
      // Generate response based on knowledge base
      let response = generateResponse(userMessage);
      
      // Translate to Hindi if selected
      if (language === "hindi") {
        response = translateToHindi(response);
      }

      // Save to database
      const { data, error } = await supabase
        .from('chat_logs')
        .insert({
          user_id: user?.id,
          question: userMessage,
          answer: response,
          language: language,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setMessages(prev => [...prev, data]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-space pt-20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Space Assistant
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ask me anything about planets, space missions, and exploration
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 h-[600px] flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-orbitron flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                OrbitX Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-background border border-primary/20 rounded px-2 py-1 text-sm"
                >
                  <option value="english">English</option>
                  <option value="hindi">हिंदी</option>
                </select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {language === "hindi" 
                      ? "नमस्ते! मैं आपका अंतरिक्ष सहायक हूं। कुछ भी पूछें!"
                      : "Hello! I'm your space assistant. Ask me anything about space!"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 max-w-md mx-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Tell me about Mars")}
                    >
                      About Mars
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("What is ISRO?")}
                    >
                      About ISRO
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("ISS location")}
                    >
                      ISS Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Space missions")}
                    >
                      Missions
                    </Button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-4">
                    {/* User Message */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-primary/20 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">{message.question}</p>
                      </div>
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Bot Response */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 max-w-xs lg:max-w-md">
                        <p className="text-sm">{message.answer}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {message.language}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === "hindi" ? "अपना प्रश्न यहाँ लिखें..." : "Type your question here..."}
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <Bot className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">AI Powered</h4>
              <p className="text-sm text-muted-foreground">Smart responses based on our space database</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Multilingual</h4>
              <p className="text-sm text-muted-foreground">Available in English and Hindi</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <User className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Personal History</h4>
              <p className="text-sm text-muted-foreground">Your chat history is saved and secure</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}