import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  suggestions?: any[];
}

export const CarChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allCars, setAllCars] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "Hello! 👋 I'm your car shopping assistant. I can help you find the perfect car based on your preferences.\n\nTell me what you're looking for! For example:\n• \"I need a luxury SUV under 50 lakhs\"\n• \"Show me electric cars\"\n• \"I want a family car with good mileage\"\n• \"Budget-friendly hatchback for city driving\""
      );
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*');
      
      if (error) throw error;
      setAllCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, suggestions?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      text,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const analyzeQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Extract preferences from query
    const preferences = {
      budget: extractBudget(lowerQuery),
      bodyType: extractBodyType(lowerQuery),
      fuelType: extractFuelType(lowerQuery),
      brand: extractBrand(lowerQuery),
      features: extractFeatures(lowerQuery)
    };

    return preferences;
  };

  const extractBudget = (query: string) => {
    // Match patterns like "under 50 lakhs", "below 20L", "30-40 lakhs"
    const patterns = [
      /under\s+(\d+)\s*(?:lakhs?|l)/i,
      /below\s+(\d+)\s*(?:lakhs?|l)/i,
      /(\d+)\s*(?:lakhs?|l)/i,
      /(\d+)\s*cr/i,
    ];

    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match) {
        const amount = parseInt(match[1]);
        if (query.includes('cr')) {
          return { max: amount * 10000000 };
        }
        return { max: amount * 100000 };
      }
    }

    // Budget categories
    if (query.includes('budget') || query.includes('affordable') || query.includes('cheap')) {
      return { max: 2000000 }; // Under 20L
    }
    if (query.includes('premium') || query.includes('luxury')) {
      return { min: 5000000 }; // Above 50L
    }

    return null;
  };

  const extractBodyType = (query: string) => {
    const bodyTypes = ['suv', 'sedan', 'hatchback', 'coupe', 'convertible', 'mpv'];
    for (const type of bodyTypes) {
      if (query.includes(type)) {
        return type.toUpperCase();
      }
    }
    return null;
  };

  const extractFuelType = (query: string) => {
    if (query.includes('electric') || query.includes('ev')) return 'Electric';
    if (query.includes('petrol') || query.includes('gasoline')) return 'Petrol';
    if (query.includes('diesel')) return 'Diesel';
    if (query.includes('hybrid')) return 'Hybrid';
    if (query.includes('cng')) return 'CNG';
    return null;
  };

  const extractBrand = (query: string) => {
    const brands = ['bmw', 'mercedes', 'audi', 'jaguar', 'land rover', 'ferrari', 'maruti', 'hyundai', 'tata', 'kia', 'honda', 'toyota'];
    for (const brand of brands) {
      if (query.includes(brand)) {
        return brand;
      }
    }
    return null;
  };

  const extractFeatures = (query: string) => {
    const features = [];
    if (query.includes('family')) features.push('spacious', 'safe');
    if (query.includes('mileage') || query.includes('fuel efficient')) features.push('efficient');
    if (query.includes('performance') || query.includes('fast') || query.includes('sporty')) features.push('powerful');
    if (query.includes('city')) features.push('compact');
    return features;
  };

  const searchCars = (preferences: any) => {
    let results = [...allCars];

    // Filter by budget
    if (preferences.budget) {
      if (preferences.budget.max) {
        results = results.filter(car => car.price <= preferences.budget.max);
      }
      if (preferences.budget.min) {
        results = results.filter(car => car.price >= preferences.budget.min);
      }
    }

    // Filter by body type
    if (preferences.bodyType) {
      results = results.filter(car => 
        car.body_type?.toLowerCase() === preferences.bodyType.toLowerCase()
      );
    }

    // Filter by fuel type
    if (preferences.fuelType) {
      results = results.filter(car => 
        car.fuel_type?.toLowerCase() === preferences.fuelType.toLowerCase()
      );
    }

    // Filter by brand
    if (preferences.brand) {
      results = results.filter(car => 
        car.brand?.toLowerCase().includes(preferences.brand.toLowerCase())
      );
    }

    // Filter by features
    if (preferences.features.includes('efficient')) {
      results = results.filter(car => car.mileage_kmpl && car.mileage_kmpl > 15);
    }
    if (preferences.features.includes('powerful')) {
      results = results.filter(car => car.power_bhp && car.power_bhp > 200);
    }
    if (preferences.features.includes('spacious')) {
      results = results.filter(car => car.seating_capacity && car.seating_capacity >= 5);
    }

    // Sort by relevance (price, then features)
    results.sort((a, b) => {
      if (preferences.features.includes('powerful')) {
        return (b.power_bhp || 0) - (a.power_bhp || 0);
      }
      if (preferences.features.includes('efficient')) {
        return (b.mileage_kmpl || 0) - (a.mileage_kmpl || 0);
      }
      return a.price - b.price; // Default: cheapest first
    });

    return results.slice(0, 5); // Return top 5 matches
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userQuery = inputValue.trim();
    addUserMessage(userQuery);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const preferences = analyzeQuery(userQuery);
      const matchedCars = searchCars(preferences);

      let response = '';
      
      if (matchedCars.length === 0) {
        response = "I couldn't find any cars matching your exact criteria. Let me show you some popular options instead!";
        // Show some popular cars
        const popular = allCars.slice(0, 5);
        addBotMessage(response, popular);
      } else {
        response = `Great! I found ${matchedCars.length} car${matchedCars.length > 1 ? 's' : ''} that match your requirements:\n\n`;
        
        if (preferences.budget) {
          response += `💰 Budget: Up to ${formatPrice(preferences.budget.max || 0)}\n`;
        }
        if (preferences.bodyType) {
          response += `🚗 Type: ${preferences.bodyType}\n`;
        }
        if (preferences.fuelType) {
          response += `⛽ Fuel: ${preferences.fuelType}\n`;
        }
        
        response += '\nHere are my top recommendations:';
        
        addBotMessage(response, matchedCars);
      }
      
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickQuestions = [
    "Show me luxury SUVs",
    "Budget cars under 10 lakhs",
    "Electric vehicles",
    "Best mileage cars",
    "BMW models"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl z-50 bg-gray-800 hover:bg-gray-700 text-white transition-all"
          size="icon"
          aria-label="Car Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-white border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Car Assistant</CardTitle>
                  <p className="text-xs text-gray-500">Ask me anything</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-700" />
                    )}
                  </div>
                  <div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    
                    {/* Car Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.suggestions.map((car) => (
                          <Card 
                            key={car.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              navigate(`/car/${car.id}`);
                              setIsOpen(false);
                            }}
                          >
                            <CardContent className="p-3">
                              <div className="flex gap-3">
                                {car.image_url && (
                                  <img
                                    src={car.image_url}
                                    alt={`${car.make} ${car.model}`}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">
                                    {car.make} {car.model}
                                  </p>
                                  <p className="text-xs text-gray-600">{car.year}</p>
                                  <p className="text-sm font-bold text-primary mt-1">
                                    {formatPrice(car.price)}
                                  </p>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {car.fuel_type}
                                    </Badge>
                                    {car.mileage_kmpl && (
                                      <Badge variant="outline" className="text-xs">
                                        {car.mileage_kmpl} km/l
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-700" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};
