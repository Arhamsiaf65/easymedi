import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import appointmentRouter from './routes/appointmentRouter.js';
import doctorsRouter from './routes/doctorsRouter.js';
import connectDb from './config/mogodb.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import nlp from 'compromise';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://easymedi.vercel.app',
      'https://easymedi-admin.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const port = process.env.PORT || 4000;

// Connect to Database
connectDb().catch((error) => {
  console.error('Database connection failed:', error.message);
  process.exit(1); // Exit the process if DB connection fails
});

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size to prevent abuse

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://easymedi.vercel.app',
  'https://easymedi-admin.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials like cookies or headers
}));

// Routes
app.use('/appointments', appointmentRouter);
app.use('/doctors', doctorsRouter);

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Define intents and responses
// Define intents and responses
const responses = [
  {
    intent: 'book appointment',
    reply: 'Sure! Let me help you with booking an appointment. Please provide your name, preferred date, and the type of doctor you want to consult.',
  },
  {
    intent: 'find doctor',
    reply: 'I can help you find available doctors. Are you looking for a general physician, a specialist (e.g., cardiologist, dermatologist), or something else?',
  },
  {
    intent: 'symptom description',
    reply: 'If you describe your symptoms, I can suggest possible causes or recommend the type of doctor you should consult.',
  },
  {
    intent: 'medicine recommendation',
    reply: 'For minor symptoms like headaches or colds, over-the-counter medications such as ibuprofen or paracetamol may help. However, I recommend consulting a doctor before taking any medication.',
  },
  {
    intent: 'emergency',
    reply: 'In case of a medical emergency, please dial your local emergency number or visit the nearest hospital immediately.',
  },
  {
    intent: 'help',
    reply: 'Here are some things you can ask me:\n- Book an appointment\n- Find a doctor\n- Describe symptoms\n- Ask about medicines\n- Inquire about fever, cold, or headaches\n- Emergency instructions\nHow can I assist you today?',
  },
  {
    intent: 'fever',
    reply: 'Fever can be caused by various factors like infections, inflammation, or heat exposure. If your fever persists, I recommend consulting a doctor. Drink plenty of fluids and rest.',
  },
  {
    intent: 'headache',
    reply: 'Headaches are common and can be caused by stress, dehydration, or tension. Over-the-counter painkillers like ibuprofen or paracetamol can help, but if the headache is severe or lasts for a long time, please see a doctor.',
  },
  {
    intent: 'cold',
    reply: 'For a common cold, rest and drinking warm fluids can help. If symptoms worsen or you experience difficulty breathing, you should see a healthcare professional.',
  },
  {
    intent: 'healthy lifestyle',
    reply: 'To maintain a healthy lifestyle, make sure to eat a balanced diet, exercise regularly, get enough sleep, and stay hydrated. Avoid smoking and limit alcohol intake.',
  },
  {
    intent: 'vaccination',
    reply: 'Vaccination is essential for protecting yourself against certain diseases. You can schedule an appointment with your doctor for necessary vaccines based on your age, health condition, and travel plans.',
  },
  {
    intent: 'mental health',
    reply: 'Mental health is just as important as physical health. If you are feeling stressed, anxious, or depressed, its a good idea to speak with a mental health professional who can help you through these emotions.',
  },
  {
    intent: 'diet advice',
    reply: 'A balanced diet includes a variety of fruits, vegetables, whole grains, and lean proteins. Avoid too much processed food, sugar, and salt. If you need a specific diet plan, a nutritionist can help.',
  },
  {
    intent: 'sports injuries',
    reply: 'For sports injuries like sprains or strains, apply ice to the affected area and rest. If the pain is severe, or you have difficulty moving the injured part, consult a doctor immediately.',
  },
  {
    intent: 'pregnancy',
    reply: 'If you are pregnant, its important to attend regular check-ups with your gynecologist to ensure both your health and the health of the baby. Eat a nutritious diet, stay active, and avoid harmful substances.',
  },
  {
    intent: 'surgery consultation',
    reply: 'If you need to consult about surgery, I can help you find a surgeon or a medical specialist. Please provide more details about the surgery you are considering.',
  },
];




const determineIntent = (message) => {
  const doc = nlp(message);

  // Check for keywords or entities in the message to classify intent
  if (doc.has('book') && doc.has('appointment')) return 'book appointment';
  if (doc.has('find') && doc.has('doctor')) return 'find doctor';
  if (doc.has('symptom') || doc.has('describe symptoms')) return 'symptom description';
  if (doc.has('medicine') || doc.has('medication')) return 'medicine recommendation';
  if (doc.has('emergency')) return 'emergency';
  if (doc.has('help') || doc.has('command')) return 'help';
  if (doc.has('fever')) return 'fever';
  if (doc.has('headache')) return 'headache';
  if (doc.has('cold')) return 'cold';
  if (doc.has('healthy') && doc.has('lifestyle')) return 'healthy lifestyle';
  if (doc.has('vaccination')) return 'vaccination';
  if (doc.has('mental health')) return 'mental health';
  if (doc.has('diet')) return 'diet advice';
  if (doc.has('sports') && doc.has('injuries')) return 'sports injuries';
  if (doc.has('pregnancy')) return 'pregnancy';
  if (doc.has('surgery')) return 'surgery consultation';

  return 'unknown';
};


// Socket.IO Handlers
io.on('connection', (socket) => {
  console.log('A user connected to the chatbot.');

  socket.on('message', (msg) => {
    console.log('User: ', msg);

    // Normalize user message to lowercase for better matching
    const lowerCaseMsg = msg.toLowerCase();

    // Determine intent using advanced NLP
    const intent = determineIntent(msg);
    
    let response = 'Sorry! I am unable to understand your question. I am here to assist with booking appointments, finding doctors, and answering basic medical queries. How can I help you today?';
    
    // Find the corresponding response based on intent
    const foundResponse = responses.find((responseObj) => responseObj.intent === intent);
    if (foundResponse) {
      response = foundResponse.reply;
    }
    
    socket.emit('reply', response);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from the chatbot.');
  });
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
