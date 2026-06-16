import express from 'express';
import { 
  readDb, 
  writeDb, 
  generateAIWhisper, 
  generateAICounselorResponse,
  Story,
  ChatSession,
  Message
} from './api.js';

const app = express();

// Increase JSON size limit for safety
app.use(express.json({ limit: '10mb' }));

// Helper to generate a unique random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Enable basic CORS/headers for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// GET /api/stories - Fetch all safe, non-reported stories sorted by date
app.get('/api/stories', (req, res) => {
  try {
    const db = readDb();
    // Exclude reported stories from general view
    const visibleStories = db.stories.filter(s => !s.reported);
    // Sort descending by createdAt
    visibleStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(visibleStories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stories - Create a new anonymous confession
app.post('/api/stories', async (req, res) => {
  try {
    const { text, category, authorPseudonym, vibe } = req.body;
    if (!text || !category || !authorPseudonym) {
      return res.status(400).json({ error: 'Missing required story details' });
    }

    const { whisper, sentiment } = await generateAIWhisper(text);

    const newStory: Story & { vibe?: string } = {
      id: generateId(),
      text,
      category,
      authorPseudonym,
      createdAt: new Date().toISOString(),
      reactions: { warmth: 0, holding: 0, understood: 0, strong: 0, joy: 0 },
      comments: [],
      aiWhisper: whisper,
      sentiment: sentiment,
      reported: false,
      vibe: vibe || 'cosmic',
    };

    const db = readDb();
    db.stories.push(newStory);
    writeDb(db);

    res.status(201).json(newStory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stories/:id/react - React with an emoji (warmth, holding, etc.)
app.post('/api/stories/:id/react', (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body; // 'warmth' | 'holding' | 'understood' | 'strong' | 'joy'

    const validReactions = ['warmth', 'holding', 'understood', 'strong', 'joy'];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    const db = readDb();
    const story = db.stories.find(s => s.id === id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Initialize if needed
    if (!story.reactions) {
      story.reactions = { warmth: 0, holding: 0, understood: 0, strong: 0, joy: 0 };
    }

    story.reactions[reactionType as keyof typeof story.reactions] += 1;
    writeDb(db);

    res.json(story.reactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stories/:id/comment - Append support comment
app.post('/api/stories/:id/comment', (req, res) => {
  try {
    const { id } = req.params;
    const { text, authorPseudonym } = req.body;

    if (!text || !authorPseudonym) {
      return res.status(400).json({ error: 'Comment text and pseudonym are required' });
    }

    const db = readDb();
    const story = db.stories.find(s => s.id === id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (!story.comments) {
      story.comments = [];
    }

    const newComment = {
      id: generateId(),
      text,
      authorPseudonym,
      createdAt: new Date().toISOString(),
    };

    story.comments.push(newComment);
    writeDb(db);

    res.status(201).json(newComment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stories/:id/report - Flag inappropriate story
app.post('/api/stories/:id/report', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const story = db.stories.find(s => s.id === id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.reported = true;
    writeDb(db);

    res.json({ message: 'Story reported successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chats - Fetch all safe-held chat sessions for a specific user pseudonym
app.get('/api/chats', (req, res) => {
  try {
    const { pseudonym } = req.query;
    if (!pseudonym) {
      return res.status(400).json({ error: 'User pseudonym required' });
    }

    const db = readDb();
    const sessions = db.chats.filter(c => c.userPseudonym === pseudonym);
    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chats - Start a new chat session with an AI Listener (Hope, Ember, Willow)
app.post('/api/chats', (req, res) => {
  try {
    const { userPseudonym, counselorId, counselorName } = req.body;
    if (!userPseudonym || !counselorId || !counselorName) {
      return res.status(400).json({ error: 'Missing chat metadata' });
    }

    const db = readDb();

    // Check if session already exists
    let existing = db.chats.find(
      c => c.userPseudonym === userPseudonym && c.counselorId === counselorId
    );

    if (existing) {
      return res.json(existing);
    }

    // Preseed a welcoming message from the counselor
    let welcomeText = "";
    if (counselorId === 'hope') {
      welcomeText = "Hello dear soul. I am Hope, and I'm here to listen. Whatever is heavy in your heart today, know that this is a safe, non-judgmental space. Tell me what's on your mind?";
    } else if (counselorId === 'ember') {
      welcomeText = "Hey there! I am Ember! 🌟 I'm here to support you and cheer you on. Ready to make a clean breast of your heavy loads and find your brave spark? Let's talk!";
    } else {
      welcomeText = "Welcome to the quiet shelter. I am Willow. Take a slow, grounding breath with me. Let's explore your feelings together with serenity.";
    }

    const welcomeMessage: Message = {
      id: 'welcome-' + counselorId,
      sender: counselorName,
      text: welcomeText,
      createdAt: new Date().toISOString(),
    };

    const newChat: ChatSession = {
      id: generateId(),
      userPseudonym,
      counselorId,
      counselorName,
      messages: [welcomeMessage],
      updatedAt: new Date().toISOString(),
    };

    db.chats.push(newChat);
    writeDb(db);

    res.status(201).json(newChat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chats/:id/messages - Send a message and generate an AI response
app.post('/api/chats/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, text } = req.body;

    if (!sender || !text) {
      return res.status(400).json({ error: 'Sender and text are required' });
    }

    const db = readDb();
    const chat = db.chats.find(c => c.id === id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const userMsg: Message = {
      id: generateId(),
      sender,
      text,
      createdAt: new Date().toISOString(),
    };
    chat.messages.push(userMsg);

    // Format chat history for Gemini API
    // Gemini chat API structures messages in 'user' vs 'model' roles
    const history = chat.messages
      .slice(1, -1) // Exclude welcome message and latest user message to build history
      .map(msg => ({
        role: msg.sender === chat.counselorName ? 'model' as const : 'user' as const,
        parts: [{ text: msg.text }],
      }));

    // Trigger AI counselor responding
    const aiRespText = await generateAICounselorResponse(
      chat.counselorId,
      history,
      text
    );

    const counselorMsg: Message = {
      id: generateId(),
      sender: chat.counselorName,
      text: aiRespText,
      createdAt: new Date().toISOString(),
    };
    chat.messages.push(counselorMsg);
    chat.updatedAt = new Date().toISOString();

    writeDb(db);

    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/reports - Fetch all reported stories for moderation
app.get('/api/admin/reports', (req, res) => {
  try {
    const db = readDb();
    const reported = db.stories.filter(s => s.reported);
    res.json(reported);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stories - Fetch all stories (reported and active) for moderation
app.get('/api/admin/stories', (req, res) => {
  try {
    const db = readDb();
    const all = [...db.stories];
    // Sort descending by createdAt
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(all);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/stories/:id/delete - Delete any story permanently (by admin)
app.post('/api/admin/stories/:id/delete', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const originalLength = db.stories.length;
    db.stories = db.stories.filter(s => s.id !== id);

    if (db.stories.length === originalLength) {
      return res.status(404).json({ error: 'Story not found' });
    }

    writeDb(db);
    res.json({ message: 'Story deleted permanently by admin' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/stories/:id/hide - Permanently ban/delete a reported story
app.post('/api/admin/stories/:id/hide', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const originalLength = db.stories.length;
    db.stories = db.stories.filter(s => s.id !== id);

    if (db.stories.length === originalLength) {
      return res.status(404).json({ error: 'Story not found' });
    }

    writeDb(db);
    res.json({ message: 'Story permanently hidden' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/stories/:id/keep - Dismiss report flag
app.post('/api/admin/stories/:id/keep', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const story = db.stories.find(s => s.id === id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.reported = false;
    writeDb(db);
    res.json({ message: 'Story restored safely' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics - Dynamic analytics data for D3/Recharts dashboards
app.get('/api/analytics', (req, res) => {
  try {
    const db = readDb();
    const stories = db.stories;

    const totals = {
      storiesCount: stories.length,
      commentsCount: stories.reduce((sum, s) => sum + (s.comments?.length || 0), 0),
      totalReactions: stories.reduce((sum, s) => {
        const r = s.reactions || { warmth: 0, holding: 0, understood: 0, strong: 0, joy: 0 };
        return sum + r.warmth + r.holding + r.understood + r.strong + r.joy;
      }, 0),
      chatsCount: db.chats.length,
    };

    // Category distribution
    const catMap: Record<string, number> = {};
    stories.forEach(s => {
      catMap[s.category] = (catMap[s.category] || 0) + 1;
    });
    const categoryDistribution = Object.keys(catMap).map(key => ({
      name: key,
      value: catMap[key]
    }));

    // Sentiment tag mapping
    const sentMap: Record<string, number> = {};
    stories.forEach(s => {
      const sLabel = s.sentiment || "Soft Reflection";
      sentMap[sLabel] = (sentMap[sLabel] || 0) + 1;
    });
    const sentimentDistribution = Object.entries(sentMap)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 8); // Keep top 8

    // Timeline data (group by date string YYYY-MM-DD)
    const timelineMap: Record<string, number> = {};
    stories.forEach(s => {
      const dateStr = s.createdAt.split('T')[0];
      timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;
    });
    const timelineData = Object.keys(timelineMap)
      .sort()
      .map(date => ({
        date,
        count: timelineMap[date]
      }));

    res.json({
      totals,
      categoryDistribution,
      sentimentDistribution,
      timelineData
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
