import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Lazy-initialized Gemini client to prevent crashes if key is omitted
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Interfaces
export interface Comment {
  id: string;
  text: string;
  authorPseudonym: string;
  createdAt: string;
}

export interface Reactions {
  warmth: number;    // ❤️ Sending Warmth
  holding: number;   // 🕯️ Holding Space
  understood: number;// 🫂 You are Understood
  strong: number;    // 💪 Stay Strong
  joy: number;       // ✨ Wishing Joy
}

export interface Story {
  id: string;
  text: string;
  category: string;
  authorPseudonym: string;
  createdAt: string;
  reactions: Reactions;
  comments: Comment[];
  aiWhisper?: string;
  sentiment?: string;
  reported: boolean;
  isCustomAIWhisped?: boolean;
  vibe?: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userPseudonym: string;
  counselorId: string; // 'hope' | 'ember' | 'willow'
  counselorName: string;
  messages: Message[];
  updatedAt: string;
}

interface DatabaseSchema {
  stories: Story[];
  chats: ChatSession[];
}

const DB_FILE = path.resolve(process.cwd(), 'src/server/db_store.json');

// Ensure database file exists with elegant pre-seeded content
function initializeDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      JSON.parse(content);
      return;
    } catch {
      // If corrupted, re-initialize
    }
  }

  const defaultData: DatabaseSchema = {
    stories: [
      {
        id: 'seed-1',
        text: "I still look for your old car in every parking lot, even though it's been three years. I don't want us back, but I just hope you are safe and happy somewhere out there.",
        category: "Love & Belonging",
        authorPseudonym: "Silent Horizon",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        reactions: { warmth: 18, holding: 12, understood: 14, strong: 5, joy: 2 },
        comments: [
          {
            id: 'c-1',
            text: "This beautiful, quiet kind of care is so pure. Thank you for sharing this whisper.",
            authorPseudonym: "Gentle Leaf",
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          }
        ],
        aiWhisper: "Holding an unspoken fondness shows the beauty of human connection. It's perfectly okay to look, and even more beautiful to wish them well from afar.",
        sentiment: "Melancholic Care",
        reported: false,
      },
      {
        id: 'seed-2',
        text: "Sometimes the weight of trying to achieve everyone's expectations is like a mountain on my shoulders. Today, I just locked myself in the rest room and took 5 deep breaths just to survive.",
        category: "Anxiety & Stress",
        authorPseudonym: "Solitary Willow",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        reactions: { warmth: 25, holding: 20, understood: 32, strong: 29, joy: 0 },
        comments: [
          {
            id: 'c-2',
            text: "You are not alone in this mountain. Those 5 deep breaths were a giant victory today.",
            authorPseudonym: "Warm Embers",
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          }
        ],
        aiWhisper: "Please remember that you do not have to carry the weight of other people's expectations. Your worth lies in your breath and your spirit, not in their demands.",
        sentiment: "Anxious Burden",
        reported: false,
      },
      {
        id: 'seed-3',
        text: "For the last five months, I've been silently working on codings and learning designs late at night. Today I got my first freelance client! No one in my physical circle knows yet, but I wanted to whisper it here.",
        category: "Motivation & Joy",
        authorPseudonym: "Midnight Firefly",
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        reactions: { warmth: 45, holding: 2, understood: 8, strong: 38, joy: 52 },
        comments: [],
        aiWhisper: "Your quiet nights are blooming into bright horizons! What a beautiful reward for your silent, consistent dedication. This sky is glowing for your triumph.",
        sentiment: "Quiet Triumph",
        reported: false,
      },
      {
        id: 'seed-4',
        text: "I kept the last chocolate piece that was meant for my little brother. I feel silly for regretting it so much, but it represents how selfish I feel sometimes.",
        category: "Silly Secrets",
        authorPseudonym: "Playful Cloud",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        reactions: { warmth: 5, holding: 3, understood: 12, strong: 1, joy: 14 },
        comments: [
          {
            id: 'c-3',
            text: "Buy him two tomorrow, and eat one together! 🍫 It's a sweet kind of self-awareness.",
            authorPseudonym: "Compassionate Star",
            createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          }
        ],
        aiWhisper: "Silly secrets are the anchors of our humanity. The fact that your heart cares about a chocolate piece tells me you are full of warmth and love.",
        sentiment: "Playful Guilt",
        reported: false,
      }
    ],
    chats: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
}

// Read Db
export function readDb(): DatabaseSchema {
  initializeDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { stories: [], chats: [] };
  }
}

// Write Db
export function writeDb(data: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Trigger Gemini API to analyze a confession and return a gentle AI "Whisper" and sentiment analysis
export async function generateAIWhisper(text: string): Promise<{ whisper: string; sentiment: string }> {
  const ai = getGemini();
  if (!ai) {
    // Return mock fallback when API key is missing
    return {
      whisper: "Your voice has been safely heard in this night. May you feel the gentle warmth of this silent space.",
      sentiment: "Gentle Reflection",
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `You are 'The Sanctuary Whisperer', an empathetic virtual companion of emotional healing and mental comfort. 
The user has anonymously whispered this private confession:
"${text}"

Your task:
1. Provide a beautiful, soothing, deeply validating and warm human-like response ("whisper") of exactly 1 or 2 soft, reassuring sentences. Refrain from cliches, structured lists, or preachy language. Speak directly to their soul.
2. Provide a 2-3 word labeling of the mood/sentiment (e.g., "Muted Sadness", "Quiet Hope", "Overwhelmed Mind", "Hidden Longing").

Return your response in strict validity JSON format matching the schema:
{
  "whisper": "reassuring sentences",
  "sentiment": "mood label text"
}`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a gentle, supportive, therapeutic soul who safe-keeps secrets and whispers calming, compassionate light.",
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      whisper: parsed.whisper || "Your heart has been safely heard. Take a slow, peaceful breath.",
      sentiment: parsed.sentiment || "Sincere Emotion",
    };
  } catch (error) {
    console.error("Gemini Whisper Error:", error);
    return {
      whisper: "Your secret is safe-kept here under the stars. Breathe in peace, release the heavy load.",
      sentiment: "Calm Refuge",
    };
  }
}

// Trigger Gemini API to generate an emotional therapist counseling chat response
export async function generateAICounselorResponse(
  counselorId: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  latestUserText: string
): Promise<string> {
  const ai = getGemini();

  let counselorPrompt = "";
  if (counselorId === 'hope') {
    counselorPrompt = "You are 'Hope', an empathetic companion. You are gentle, validating, warm, and search for soft silver linings. You ask comforting questions to gently guide users toward peaceful self-reflection. Keep your answers brief (1-3 sentences) and highly organic.";
  } else if (counselorId === 'ember') {
    counselorPrompt = "You are 'Ember', a cozy cheerleader. You are warm, positive, uplifting, and help users find their spark of inner courage and strength. You celebrate the courage to open up! Keep answers brief (1-3 sentences) with cozy, motivational energy.";
  } else {
    counselorPrompt = "You are 'Willow', a quiet wise guide. You are deep, calm, serene, and patient. You encourage mindfulness, offer tranquil philosophical perspectives, and guide the user in gentle grounding practices. Keep answers brief (1-3 sentences) and serene.";
  }

  if (!ai) {
    // Elegant offline fallback chats
    const fallbacks: Record<string, string[]> = {
      hope: [
        "That sounds heavy and so very valid. How does it feel to say that out loud?",
        "I am here, listening. Every word of yours is safe with me. Do you feel this often?",
        "It takes so much strength to witness your own vulnerabilities. I'm sitting here with you."
      ],
      ember: [
        "Heck yes to you sharing this! 🌟 It takes courage to say what's on your mind. You are doing great!",
        "You are stronger than this heavy feeling, I promise. How can we take one little cozy step forward?",
        "That is a massive realization. I am holding up a lantern for you. Keep sparkling!"
      ],
      willow: [
        "Let us take a slow breath together. Inhale, exhale. Feel gravity supporting you right now.",
        "Your thoughts are like clouds drifting in a vast sky. Let them pass without judgment.",
        "Wisdom rests in allowing yourself to simply feel without needing to immediately fix it."
      ]
    };
    const list = fallbacks[counselorId] || fallbacks.hope;
    return list[Math.floor(Math.random() * list.length)];
  }

  try {
    const formattedHistory = history.map(h => ({
      role: h.role,
      parts: h.parts.map(p => ({ text: p.text }))
    }));

    // Add instructions as first model turn or system instruction
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: latestUserText }] }
      ] as any,
      config: {
        systemInstruction: counselorPrompt,
        temperature: 0.8,
      }
    });

    return response.text || "I am listening closely. Tell me more.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am here with you in the quiet space, listening. Take all the time you need.";
  }
}
