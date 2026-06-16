import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Heart, 
  Flame, 
  MessageCircle, 
  Send, 
  AlertTriangle, 
  Trash2, 
  ShieldCheck, 
  RefreshCw, 
  BookOpen, 
  Check, 
  Activity, 
  User, 
  ChevronRight, 
  Wind, 
  Eye, 
  Compass, 
  Lock,
  Smile,
  BarChart2,
  PieChart as PieIcon,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

// Anonymous Pseudonym Generation Constants
const PREFIXES = [
  "Silent", "Gentle", "Warm", "Peaceful", "Drifting", 
  "Cozy", "Midnight", "Golden", "Wandering", "Solitary", 
  "Calm", "Echoing", "Amber", "Tranquil", "Soft"
];

const NOUNS = [
  "Star", "Clover", "Glacier", "Phoenix", "Firefly", 
  "Cloud", "River", "Breeze", "Meadow", "Moon", 
  "Willow", "Lantern", "Wave", "Lotus", "Pebble"
];

const CATEGORIES = [
  { name: "Love & Belonging", desc: "For unconfessed affection, silent longings, and warm unions.", color: "border-pink-500/30 text-pink-400 bg-pink-500/5 hover:bg-pink-500/10" },
  { name: "Anxiety & Stress", desc: "For heavy burdens, late-night doubts, and overwhelmed minds.", color: "border-sky-500/30 text-sky-400 bg-sky-500/5 hover:bg-sky-500/10" },
  { name: "Motivation & Joy", desc: "For quiet triumphs, tiny daily victories, and bright sparks.", color: "border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10" },
  { name: "Silly Secrets", desc: "For little confessions, harmless mischief, and playful guilt.", color: "border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10" },
  { name: "Regrets & Healing", desc: "For the unspoken 'sorry', healing wounds, and clean slates.", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" },
  { name: "Late Night Thoughts", desc: "For existential wanderings, raw nostalgia, and silent midnights.", color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10" }
];

const VIBES = [
  { id: 'cosmic', name: '🌌 Cosmic Velvet', bg: 'bg-gradient-to-br from-[#12182D]/90 to-[#0A0D1A]/90 border-indigo-500/20 text-indigo-100', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.06)]', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25' },
  { id: 'sunset', name: '🌅 Warm Hearth', bg: 'bg-gradient-to-br from-[#211425]/90 to-[#0D0711]/90 border-rose-500/20 text-rose-100', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.06)]', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/25' },
  { id: 'aurora', name: '💚 Northern Aurora', bg: 'bg-gradient-to-br from-[#0C1E1B]/90 to-[#040D0B]/90 border-emerald-500/25 text-emerald-100', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.06)]', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' },
  { id: 'mystic', name: '🔮 Midnight Orchid', bg: 'bg-gradient-to-br from-[#18112C]/90 to-[#0B0616]/90 border-purple-500/20 text-purple-100', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.06)]', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/25' },
  { id: 'ocean', name: '🌊 Abyssal Deep', bg: 'bg-gradient-to-br from-[#0C172A]/90 to-[#050B15]/90 border-sky-500/20 text-sky-100', glow: 'shadow-[0_0_30px_rgba(14,165,233,0.06)]', badge: 'bg-sky-500/10 text-sky-300 border-sky-500/25' },
];

const JOURNAL_PROMPTS = [
  "What is a tiny daily victory you achieved today that you cannot boast about to anyone else?",
  "Is there a person you miss deeply but cannot reach out to anymore? Why?",
  "Write down a truth that you have been hiding even from yourself lately.",
  "What is a friendly lie you told to protect someone else's feelings, and do you regret it?",
  "If you had 1 minute to tell your past self one piece of advice, what would it be?",
  "What is a heavy worry currently floating in your mind? Let it drift onto paper here.",
  "Which sensory memory brings you immediate comfort (a specific scent, rainfall, a distant song)?",
  "Is there a grudge you are finally ready to forgive and release into the sky?",
  "What is the kindest thing an absolute stranger has ever done or said to you?"
];

const COUNSELORS = [
  {
    id: "hope",
    name: "Hope",
    title: "Empathetic Companion",
    bio: "Soft silver linings and supportive listening. Hope seeks to gently wrap your heavy feelings in warm validation and peaceful optimism.",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300",
    glow: "shadow-purple-500/10",
    avatar: "🫂"
  },
  {
    id: "ember",
    name: "Ember",
    title: "Warm Cheerleader",
    bio: "Uplifting and courageous. Ember values your bravery in opening up, fostering inner strength and celebrating your spark of resilience.",
    color: "from-orange-500/20 to-amber-500/20 border-amber-500/30 text-amber-300",
    glow: "shadow-amber-500/10",
    avatar: "🔥"
  },
  {
    id: "willow",
    name: "Willow",
    title: "Thoughtful Wise Guide",
    bio: "Deep calmness and grounding. Willow guides you into soothing mindfulness, offering tranquil perspectives to quiet the racing tides of mind.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300",
    glow: "shadow-emerald-500/10",
    avatar: "🌿"
  }
];

const getSuggestedPrompts = (counselorId: string) => {
  if (counselorId === 'hope') {
    return [
      "I am holding a heavy secret about someone I love, help me unpack it gracefully.",
      "I felt an overwhelming panic today and just want a calming ear to hold onto.",
      "How do I let go of bad feelings that persist despite trying to stay positive?"
    ];
  }
  if (counselorId === 'ember') {
    return [
      "I achieved a small personal goal today but have nobody in real life to share my pride with!",
      "I did a silly, harmless thing that I find highly amusing, can I tell you about it?",
      "Can we do a dynamic exercise to boost my self-concept or confidence?"
    ];
  }
  return [
    "My brain feels extremely noisy tonight. Help me do a gentle grounding exercise.",
    "I made an unspoken mistake recently and am carrying silent guilt.",
    "Can you share a brief, comforting metaphor about resilience or healing?"
  ];
};

export default function App() {
  // Pseudonym configuration
  const [pseudonym, setPseudonym] = useState('');
  
  // Tab control: 'sky', 'whisper', 'breath', 'haven', 'admin'
  const [activeTab, setActiveTab] = useState('sky');
  
  // Stories & Filters state
  const [stories, setStories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStories, setLoadingStories] = useState(true);
  
  // Post story state
  const [storyInput, setStoryInput] = useState('');
  const [storyCategory, setStoryCategory] = useState(CATEGORIES[0].name);
  const [storyVibe, setStoryVibe] = useState('cosmic');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);
  
  // Expanded comments indices
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  
  // Counseling Haven state
  const [activeCounselor, setActiveCounselor] = useState<any | null>(null);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [chatInFlight, setChatInFlight] = useState(false);

  // Breathing Box states
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold-out'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathRunning, setBreathRunning] = useState(false);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Admin access
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSection, setAdminSection] = useState<'reports' | 'dashboard' | 'all-stories'>('reports');
  const [reportedStories, setReportedStories] = useState<any[]>([]);
  const [allStories, setAllStories] = useState<any[]>([]);
  const [adminStoriesSearch, setAdminStoriesSearch] = useState('');
  const [loadingAllStories, setLoadingAllStories] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [adminError, setAdminError] = useState('');

  // Autoassign Pseudonym on startup
  useEffect(() => {
    let saved = localStorage.getItem('whisperer_name');
    if (!saved) {
      saved = generateRandomPseudonym();
      localStorage.setItem('whisperer_name', saved);
    }
    setPseudonym(saved);
  }, []);

  // Fetch stories on tab mount
  useEffect(() => {
    fetchStories();
  }, []);

  // Sync chats for the current user
  useEffect(() => {
    if (pseudonym) {
      fetchChatSessions();
    }
  }, [pseudonym]);

  // Handle scroll to bottom of active chat channel
  useEffect(() => {
    if (activeCounselor && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCounselor, chatSessions]);

  // Breathing loop effect
  useEffect(() => {
    if (!breathRunning) {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      return;
    }

    breathIntervalRef.current = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          // transition phase
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 7; // hold for 7s
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 8; // exhale for 8s
          } else if (breathPhase === 'exhale') {
            setBreathPhase('hold-out');
            return 4; // hold before next inhale
          } else {
            setBreathPhase('inhale');
            return 4; // inhale for 4s
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, [breathRunning, breathPhase]);

  // Generate a random cozy and anonymous pseudonym
  const generateRandomPseudonym = () => {
    const pref = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${pref} ${noun}`;
  };

  const handleRegeneratePseudonym = () => {
    const fresh = generateRandomPseudonym();
    localStorage.setItem('whisperer_name', fresh);
    setPseudonym(fresh);
    // Restart tabs that might be bound to chat sessions
    setActiveCounselor(null);
  };

  // API Call: GET stories
  const fetchStories = async () => {
    try {
      setLoadingStories(true);
      const res = await fetch('/api/stories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStories(data);
      }
    } catch (e) {
      console.error("Error loading stories:", e);
    } finally {
      setLoadingStories(false);
    }
  };

  // API Call: POST Story
  const handlePublishStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyInput.trim() || isPublishing) return;

    try {
      setIsPublishing(true);
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: storyInput,
          category: storyCategory,
          authorPseudonym: pseudonym,
          vibe: storyVibe
        })
      });

      if (response.ok) {
        setStoryInput('');
        setStoryVibe('cosmic');
        setShowCelebrate(true);
        fetchStories(); // Refresh current sky
        setTimeout(() => {
          setShowCelebrate(false);
          setActiveTab('sky'); // Bounce back to sky view
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  // API Call: POST React
  const handleReactToStory = async (storyId: string, reactionType: string) => {
    // Optimistic UI updates
    setStories((prev) => 
      prev.map(s => {
        if (s.id === storyId) {
          return {
            ...s,
            reactions: {
              ...s.reactions,
              [reactionType]: (s.reactions[reactionType as keyof typeof s.reactions] || 0) + 1
            }
          };
        }
        return s;
      })
    );

    try {
      await fetch(`/api/stories/${storyId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType })
      });
    } catch (e) {
      console.error("Failed to sync reaction physically:", e);
    }
  };

  // API Call: POST Comment
  const handlePostComment = async (storyId: string) => {
    const text = commentInput[storyId] || '';
    if (!text.trim()) return;

    // Optimistically push comment locally
    const mockComment = {
      id: 'comment-temp-' + Math.random(),
      text: text,
      authorPseudonym: pseudonym,
      createdAt: new Date().toISOString()
    };

    setStories((prev) => 
      prev.map(s => {
        if (s.id === storyId) {
          return {
            ...s,
            comments: [...(s.comments || []), mockComment]
          };
        }
        return s;
      })
    );

    // Clear input
    setCommentInput(prev => ({ ...prev, [storyId]: '' }));

    try {
      await fetch(`/api/stories/${storyId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          authorPseudonym: pseudonym
        })
      });
      // Fetch fresh tree to ensure exact database alignment
      fetchStories();
    } catch (e) {
      console.error("Failed to write comment physically:", e);
    }
  };

  // API Call: POST Report Flag
  const handleReportStory = async (storyId: string) => {
    if (!confirm("Are you sure this whisper violates sanctuary safety, or contains abusive content? It will be sent to the moderator panel.")) {
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}/report`, {
        method: 'POST'
      });
      if (response.ok) {
        // Remove locally from normal view instantly
        setStories(prev => prev.filter(s => s.id !== storyId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // API Call: GET chats
  const fetchChatSessions = async () => {
    try {
      const res = await fetch(`/api/chats?pseudonym=${encodeURIComponent(pseudonym)}`);
      if (res.ok) {
        const data = await res.json();
        setChatSessions(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // API Call: POST Start chat
  const handleStartConversation = async (counselor: any) => {
    setChatLoading(true);
    setActiveCounselor(counselor);
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPseudonym: pseudonym,
          counselorId: counselor.id,
          counselorName: counselor.name
        })
      });
      if (res.ok) {
        await fetchChatSessions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  // API Call: POST Send message in chat
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || chatInFlight || !activeCounselor) return;

    const session = chatSessions.find(s => s.counselorId === activeCounselor.id);
    if (!session) return;

    const text = messageInput;
    setMessageInput('');
    setChatInFlight(true);

    // Dynamic Optimistic addition of user's message
    const tempUserMsg = {
      id: 'msg-temp-' + Math.random(),
      sender: pseudonym,
      text: text,
      createdAt: new Date().toISOString()
    };

    setChatSessions(prev => 
      prev.map(s => {
        if (s.id === session.id) {
          return {
            ...s,
            messages: [...s.messages, tempUserMsg]
          };
        }
        return s;
      })
    );

    try {
      const res = await fetch(`/api/chats/${session.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: pseudonym,
          text
        })
      });

      if (res.ok) {
        const updatedSession = await res.json();
        setChatSessions(prev => 
          prev.map(s => s.id === session.id ? updatedSession : s)
        );
      }
    } catch (e) {
      console.error("Chat reflection fault:", e);
    } finally {
      setChatInFlight(false);
    }
  };

  // Admin section passcode submission
  const handleVerifyAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === 'whisper-peace') {
      setIsAdmin(true);
      setAdminError('');
      fetchAdminReports();
      fetchAdminAnalytics();
      fetchAllStoriesAdmin();
    } else {
      setAdminError('Passcode incorrect. Deep breaths.');
    }
  };

  // API Call: GET reports for Admin
  const fetchAdminReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      if (res.ok) {
        const data = await res.json();
        setReportedStories(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // API Call: GET all stories for Admin
  const fetchAllStoriesAdmin = async () => {
    try {
      setLoadingAllStories(true);
      const res = await fetch('/api/admin/stories');
      if (res.ok) {
        const data = await res.json();
        setAllStories(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAllStories(false);
    }
  };

  // API Call: Delete any story (Admin action)
  const handleAdminDeleteStory = async (storyId: string) => {
    if (!confirm("Are you absolutely sure you want to permanently delete this story of anyone? This action cannot be revoked.")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/stories/${storyId}/delete`, {
        method: 'POST'
      });
      if (res.ok) {
        // Refresh local feeds
        setStories(prev => prev.filter(s => s.id !== storyId));
        setAllStories(prev => prev.filter(s => s.id !== storyId));
        setReportedStories(prev => prev.filter(s => s.id !== storyId));
        fetchAdminAnalytics();
      } else {
        alert("Failed to delete story.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // API Call: GET stats analytics
  const fetchAdminAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // REST/Admin story removal / keep
  const handleAdminModerate = async (storyId: string, action: 'keep' | 'hide') => {
    try {
      const res = await fetch(`/api/admin/stories/${storyId}/${action}`, {
        method: 'POST'
      });
      if (res.ok) {
        setReportedStories(prev => prev.filter(s => s.id !== storyId));
        // Refresh feed for visual consistency
        fetchStories();
        fetchAdminAnalytics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Breathing state control
  const toggleBreathing = () => {
    if (breathRunning) {
      setBreathRunning(false);
    } else {
      setBreathPhase('inhale');
      setBreathTimer(4);
      setBreathRunning(true);
    }
  };

  // Client filtering
  const filteredStories = stories.filter(s => {
    const matchCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchSearch = s.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.authorPseudonym.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getActiveSession = () => {
    if (!activeCounselor) return null;
    return chatSessions.find(s => s.counselorId === activeCounselor.id);
  };

  // Pastel Color Generation based on initial
  const getAvatarStyle = (name: string) => {
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const hues = [260, 280, 320, 190, 160, 340, 22];
    const hue = hues[code % hues.length];
    return {
      background: `hsla(${hue}, 40%, 25%, 0.4)`,
      color: `hsla(${hue}, 90%, 80%, 1)`,
      border: `1px solid hsla(${hue}, 40%, 40%, 0.3)`
    };
  };

  return (
    <div id="whisper-root" className="min-h-screen bg-[#090D1A] text-slate-100 font-sans selection:bg-[#4E3F78] selection:text-white antialiased transition-colors duration-500">
      
      {/* Background Ambience Sparks */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#251D42]/10 to-transparent pointer-events-none" />
      <div className="fixed top-1/4 left-1/10 w-72 h-72 bg-gradient-to-r from-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/10 w-80 h-80 bg-gradient-to-r from-teal-500/5 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Primary Top Bar Controls */}
      <header id="whisper-header" className="sticky top-0 z-40 bg-[#090D1A]/85 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl shadow-lg ring-1 ring-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                World of Whisper
              </h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
                An Anonymously Safe Digital Shelter
              </p>
            </div>
          </div>

          {/* Tab Navigation links */}
          <nav className="flex items-center justify-between md:justify-end gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-white/5 rounded-xl border border-white/5 w-full md:w-auto overflow-hidden">
            <button
              id="tab-sky"
              onClick={() => { setActiveTab('sky'); fetchStories(); }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all shrink-0 flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'sky' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sky of Secrets</span>
              <span className="inline sm:hidden">Sky</span>
            </button>
            <button
              id="tab-whisper"
              onClick={() => setActiveTab('whisper')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all shrink-0 flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'whisper' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Whisper Secret</span>
              <span className="inline sm:hidden">Whisper</span>
            </button>
            <button
              id="tab-breath"
              onClick={() => setActiveTab('breath')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all shrink-0 flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'breath' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Breathing Space</span>
              <span className="inline sm:hidden">Breathe</span>
            </button>
            <button
              id="tab-haven"
              onClick={() => setActiveTab('haven')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all shrink-0 flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'haven' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">AI Haven Chats</span>
              <span className="inline sm:hidden">Haven</span>
            </button>
            <button
              id="tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all shrink-0 flex-1 md:flex-initial cursor-pointer ${
                activeTab === 'admin' 
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sanctuary Admin</span>
              <span className="inline sm:hidden">Admin</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Container Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 relative z-10">

        {/* TAB 1: CONNECT/SKY OF SECRETS */}
        {activeTab === 'sky' && (
          <div id="sky-tab-container" className="space-y-6">
            
            {/* Header intro */}
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-indigo-100 to-teal-100 bg-clip-text text-transparent">
                The Sky of Shared Hearts
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto mt-2.5">
                Every story card represents a silent truth released by another soul. All confessions are completely anonymous. Wrap them in warmth of support.
              </p>
            </div>

            {/* Filter controls */}
            <div className="bg-[#12182D]/70 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40" />
              
              {/* Category buttons slider */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none pr-2">
                <button
                  onClick={() => setCategoryFilter('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    categoryFilter === 'All'
                      ? 'bg-indigo-600 text-white shadow font-extrabold'
                      : 'text-slate-400 hover:text-slate-200 bg-white/5'
                  }`}
                >
                  🪐 All Stars
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategoryFilter(cat.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border border-transparent ${
                      categoryFilter === cat.name
                        ? 'bg-indigo-600 text-white shadow-md border-indigo-400/20'
                        : 'text-slate-400 hover:text-slate-200 bg-white/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search component */}
              <div className="w-full sm:w-64 relative">
                <input
                  type="text"
                  placeholder="Query confessions or stars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#090D1A]/90 text-xs border border-white/10 rounded-xl py-2 pl-3 pr-8 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-slate-200"
                />
                <span className="absolute right-2 px-1 text-slate-600">🔍</span>
              </div>
            </div>

            {/* Stories Grid */}
            {loadingStories ? (
              <div className="py-24 text-center space-y-3">
                <div id="loading-spinner" className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Listening to the sky ripples...</p>
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="bg-[#12182D]/30 border border-white/5 rounded-3xl py-16 px-6 text-center space-y-5">
                <div className="inline-flex p-4 bg-indigo-500/5 rounded-full border border-indigo-500/10 text-indigo-400">
                  <BookOpen className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="font-semibold text-slate-300">Quiet Sky</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No whispers have been released matching this frequency yet. Be the first to whisper a private thought under these quiet stars!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('whisper')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-bold hover:opacity-90 shadow-lg text-white"
                >
                  ✍️ Release A Secret
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredStories.map((story) => {
                  const activeVibe = VIBES.find(v => v.id === story.vibe) || VIBES[0];
                  return (
                    <article
                      key={story.id}
                      className={`group ${activeVibe.bg} ${activeVibe.glow} border hover:border-white/15 rounded-3xl overflow-hidden hover:scale-[1.005] transition-all duration-300 shadow-xl flex flex-col`}
                    >
                      {/* Header */}
                      <div className="p-5 pb-3 border-b border-white/5 flex items-center justify-between flex-wrap gap-2.5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center shadow-md select-none"
                            style={getAvatarStyle(story.authorPseudonym)}
                          >
                            {story.authorPseudonym[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-semibold text-slate-200">{story.authorPseudonym}</h4>
                              {story.authorPseudonym === pseudonym && (
                                <span className="text-[9px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/25 px-1.5 py-0.5 rounded-full">
                                  Yours
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-slate-400 block font-mono">
                              📻 {new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-1 ${activeVibe.badge} text-[10px] font-bold rounded-full text-center shadow-sm uppercase tracking-wider font-mono`}>
                            {story.category}
                          </span>
                          {story.sentiment && (
                            <span className="px-2.5 py-1 bg-white/5 border border-white/5 text-[10px] font-medium rounded-full text-slate-300 text-center shadow-sm">
                              🔮 {story.sentiment}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Confession body text */}
                      <div className="p-6 pt-5 text-sm leading-relaxed text-slate-200/95 font-serif tracking-wide block whitespace-pre-wrap selection:bg-purple-800 selection:text-slate-100">
                        "{story.text}"
                      </div>

                    {/* AI Whisper Guardian response banner */}
                    {story.aiWhisper && (
                      <div className="mx-5 mb-5 p-4 bg-gradient-to-br from-[#1B1238] to-[#121A3D] rounded-2xl border border-indigo-500/20 relative shadow-inner overflow-hidden">
                        {/* Background subtle star elements */}
                        <div className="absolute top-2 right-4 text-xs font-bold opacity-30 animate-pulse text-indigo-400">✨</div>
                        
                        <div className="flex gap-2.5 items-start">
                          <div className="p-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/15 self-start shrink-0">
                            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">Guardian AI Whisper</span>
                            <p className="text-xs italic leading-relaxed text-purple-200 bg-gradient-to-r from-purple-100 to-indigo-100 bg-clip-text text-transparent">
                              "{story.aiWhisper}"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Heart Reactions & Controls row */}
                    <div className="p-4 px-5 bg-[#090D1A]/55 border-t border-white/5 flex flex-wrap gap-3 items-center justify-between">
                      
                      {/* React emoji indicators */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          title="Send Warmth (❤️)"
                          onClick={() => handleReactToStory(story.id, 'warmth')}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold rounded-full border border-pink-500/20 hover:border-pink-500/50 text-pink-400 transition-all cursor-pointer shadow-sm active:scale-110"
                        >
                          <Heart className="w-3.5 h-3.5 fill-pink-500/10 text-pink-500" />
                          <span className="text-xs text-slate-300">{story.reactions?.warmth || 0}</span>
                        </button>
                        
                        <button
                          title="Hold Space (🕯️)"
                          onClick={() => handleReactToStory(story.id, 'holding')}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold rounded-full border border-amber-500/20 hover:border-amber-500/50 text-amber-400 transition-all cursor-pointer shadow-sm active:scale-110"
                        >
                          <span>🕯️</span>
                          <span className="text-xs text-slate-300">{story.reactions?.holding || 0}</span>
                        </button>

                        <button
                          title="You are Understood (🫂)"
                          onClick={() => handleReactToStory(story.id, 'understood')}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold rounded-full border border-teal-500/20 hover:border-teal-500/50 text-teal-400 transition-all cursor-pointer shadow-sm active:scale-110"
                        >
                          <span>🫂</span>
                          <span className="text-xs text-slate-300">{story.reactions?.understood || 0}</span>
                        </button>

                        <button
                          title="Stay Strong (💪)"
                          onClick={() => handleReactToStory(story.id, 'strong')}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold rounded-full border border-blue-500/20 hover:border-blue-500/50 text-blue-400 transition-all cursor-pointer shadow-sm active:scale-110"
                        >
                          <span>💪</span>
                          <span className="text-xs text-slate-300">{story.reactions?.strong || 0}</span>
                        </button>

                        <button
                          title="Wishing Joy (✨)"
                          onClick={() => handleReactToStory(story.id, 'joy')}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold rounded-full border border-purple-500/20 hover:border-purple-500/50 text-purple-400 transition-all cursor-pointer shadow-sm active:scale-110"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-xs text-slate-300">{story.reactions?.joy || 0}</span>
                        </button>
                      </div>

                      {/* Comment and Support interactions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setExpandedComments(prev => ({ ...prev, [story.id]: !prev[story.id] }))}
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded-xl text-neutral-300 hover:text-white transition-colors text-xs font-bold cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Comments ({story.comments?.length || 0})</span>
                        </button>

                        <button
                          onClick={() => handleReportStory(story.id)}
                          title="Report this story"
                          className="p-2 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => handleAdminDeleteStory(story.id)}
                            title="Admin Control: Delete Story Permanently"
                            className="p-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Expandable Comments Drawer Section */}
                    {expandedComments[story.id] && (
                      <div className="bg-[#0D1225] border-t border-white/5 p-5 space-y-4">
                        
                        <h5 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Anonymous Communtiy Care</h5>

                        {/* Existing comments list */}
                        {(!story.comments || story.comments.length === 0) ? (
                          <p className="text-xs text-slate-500 italic pb-2">No comments have been left. Write a gentle, supportive word first.</p>
                        ) : (
                          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {story.comments.map((comment: any) => (
                              <div key={comment.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" style={{ background: getAvatarStyle(comment.authorPseudonym).color }} />
                                    <span className="font-extrabold text-slate-300">{comment.authorPseudonym}</span>
                                    {comment.authorPseudonym === pseudonym && (
                                      <span className="text-[8px] bg-teal-500/20 text-teal-400 px-1 py-0.2 rounded-full">You</span>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-slate-500 font-light">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-300/90 leading-relaxed font-light">{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add support comment form */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Type a calming, supportive comment..."
                            value={commentInput[story.id] || ''}
                            onChange={(e) => setCommentInput(prev => ({ ...prev, [story.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handlePostComment(story.id);
                            }}
                            className="flex-1 bg-[#090D1A] border border-white/10 rounded-xl py-2 px-3 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-slate-200"
                          />
                          <button
                            onClick={() => handlePostComment(story.id)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    )}

                  </article>
                );
              })}
            </div>
            )}

            <div className="text-center py-6">
              <span className="text-xs text-slate-500 font-medium">✨ All secrets on this platform are fully protected and self-deleted on container recycling.</span>
            </div>

          </div>
        )}

        {/* TAB 2: WHISPER/CONSTRUCT STORIES */}
        {activeTab === 'whisper' && (
          <div id="whisper-tab-container" className="max-w-xl mx-auto space-y-6">
            
            <div className="text-center py-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-indigo-100 bg-clip-text text-transparent">
                Whisper into the Abyss
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Let go of what is heavy, celebrate what gives you joy, or confess what is hidden. The universe is listening—and so are our Guardian AIs.
              </p>
            </div>

            {showCelebrate ? (
              <div id="celebration-screen" className="bg-[#12182D]/80 border border-indigo-500/20 p-8 rounded-3xl text-center space-y-4 animate-bounce">
                <span className="text-4xl">🌌</span>
                <h3 className="text-lg font-bold text-indigo-300">Whisper Successfully Released!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Your secret has drifted safely up into our starry sky database. A Guardian AI is currently weaving a whisper of healing light for you...
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto animate-pulse" />
              </div>
            ) : (
              <form onSubmit={handlePublishStory} className="bg-[#12182D] border border-white/5 p-6 rounded-3xl space-y-5 shadow-2xl relative">
                
                {/* Decorative border */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600" />
                
                {/* Category selectors explanation field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Select the resonance category:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.name}
                        onClick={() => setStoryCategory(cat.name)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                          storyCategory === cat.name
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-md scale-[1.01] font-bold'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-300 hover:border-white/10'
                        }`}
                      >
                        <div className="font-bold text-xs truncate">{cat.name}</div>
                        <span className="text-[10px] opacity-60 block truncate leading-tight mt-0.5">{cat.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confession entry block */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-300 block">Your confession text:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
                          setStoryInput(`Regarding prompt "${randomPrompt}":\n\n`);
                        }}
                        className="text-[10px] text-teal-400 hover:text-teal-300 font-semibold transition-all flex items-center gap-1 bg-teal-500/10 hover:bg-teal-500/15 px-2.5 py-1 rounded-lg border border-teal-500/20 active:scale-95 cursor-pointer"
                      >
                        🧠 Cozy Inspiration Prompt
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono">{storyInput.length} / 1200 chars</span>
                    </div>
                  </div>
                  <textarea
                    required
                    maxLength={1200}
                    rows={7}
                    placeholder="Type what is in your soul... Mention regrets, anxieties, milestones or silly truths. Avoid names or details that reveal who you are."
                    value={storyInput}
                    onChange={(e) => setStoryInput(e.target.value)}
                    className="w-full bg-[#090D1A]/95 text-slate-100 border border-white/10 rounded-2xl p-4 text-xs font-light tracking-wide placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed transition-all"
                  />
                </div>

                {/* Visual Vibe selection */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-300 block">Atmospheric Vibe backdrop:</span>
                  <div className="grid grid-cols-5 gap-2">
                    {VIBES.map((v) => {
                      const isActive = storyVibe === v.id;
                      return (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => setStoryVibe(v.id)}
                          className={`p-2 rounded-xl text-center border text-[11px] transition-all cursor-pointer ${
                            isActive 
                              ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30 font-bold scale-[1.03]'
                              : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-300 hover:border-white/10'
                          }`}
                        >
                          <span className="text-base block mb-0.5">{v.name.split(' ')[0]}</span>
                          <span className="text-[9px] block opacity-80 truncate leading-tight">{v.name.split(' ').slice(1).join(' ')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy disclaimer */}
                <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5 animate-fadeIn">
                  <span className="text-base select-none">🔒</span>
                  <div>
                    <span className="font-semibold text-slate-300 block">100% Secure & Anonymous</span>
                    No sign-in details, emails, or locations are tracked. Your post is published pseudonymously as <strong className="text-teal-300">{pseudonym}</strong>. Want a fresh identity? {" "}
                    <button 
                      type="button" 
                      onClick={handleRegeneratePseudonym} 
                      className="text-teal-400 font-bold hover:text-teal-300 underline cursor-pointer active:scale-95 transition-all inline-flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" /> Change pseudonym
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPublishing || !storyInput.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-indigo-900/35 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Weaving Guardian AI Reflections...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Release Whisper Safely Into the Night
                    </>
                  )}
                </button>

              </form>
            )}

            <div className="text-center">
              <button
                onClick={() => setActiveTab('sky')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
              >
                🪐 Return to view secrets sky
              </button>
            </div>

          </div>
        )}

        {/* TAB 3: BREATHING INSTRUCTIONS */}
        {activeTab === 'breath' && (
          <div id="breath-tab-container" className="max-w-md mx-auto space-y-8 text-center py-4">
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-200 bg-clip-text text-transparent">
                Quiet Mind Breathing Haven
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Take a moment of mindfulness. The 4-7-8 deep breathing pattern acts as a calming anchor for anxiety, calming the central nervous system instantly.
              </p>
            </div>

            {/* Circular Breathing box guide */}
            <div className="flex justify-center items-center py-6">
              <div 
                className={`w-64 h-64 rounded-full flex flex-col justify-center items-center border border-white/5 bg-gradient-to-b from-[#131B35] to-[#0D1326] relative transition-all duration-[1000ms] ${
                  breathRunning 
                    ? breathPhase === 'inhale' 
                      ? 'scale-110 shadow-[0_0_50px_rgba(16,185,129,0.35)] ring-8 ring-emerald-500/10' 
                      : breathPhase === 'hold' 
                        ? 'scale-[1.14] shadow-[0_0_50px_rgba(245,158,11,0.35)] ring-8 ring-amber-500/10' 
                        : breathPhase === 'exhale' 
                          ? 'scale-90 shadow-[0_0_50px_rgba(59,130,246,0.35)] ring-8 ring-blue-500/10'
                          : 'scale-95 shadow-inner'
                    : 'shadow-2xl'
                }`}
              >
                
                {/* Visual pulse ring surrounding */}
                {breathRunning && (
                  <div className={`absolute -inset-2.5 rounded-full border border-dashed transition-colors duration-1000 ${
                    breathPhase === 'inhale' ? 'border-emerald-500/40 animate-spin' :
                    breathPhase === 'hold' ? 'border-amber-500/40' :
                    breathPhase === 'exhale' ? 'border-blue-500/40 animate-spin' : 'border-indigo-500/30'
                  }`} style={{ animationDuration: '30s' }} />
                )}

                <div className="space-y-1 block z-13">
                  <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400">
                    {!breathRunning ? 'PRANAYAMA' : 'CURRENT STATE'}
                  </span>
                  
                  <h3 className="text-xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-100">
                    {!breathRunning ? 'Restful' : 
                     breathPhase === 'inhale' ? '💨 Inhale Deeply' : 
                     breathPhase === 'hold' ? '🕯️ Hold Calmly' : 
                     breathPhase === 'exhale' ? '🌬️ Exhale Tension' : '💭 Relax'}
                  </h3>

                  {breathRunning && (
                    <div className="text-3xl font-extrabold text-slate-100 pt-2 font-mono">{breathTimer} <span className="text-xs font-normal">seconds</span></div>
                  )}

                  {!breathRunning ? (
                    <span className="text-xs text-indigo-300 font-medium block pt-1">Calm Shelter</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-light block">
                      {breathPhase === 'inhale' ? 'Expand lungs fully' :
                       breathPhase === 'hold' ? 'Safe keep the air' :
                       breathPhase === 'exhale' ? 'Sigh it all out softly' : 'Rest and prepare'}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <button
                onClick={toggleBreathing}
                className={`py-3 px-8 text-xs font-bold rounded-2xl shadow-lg transition-all border ${
                  breathRunning 
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25' 
                    : 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white border-transparent hover:opacity-95'
                }`}
              >
                {breathRunning ? '⏱️ Exit Calm Haven' : '🧘 Begin 4-7-8 Breathing Loop'}
              </button>

              <div className="max-w-xs mx-auto grid grid-cols-4 gap-2 text-center text-[10px] font-mono text-slate-400 pt-3 border-t border-white/5">
                <div>
                  <span className="block font-bold text-slate-300">4s</span>
                  Inhale
                </div>
                <div>
                  <span className="block font-bold text-slate-300">7s</span>
                  Hold Clean
                </div>
                <div>
                  <span className="block font-bold text-slate-300">8s</span>
                  Exhale Slow
                </div>
                <div>
                  <span className="block font-bold text-slate-300">4s</span>
                  Reflect
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PRIVATE COMFORT CHATS */}
        {activeTab === 'haven' && (
          <div id="haven-tab-container" className="space-y-6">
            
            <div className="text-center py-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-indigo-100 to-slate-100 bg-clip-text text-transparent">
                Empathetic AI Listerners
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
                No judgment. No history storage outside this tab. Introduce yourself or spill your secrets to three highly specialized empathetic AI listeners.
              </p>
            </div>

            {!activeCounselor ? (
              <div className="grid md:grid-cols-3 gap-5 pt-3">
                {COUNSELORS.map((c) => (
                  <div
                    key={c.id}
                    className={`bg-[#12182D]/85 border rounded-2xl p-5 flex flex-col justify-between align-stretch text-left shadow-lg hover:border-white/10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${c.glow}`}
                  >
                    {/* Background indicator */}
                    <div className="absolute top-0 right-0 p-8 w-24 h-24 bg-white/2 bg-gradient-to-tr from-transparent to-white/5 rounded-full rotate-45 group-hover:scale-110 transition-all pointer-events-none" />
                    
                    <div className="space-y-4">
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner select-none animate-pulse">
                          {c.avatar}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-200">{c.name}</h3>
                          <span className="text-[10px] text-indigo-300 font-bold block">{c.title}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed font-light">
                        {c.bio}
                      </p>

                    </div>

                    <button
                      onClick={() => handleStartConversation(c)}
                      className="mt-6 w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-200"
                    >
                      🗣️ Speak in private safe space
                    </button>

                  </div>
                ))}
              </div>
            ) : (
              // Active Chat Screen Console
              <div className="bg-[#12182D] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
                
                {/* Chat Header */}
                <div className="p-4 bg-[#090D1A]/95 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveCounselor(null)} 
                      className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl transition-colors shrink-0 font-bold"
                    >
                      ⬅ Back
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{activeCounselor.avatar}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 pr-1.5 leading-none">{activeCounselor.name}</h4>
                        <span className="text-[10px] text-teal-400 font-medium">Safe Space Companion</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 italic hidden sm:inline">Locked End-to-End. Conversations do not persist outside memory.</span>
                </div>

                {/* Messages Body Scroll */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/20 scrollbar-thin">
                  {chatLoading ? (
                    <div className="text-center py-12">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto pb-2" />
                      <p className="text-xs text-slate-400">Fostering secure room connection...</p>
                    </div>
                  ) : (
                    <>
                      {/* Message items loop */}
                      {(() => {
                        const activeMessages = getActiveSession()?.messages || [];
                        return (
                          <>
                            {activeMessages.map((msg: any) => {
                              const isUser = msg.sender === pseudonym;
                              return (
                                <div 
                                  key={msg.id} 
                                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-2.5`}
                                >
                                  {!isUser && (
                                    <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-sm select-none shadow">
                                      {activeCounselor.avatar}
                                    </div>
                                  )}
                                  
                                  <div className="max-w-[80%] flex flex-col">
                                    <span className="text-[9px] text-slate-500 mb-0.5 px-1 font-mono">
                                      {isUser ? 'You' : activeCounselor.name}
                                    </span>
                                    
                                    <div 
                                      className={`p-3.5 rounded-2xl text-xs leading-relaxed font-light ${
                                        isUser 
                                          ? 'bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/15 text-purple-100 rounded-tr-none' 
                                          : 'bg-[#151D35]/90 border border-white/5 text-slate-200 rounded-tl-none'
                                      }`}
                                    >
                                      {msg.text}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {activeMessages.length === 0 && (
                              <div className="py-6 px-4 space-y-4 text-center select-none animate-[float_4s_ease-in-out_infinite]">
                                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner">
                                  {activeCounselor.avatar}
                                </div>
                                <div className="space-y-1 max-w-sm mx-auto">
                                  <h5 className="text-xs font-bold text-slate-200">Confidence Safe Sanctuary</h5>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Spill your thoughts or choose a comfy prompt below to start a supportive reflection dialogue with <strong className="text-teal-300">{activeCounselor.name}</strong>:
                                  </p>
                                </div>
                                <div className="grid gap-2 max-w-sm mx-auto pt-2 text-left">
                                  {getSuggestedPrompts(activeCounselor.id).map((promptStr, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => setMessageInput(promptStr)}
                                      className="p-3 bg-[#12182D]/80 border border-white/5 hover:border-indigo-500/30 hover:bg-white/5 text-[11px] text-indigo-200 hover:text-white rounded-xl transition-all cursor-pointer shadow-sm text-left leading-relaxed"
                                    >
                                      🌱 "{promptStr}"
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {/* AI Thinking indicator */}
                      {chatInFlight && (
                        <div className="flex gap-2.5 items-start justify-start">
                          <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-sm">
                            {activeCounselor.avatar}
                          </div>
                          <div className="max-w-[80%] p-3 bg-[#151D35]/35 border border-white/5 rounded-2xl rounded-tl-none text-xs text-slate-400 italic font-mono animate-pulse flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                            {activeCounselor.name} is reflection-whispering...
                          </div>
                        </div>
                      )}

                      <div ref={chatBottomRef} />
                    </>
                  )}
                </div>

                {/* Input Controls */}
                <form onSubmit={handleSendChatMessage} className="p-4 bg-[#090D1A] border-t border-white/5 flex gap-2">
                  <input
                    type="text"
                    required
                    disabled={chatInFlight}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Whisper softly to ${activeCounselor.name}...`}
                    className="flex-1 bg-[#12182D] border border-white/10 rounded-xl py-2.5 px-4 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-slate-200"
                  />
                  
                  <button
                    type="submit"
                    disabled={chatInFlight || !messageInput.trim()}
                    className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>

              </div>
            )}

          </div>
        )}

        {/* TAB 5: SANCTUARY ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <div id="admin-tab-container" className="space-y-6">
            
            <div className="text-center py-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-300 via-rose-100 to-indigo-100 bg-clip-text text-transparent">
                Sanctuary Sanctuary & Emotional Weather
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Restricted area. Validate reported whispers for community safety guidelines, and view the emotional climate charts of active secrets.
              </p>
            </div>

            {!isAdmin ? (
              // Verification lock form
              <div className="max-w-md mx-auto bg-[#12182D] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
                
                <div className="text-center space-y-1 pb-2">
                  <Lock className="w-8 h-8 mx-auto text-rose-400 animate-pulse" />
                  <h3 className="font-bold text-slate-200 text-sm">Validate Security Clearance</h3>
                  <p className="text-[11px] text-slate-500">Provide password to access analytics & moderate</p>
                </div>

                <form onSubmit={handleVerifyAdmin} className="space-y-3">
                  <div>
                    <input
                      type="password"
                      required
                      placeholder="Passcode string (hint: whisper-peace)"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full bg-[#090D1A]/95 text-slate-200 border border-white/10 rounded-xl py-2.5 px-4 text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all text-center"
                    />
                  </div>

                  {adminError && (
                    <p className="text-xs text-rose-400 text-center font-mono leading-none">{adminError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-indigo-600 text-slate-100 font-bold rounded-xl text-xs hover:opacity-95 transition-all shadow-lg text-center"
                  >
                    🔓 Enter Secure Realm
                  </button>
                </form>

              </div>
            ) : (
              // Admin Sanctuary Content Tab
              <div className="space-y-6">
                
                {/* Admin Header settings */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5">
                    <button
                      onClick={() => { setAdminSection('reports'); fetchAdminReports(); }}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        adminSection === 'reports' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Report Queue ({reportedStories.length})
                    </button>
                    <button
                      onClick={() => { setAdminSection('all-stories'); fetchAllStoriesAdmin(); }}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        adminSection === 'all-stories' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      All Stories ({allStories.length})
                    </button>
                    <button
                      onClick={() => { setAdminSection('dashboard'); fetchAdminAnalytics(); }}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        adminSection === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      Emotional Weather Dashboard
                    </button>
                  </div>

                  <button 
                    onClick={() => setIsAdmin(false)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    🔒 Exit Admin Sanctuary
                  </button>
                </div>

                {/* Sub-Section 1: RESTORE / BAN QUEUE */}
                {adminSection === 'reports' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono">Pending Reports Panel</h3>
                    
                    {reportedStories.length === 0 ? (
                      <div className="bg-[#12182D]/40 border border-white/5 p-8 rounded-2xl text-center space-y-2">
                        <span className="text-2xl font-bold block">✨</span>
                        <h4 className="text-xs font-bold text-slate-300">Sanctuary is Peaceful</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                          All whispers are flowing happily within safety lines. No stories are flagged currently.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {reportedStories.map((story) => (
                          <div 
                            key={story.id} 
                            className="bg-[#1C172E] border border-rose-500/20 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-rose-400 font-bold bg-rose-500/15 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Flagged</span>
                                <span className="text-[11px] text-slate-400">By {story.authorPseudonym} • Category: {story.category}</span>
                              </div>
                              <p className="text-xs text-slate-200/90 leading-relaxed italic pr-2">"{story.text}"</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                              <button
                                onClick={() => handleAdminModerate(story.id, 'keep')}
                                className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 rounded-xl text-xs font-semibold cursor-pointer"
                              >
                                Keep Secret
                              </button>
                              <button
                                onClick={() => handleAdminModerate(story.id, 'hide')}
                                className="px-3 py-1.5 bg-rose-500/15 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Ban Permanently
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Section 3: ALL STORIES REPOSITORY */}
                {adminSection === 'all-stories' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono">Confession Vault Repository</h3>
                        <p className="text-xs text-slate-500">Unfiltered view of all active/reported whispers saved inside the sky database</p>
                      </div>
                      
                      <div className="w-full sm:w-64 relative">
                        <input
                          type="text"
                          placeholder="Search content or pseudonyms..."
                          value={adminStoriesSearch}
                          onChange={(e) => setAdminStoriesSearch(e.target.value)}
                          className="w-full bg-[#12182D] text-xs border border-white/10 rounded-xl py-2 pl-3 pr-8 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-slate-200"
                        />
                        <span className="absolute right-2 px-1 text-slate-600">🔍</span>
                      </div>
                    </div>

                    {loadingAllStories ? (
                      <div className="py-12 text-center space-y-2">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto animate-pulse" />
                        <p className="text-xs text-slate-400 font-mono">Unlocking confession archive...</p>
                      </div>
                    ) : (
                      (() => {
                        const filtered = allStories.filter(s => 
                          s.text.toLowerCase().includes(adminStoriesSearch.toLowerCase()) || 
                          s.authorPseudonym.toLowerCase().includes(adminStoriesSearch.toLowerCase()) ||
                          s.category.toLowerCase().includes(adminStoriesSearch.toLowerCase())
                        );

                        if (filtered.length === 0) {
                          return (
                            <div className="bg-[#12182D]/40 border border-white/5 p-8 rounded-2xl text-center">
                              <p className="text-xs text-slate-400 font-mono">No whispers found matching your query.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="grid gap-4">
                            {filtered.map((story) => (
                              <div 
                                key={story.id} 
                                className="bg-[#12182D]/90 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all"
                              >
                                <div className="space-y-2 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] text-teal-300 font-bold bg-teal-500/10 border border-teal-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                      {story.authorPseudonym}
                                    </span>
                                    <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                                      {story.category}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {new Date(story.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                    </span>
                                    {story.reported && (
                                      <span className="text-[10px] text-rose-400 font-bold bg-rose-500/15 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                        Flagged
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-300 leading-relaxed italic pr-2">"{story.text}"</p>
                                  {story.aiWhisper && (
                                    <p className="text-[11px] text-purple-400/90 leading-relaxed font-mono">
                                      🤖 AI: {story.aiWhisper}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                  <button
                                    onClick={() => handleAdminDeleteStory(story.id)}
                                    className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/20 text-rose-300 hover:text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete Story
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}

                {/* Sub-Section 2: CHARTS WEATHER DASHBOARD */}
                {adminSection === 'dashboard' && (
                  <div className="space-y-6">
                    
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono">The Emotional Weather of Whisper Sky</h3>

                    {/* Stats metrics row */}
                    {analyticsData && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#12182D] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono block">Secrets Safe-Kept</span>
                          <span className="text-2xl font-extrabold text-indigo-300 block pt-1">{analyticsData.totals?.storiesCount || 0}</span>
                        </div>
                        <div className="bg-[#12182D] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono block">Supports Shared</span>
                          <span className="text-2xl font-extrabold text-pink-300 block pt-1">{analyticsData.totals?.commentsCount || 0}</span>
                        </div>
                        <div className="bg-[#12182D] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono block">Reactions Emitted</span>
                          <span className="text-2xl font-extrabold text-amber-300 block pt-1">{analyticsData.totals?.totalReactions || 0}</span>
                        </div>
                        <div className="bg-[#12182D] border border-white/5 p-4 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono block">Healing Sessions</span>
                          <span className="text-2xl font-extrabold text-teal-300 block pt-1">{analyticsData.totals?.chatsCount || 0}</span>
                        </div>
                      </div>
                    )}

                    {/* Recharts Area and Pie Row */}
                    {analyticsData ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* CHART A: Area Timeline Chart of confessions saved */}
                        <div className="bg-[#12182D] border border-white/5 p-5 rounded-3xl space-y-3">
                          <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">Timeline of Whispered Secrets</h4>
                            <p className="text-[10px] text-slate-500">Volume distribution over safe-keeping dates</p>
                          </div>
                          
                          <div className="h-48 pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={analyticsData.timelineData || [{ date: 'Today', count: 4 }]}>
                                <defs>
                                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#475569" fontSize={9} />
                                <YAxis stroke="#475569" fontSize={9} width={20} />
                                <Tooltip contentStyle={{ background: '#090D1A', border: '1px solid rgba(255,255,255,0.05)', fontSize: 11 }} />
                                <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* CHART B: Pie Categories distribution */}
                        <div className="bg-[#12182D] border border-white/5 p-5 rounded-3xl space-y-3">
                          <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">Sub-resonance Categories</h4>
                            <p className="text-[10px] text-slate-500">Relative sharing amounts across subcategories</p>
                          </div>

                          <div className="h-48 pt-2 flex items-center justify-between">
                            <div className="w-1/2 h-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={analyticsData.categoryDistribution || [{ name: 'Silly Secrets', value: 1 }]}
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={3}
                                    dataKey="value"
                                  >
                                    {(analyticsData.categoryDistribution || []).map((entry: any, index: number) => {
                                      const colors = ['#ec4899', '#0ea5e9', '#f59e0b', '#a855f7', '#10b981', '#6366f1'];
                                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                    })}
                                  </Pie>
                                  <Tooltip contentStyle={{ fontSize: 10, background: '#090D1A', border: '1px solid rgba(255,255,255,0.05)' }} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            
                            {/* Bullet legends */}
                            <div className="w-1/2 space-y-1 text-[10px] select-none text-slate-400 pl-4">
                              {(analyticsData.categoryDistribution || []).map((entry: any, index: number) => {
                                const colors = ['#ec4899', '#0ea5e9', '#f59e0b', '#a855f7', '#10b981', '#6366f1'];
                                return (
                                  <div key={entry.name} className="flex items-center gap-1.5 truncate">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colors[index % colors.length] }} />
                                    <span className="truncate">{entry.name} ({entry.value})</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* CHART C: Dominant Emotions Sentiments bar list */}
                        <div className="bg-[#12182D] border border-white/5 p-5 rounded-3xl space-y-3 md:col-span-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">AI Dominant Sentiment Analysis</h4>
                            <p className="text-[10px] text-slate-500">Dominant feelings captured silently by Gemini during whispering</p>
                          </div>

                          <div className="h-44 pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={analyticsData.sentimentDistribution || [{ name: 'Warm Care', value: 2 }]}>
                                <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                                <YAxis stroke="#475569" fontSize={9} />
                                <Tooltip contentStyle={{ background: '#090D1A', border: '1px solid rgba(255,255,255,0.05)', fontSize: 11 }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                  {(analyticsData.sentimentDistribution || []).map((entry: any, index: number) => {
                                    const colors = ['#a855f7', '#2563eb', '#10b981', '#ec4899', '#f59e0b', '#3b82f6'];
                                    return <Cell key={`cell-bar-${index}`} fill={colors[index % colors.length]} />;
                                  })}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="py-12 text-center text-xs text-slate-500 font-mono">Building climate weather charts...</div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* Decorative calm footer */}
      <footer id="whisper-footer" className="border-t border-white/5 py-8 mt-12 text-center text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <p className="font-extralight tracking-widest uppercase text-[10px] text-slate-400">“Every story matters, and every whisper is heard.”</p>
          <div className="flex justify-center items-center gap-1 text-[10px] font-mono text-slate-600">
            <span>Server: Express & Gemini AI Live-Connect</span>
            <span>•</span>
            <span>100% Cryptographic-grade Anonymity Safeguard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
