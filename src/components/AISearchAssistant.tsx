/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Mic, MicOff, Search, ArrowRight, Bot, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AISearchAssistantProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
}

export default function AISearchAssistant({ products, onSelectProduct, isOpen, onClose }: AISearchAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your MarketHub AI Shopping Assistant. Ask me anything—I can recommend active noise-cancelling headphones, luxury wood desk organizers, tailored linens, or organic skincare serums based on your custom preference. How can I help you shop today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `m_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate smart backend NLP logic
    setTimeout(() => {
      const lower = text.toLowerCase().trim();
      let matched: Product[] = [];
      let aiText = '';

      // Check common greetings (including 'hlo', 'hi', 'hey', 'hello', etc.)
      const greetings = ['hello', 'hi', 'hey', 'hlo', 'hola', 'greetings', 'yo', 'sup', 'howdy', 'good morning', 'good afternoon'];
      const isGreeting = greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.endsWith(' ' + g) || lower.includes(' ' + g + ' '));

      if (isGreeting) {
        aiText = "Hello! I am here to help you browse active listings, fetch customized product info, or assist you with coupon code details.\n\nType product terms like 'headphones', 'skincare', 'organizer', or try looking up and asking for specific catalog details! How can I assist you today?";
      } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('sound') || lower.includes('music') || lower.includes('hearing') || lower.includes('anc')) {
        matched = products.filter(p => p.id === 'p1');
        aiText = "Based on your interest in pristine audio, I highly recommend our **AeroSound Max**. It features class-leading 40-hour battery life and customizable Active Noise Cancellation (ANC). Here is the match:";
      } else if (lower.includes('wood') || lower.includes('desk') || lower.includes('organizer') || lower.includes('workspace') || lower.includes('walnut')) {
        matched = products.filter(p => p.id === 'p2');
        aiText = "For an elevated, modern desk posture and aesthetic, check out the **Minimalist Walnut Wood Desk Organizer** by Timber & Grace Co. Crafted in solid American walnut wood:";
      } else if (lower.includes('shoe') || lower.includes('run') || lower.includes('sport') || lower.includes('active') || lower.includes('marathon')) {
        matched = products.filter(p => p.id === 'p3');
        aiText = "Our top athletic pick is the **Ventus Breathable Knit Running Shoes**. Engineered with bio-sustainable fibers and high-energy return cushioning:";
      } else if (lower.includes('suit') || lower.includes('coat') || lower.includes('blazer') || lower.includes('dress') || lower.includes('fashion') || lower.includes('linen')) {
        matched = products.filter(p => p.id === 'p4');
        aiText = "I found premium lifestyle apparel for you! Look at this gorgeous **Sartorial Linen Tailored Blazer**, woven from unbleached premium Belgian linen:";
      } else if (lower.includes('skincare') || lower.includes('serum') || lower.includes('glow') || lower.includes('beauty') || lower.includes('face') || lower.includes('vitamin c')) {
        matched = products.filter(p => p.id === 'p5');
        aiText = "Unlock dynamic skin illumination with the **Radiance C-Complex Organic Glow Serum**. Features stabilized ferulic acid and organic citrus essences:";
      } else if (lower.includes('coffee') || lower.includes('bean') || lower.includes('drink') || lower.includes('ethiopia') || lower.includes('grocery')) {
        matched = products.filter(p => p.id === 'p7');
        aiText = "Indulge in our exquisite **Premium Single-Origin Ethiopian Coffee Beans**. Naturally processed in Yirgacheffe heights for outstanding crisp citrus notes:";
      } else if (lower.includes('chair') || lower.includes('furniture') || lower.includes('task') || lower.includes('ergonomic')) {
        matched = products.filter(p => p.id === 'p6');
        aiText = "Improve your posture during heavy typing trails with our **Ergonomic Mesh Contour Task Chair**. Fully customizable 3D armrests and lumbar lock:";
      } else if (lower.includes('book') || lower.includes('read') || lower.includes('handbook') || lower.includes('learn')) {
        matched = products.filter(p => p.id === 'p8');
        aiText = "For futuristic tech paradigms, read **Designing Tomorrow: The Tech Revolution Handbook**. Written for developers and product designers alike:";
      } else {
        // Dynamic search match against ALL products (including dynamic custom products listed by users/vendors)
        const stopwords = new Set(['i', 'want', 'a', 'the', 'to', 'for', 'in', 'is', 'of', 'and', 'you', 'show', 'find', 'search', 'recommend', 'need', 'me', 'buy', 'shop', 'where', 'can', 'get', 'please', 'any', 'some', 'there', 'have', 'has']);
        const tokens = lower
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(t => t && !stopwords.has(t));

        if (tokens.length > 0) {
          matched = products.filter(p => {
            const searchSource = `${p.title} ${p.description} ${p.brand || ''} ${p.category}`.toLowerCase();
            return tokens.some(token => searchSource.includes(token));
          });
        }

        if (matched.length > 0) {
          aiText = `Yes! I successfully found ${matched.length} list item${matched.length > 1 ? 's' : ''} in our active catalog matching your search query. Check out the matched item details:`;
        } else {
          // Fallback random featured recommendation with helpful call-to-action
          const searchWord = tokens.join(' ') || text;
          aiText = `I ran a lookup of our active catalog, but we don't currently have any live listings for "${searchWord}". \n\n💡 **Join our Seller Community**: If you have quality "${searchWord}" items, you can sign up as a **Vendor** to list them and earn money! \n\nIn the meantime, here are some of our top-rated trending products in the market:`;
          matched = products.filter(p => p.isFeatured).slice(0, 2);
        }
      }

      const aiResponse: Message = {
        id: `m_${Date.now() + 1}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: matched
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const startVoiceCapture = () => {
    setIsListening(true);
    // Simulate voice transcribing after 3s
    setTimeout(() => {
      setIsListening(false);
      const voicePrompts = [
        "Find me organic skincare glow serum",
        "Show premium noise cancelling headphones",
        "Minimalist walnut furniture items"
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      handleSend(randomPrompt);
    }, 3200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="ai-assistant-root">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-100">
        {/* Header */}
        <div className="p-4 bg-brand-blue text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-gold rounded-lg text-brand-blue">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg tracking-tight flex items-center gap-1.5">
                MarketHub AI Assistant
              </h3>
              <p className="text-[10px] text-brand-gold-pale/80 font-mono tracking-wider uppercase">Powered by Gemini AI Engine</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info panel */}
        <div className="px-4 py-2 bg-brand-gold-pale border-b border-brand-gold/20 flex items-center gap-2 text-xs text-brand-blue">
          <Bot className="w-4 h-4 text-brand-gold shrink-0 animate-bounce" />
          <span>Real-time voice synthesis and recommendation models active.</span>
        </div>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                {m.sender === 'ai' ? (
                  <>
                    <span className="font-semibold text-brand-blue flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand-gold inline" /> MarketHub AI
                    </span>
                    <span>• {m.timestamp}</span>
                  </>
                ) : (
                  <>
                    <span>You • {m.timestamp}</span>
                  </>
                )}
              </div>
              
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                m.sender === 'user' 
                  ? 'bg-brand-blue text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-slate-100/50 pt-2.5">
                    {m.suggestedProducts.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2 bg-slate-50 hover:bg-brand-gold-pale rounded-xl border border-slate-100 cursor-pointer transition-all hover:scale-[1.02]"
                      >
                        <img 
                          src={p.images[0]} 
                          alt={p.title} 
                          className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-100" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-brand-blue font-bold text-xs font-mono">${p.price}</span>
                            <span className="text-[10px] text-brand-gold font-semibold">★ {p.rating}</span>
                            <span className="text-[10px] text-slate-400 truncate">by {p.sellerName}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-blue shrink-0 mr-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col items-start">
              <span className="font-semibold text-brand-blue text-[10px] mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-gold animate-spin" /> Deep Thinking...
              </span>
              <div className="bg-white rounded-2xl rounded-tl-none border border-slate-100 px-4 py-3 shadow-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Audio mic simulation layer if listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-brand-blue-pale border-t border-brand-gold/10 flex flex-col items-center gap-2 text-center"
            >
              <div className="flex items-center gap-1.5 justify-center py-2">
                <span className="w-1 h-6 bg-brand-blue rounded-full animate-pulse" />
                <span className="w-1.5 h-10 bg-brand-gold rounded-full animate-pulse [animation-delay:200ms]" />
                <span className="w-1 h-8 bg-brand-blue rounded-full animate-pulse [animation-delay:400ms]" />
                <span className="w-1 h-12 bg-brand-gold rounded-full animate-pulse [animation-delay:600ms]" />
                <span className="w-1.5 h-6 bg-brand-blue rounded-full animate-pulse [animation-delay:800ms]" />
              </div>
              <p className="text-xs font-semibold text-brand-blue animate-pulse flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 animate-bounce" /> Listening & transcribing your voice...
              </p>
              <span className="text-[10px] text-slate-500">Keep speaking, or wait for automatic matching</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }} 
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={startVoiceCapture}
              disabled={isListening}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-50 text-red-500 border-red-200' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200 hover:scale-105'
              }`}
              title="Voice Search Assistant"
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask AI or type product keywords..."
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-slate-800"
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold/60 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-slate-400 self-center">Try:</span>
            {[
              "headphones with anc",
              "walnut desk tidy",
              "skincare glow serum"
            ].map(suggest => (
              <button
                key={suggest}
                type="button"
                onClick={() => handleSend(suggest)}
                className="text-[10px] bg-slate-100 hover:bg-brand-gold-pale hover:text-brand-blue px-2.5 py-1 rounded-full text-slate-600 transition-colors"
              >
                "{suggest}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
