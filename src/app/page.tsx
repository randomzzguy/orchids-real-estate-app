"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Heart, MapPin, MessageCircle, Sparkles, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-emerald/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald/15 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center">
            <Home className="w-5 h-5 text-background" />
          </div>
          <span className="text-2xl font-serif text-gradient">Nestify</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:text-emerald">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="gradient-emerald text-background hover:opacity-90">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 border border-emerald/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald" />
              <span className="text-sm text-emerald">AI-Powered Home Discovery</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-serif leading-tight mb-6">
              Swipe Your Way to
              <span className="text-gradient block">Your Dream Home</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Discover stunning properties with a simple swipe. Like what you see? Save it. 
              Our AI learns your taste and finds your perfect match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="gradient-emerald text-background h-14 px-8 text-lg hover:opacity-90 group">
                  Start Swiping
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border hover:bg-secondary/50 hover:border-emerald/50">
                  I Have an Account
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-serif text-gradient">50K+</div>
                <div className="text-sm text-muted-foreground">Properties</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-gradient">12K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-gradient">98%</div>
                <div className="text-sm text-muted-foreground">Match Rate</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl overflow-hidden card-glow">
                <img 
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" 
                  alt="Luxury property"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="px-3 py-1 rounded-full bg-emerald/20 border border-emerald/30">
                      <span className="text-sm font-semibold text-emerald">$2,850,000</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Miami, FL</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif mb-2">Modern Luxe Villa</h3>
                  <p className="text-muted-foreground text-sm">5 bed • 4 bath • 4,500 sqft</p>
                </div>
              </div>

              <motion.div
                initial={{ x: 60, y: -30, rotate: 8, opacity: 0 }}
                animate={{ x: 60, y: -30, rotate: 8, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-8 -right-8 w-64 h-80 rounded-2xl overflow-hidden border border-border shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" 
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ x: -40, y: 40, rotate: -6, opacity: 0 }}
                animate={{ x: -40, y: 40, rotate: -6, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-4 -left-12 w-56 h-72 rounded-2xl overflow-hidden border border-border shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400" 
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gradient mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Finding your dream home has never been this intuitive
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Swipe & Save", desc: "Like properties with a simple swipe right", color: "emerald" },
              { icon: Sparkles, title: "AI Learns", desc: "Our AI understands your preferences", color: "gold" },
              { icon: MapPin, title: "Explore Map", desc: "See all your favorites on an interactive map", color: "emerald" },
              { icon: MessageCircle, title: "Connect", desc: "Chat directly with realtors in-app", color: "gold" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 border border-border hover:border-emerald/30 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color === "emerald" ? "gradient-emerald" : "gradient-gold"} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-xl font-serif mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
              <Home className="w-4 h-4 text-background" />
            </div>
            <span className="font-serif text-gradient">Nestify</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Nestify. Find your perfect home.</p>
        </div>
      </footer>
    </div>
  );
}
