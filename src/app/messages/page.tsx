"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Property } from "@/lib/types";
import { MessageCircle, Send, Loader2, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ChatMessage = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  propertyTitle?: string;
};

function MessagesContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("property");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);

      const { data: likes } = await supabase
        .from("property_likes")
        .select("property_id")
        .eq("user_id", user.id)
        .eq("liked", true);

      if (likes && likes.length > 0) {
        const propertyIds = likes.map((l) => l.property_id);
        const { data: properties } = await supabase
          .from("properties")
          .select("*")
          .in("id", propertyIds);
        
        setLikedProperties(properties || []);

        if (propertyId) {
          const property = properties?.find(p => p.id === propertyId);
          if (property) {
            setSelectedProperty(property);
            setMessages([
              {
                id: "welcome",
                content: `Hi there! I'm interested in learning more about "${property.title}". How can I schedule a viewing?`,
                isUser: true,
                timestamp: new Date(),
                propertyTitle: property.title,
              },
              {
                id: "response",
                content: `Thanks for your interest in ${property.title}! I'm ${property.realtor_name || "the listing agent"}. I'd be happy to arrange a viewing. What days work best for you this week?`,
                isUser: false,
                timestamp: new Date(Date.now() + 1000),
              },
            ]);
          }
        }
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [user, supabase, propertyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedProperty) return;
    
    setIsSending(true);
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");

    setTimeout(() => {
      const responses = [
        "I'll check on that for you right away!",
        "Great question! Let me get back to you with more details.",
        "That's definitely possible. Let me see what we can arrange.",
        "I understand your concern. The property has excellent features that address that.",
        "Would you like me to send you some additional photos of that area?",
      ];
      
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentMsg]);
      setIsSending(false);
    }, 1500);
  };

  const selectProperty = (property: Property) => {
    setSelectedProperty(property);
    setMessages([
      {
        id: "welcome-" + property.id,
        content: `Hi! I'm interested in "${property.title}" listed at $${property.price.toLocaleString()}. Is it still available?`,
        isUser: true,
        timestamp: new Date(),
        propertyTitle: property.title,
      },
      {
        id: "response-" + property.id,
        content: `Hello! Yes, ${property.title} is still available! I'm ${property.realtor_name || "your dedicated agent"}. How can I help you today?`,
        isUser: false,
        timestamp: new Date(Date.now() + 1000),
      },
    ]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald animate-spin" />
      </div>
    );
  }

  if (likedProperties.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
          <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-serif">Messages</span>
            </div>
          </div>
        </header>

        <main className="pt-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-2">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif">No Conversations Yet</h2>
            <p className="text-muted-foreground">
              Like some properties first to start chatting with realtors!
            </p>
            <Link href="/discover">
              <Button className="gradient-emerald text-background mt-4">
                <Home className="w-4 h-4 mr-2" />
                Discover Properties
              </Button>
            </Link>
          </motion.div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          {selectedProperty ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedProperty(null)}
                className="shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={selectedProperty.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100"}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h2 className="font-medium text-sm line-clamp-1">{selectedProperty.title}</h2>
                  <p className="text-xs text-muted-foreground">{selectedProperty.realtor_name || "Listing Agent"}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-serif">Messages</span>
            </>
          )}
        </div>
      </header>

      <main className="pt-16">
        {!selectedProperty ? (
          <div className="p-4 max-w-lg mx-auto">
            <p className="text-sm text-muted-foreground mb-4">Select a property to chat with the agent</p>
            <div className="space-y-3">
              {likedProperties.map((property) => (
                <motion.button
                  key={property.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => selectProperty(property)}
                  className="w-full bg-card rounded-2xl border border-border p-3 flex items-center gap-3 hover:border-emerald/50 transition-colors text-left"
                >
                  <img
                    src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100"}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.city}, {property.state}</p>
                    <p className="text-sm text-emerald font-medium">{property.realtor_name || "Contact Agent"}</p>
                  </div>
                  <MessageCircle className="w-5 h-5 text-emerald shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-140px)]">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-4 max-w-lg mx-auto">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.isUser
                          ? "gradient-emerald text-background rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isUser ? "text-background/70" : "text-muted-foreground"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border glass">
              <div className="flex gap-2 max-w-lg mx-auto">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="bg-secondary/50 border-border"
                />
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || isSending}
                  className="gradient-emerald text-background shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {!selectedProperty && <BottomNav />}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald animate-spin" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}