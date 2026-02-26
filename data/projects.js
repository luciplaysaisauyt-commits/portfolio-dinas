// Portfolio project data
// Order is used for prev and next navigation on case study pages
const order = [
  'unnie-box',
  'learnlogicify',
  'gemini-clone',
  'winzee-chat',
  'chatgpt-clone',
  'jobhelper'
];

const projects = {
  'unnie-box': {
    title: 'Unnie Box',
    category: 'UI Web Design',
    year: '2026',
    tagline: 'Case study for Unnie Box project.',
    tags: ['UI Design', 'Web Design'],
    role: 'Designer',
    duration: '—',
    tools: '—',
    // Dedicated case-study page (from unniebox_portfolio_v2.html)
    template: 'portfolio/unnie-box',
    next: { title: 'Learnlogicify Landing Page', slug: 'learnlogicify' }
  },

  'learnlogicify': {
    title: 'Learnlogicify Landing Page',
    category: 'UI Web Design',
    year: '2025',
    tagline: 'Conversion-focused landing page for an EdTech platform with bold visual identity and responsive layout.',
    tags: ['Figma', 'HTML', 'CSS', 'UI Design', 'EdTech'],
    role: 'UI/UX Designer & Frontend Dev',
    duration: '3 weeks',
    tools: 'Figma, HTML, CSS, JS',
    challenge: {
      title: 'Building Trust in 5 Seconds',
      text: 'The main challenge was to communicate the platform\'s core value proposition — accessible, structured online learning — in the first few seconds of a visit. EdTech is a crowded space, and users are skeptical. The design had to simultaneously feel premium, approachable, and credible, while driving sign-ups.'
    },
    process: {
      title: 'Research, Wireframe, Iterate',
      text: 'The project started with competitive analysis of 8 leading EdTech platforms to identify patterns and opportunities. Then came rapid wireframing in Figma before moving into high-fidelity prototypes.',
      steps: [
        { name: 'Discovery & Research', desc: 'Analyzed competitor platforms, identified UX gaps, and mapped the user journey from landing to sign-up.' },
        { name: 'Wireframing', desc: 'Created low-fidelity wireframes for 6 key sections: hero, features, testimonials, pricing, FAQ, and CTA.' },
        { name: 'Visual Design', desc: 'Developed a bold typographic system with a clean grid, warm neutrals, and strategic use of accent colors to guide attention.' },
        { name: 'Frontend Build', desc: 'Coded the full page in semantic HTML + CSS with custom animations and mobile-first responsive layout.' }
      ]
    },
    results: {
      title: 'A Measurable Outcome',
      text: 'The completed landing page achieved strong visual clarity and usability scores in peer review sessions. The design language established a cohesive brand system that was later extended to other pages.',
      metrics: [
        { value: '92%', label: 'Positive Feedback Score' },
        { value: '4.8s', label: 'Load Time' },
        { value: '6', label: 'Sections Designed' }
      ]
    },
    learnings: {
      title: 'What I Took Away',
      text: 'This project taught me the importance of hierarchy in landing page design — every element needs a clear role. I also learned how powerful whitespace is as a design tool: it draws attention to what matters rather than filling every inch with content.'
    },
    next: { title: 'Gemini Clone', slug: 'gemini-clone' }
  },

  'gemini-clone': {
    title: 'Gemini Clone',
    category: 'Frontend Development',
    year: '2025',
    tagline: 'Pixel-perfect recreation of Google\'s Gemini AI interface, exploring modern UX patterns and dark-mode theming.',
    tags: ['JavaScript', 'CSS', 'AI UI', 'Clone', 'Frontend'],
    role: 'Frontend Developer',
    duration: '2 weeks',
    tools: 'HTML, CSS, JavaScript',
    challenge: {
      title: 'Replicating Production-Level UI',
      text: 'Recreating an interface built by Google\'s team with near-unlimited resources meant pushing my CSS precision to its limits. The challenge was not just visual accuracy, but also replicating smooth interactions, responsive behaviour, and micro-animations that define the Gemini experience.'
    },
    process: {
      title: 'Deconstruct, Rebuild, Refine',
      text: 'The process was methodical: study the original interface in detail, then rebuild each component from scratch without copying any code.',
      steps: [
        { name: 'Interface Audit', desc: 'Documented every visual component, spacing unit, color value, and animation in the original interface.' },
        { name: 'Component Architecture', desc: 'Built a structured CSS system with custom properties mirroring Google\'s design tokens.' },
        { name: 'Interaction Design', desc: 'Replicated hover states, focus rings, smooth transitions, and loading animations using CSS and vanilla JS.' },
        { name: 'Responsive Polish', desc: 'Ensured accurate rendering across mobile, tablet, and desktop breakpoints.' }
      ]
    },
    results: {
      title: 'Visual & Technical Fidelity',
      text: 'The final clone achieved high visual fidelity with the original interface. This project significantly deepened my understanding of how large-scale design systems are structured at a code level.',
      metrics: [
        { value: '~95%', label: 'Visual Accuracy' },
        { value: '0', label: 'Frameworks Used' },
        { value: '14', label: 'Components Built' }
      ]
    },
    learnings: {
      title: 'What I Took Away',
      text: 'Cloning a polished interface forces you to pay attention to details you would otherwise ignore — 4px vs 6px padding, 0.15s vs 0.25s transitions, the exact weight of a border. This project made me a more precise and observant developer.'
    },
    next: { title: 'Winzee Chat App', slug: 'winzee-chat' }
  },

  'winzee-chat': {
    title: 'Winzee Chat App',
    category: 'App Design',
    year: '2024',
    tagline: 'Real-time messaging app concept with a refined dark UI designed for daily communication comfort.',
    tags: ['UI Design', 'Figma', 'Prototype', 'Mobile', 'Chat'],
    role: 'UI/UX Designer',
    duration: '4 weeks',
    tools: 'Figma, Prototyping',
    challenge: {
      title: 'Designing for Constant Use',
      text: 'Chat apps are used dozens of times per day, often in fragmented moments of attention. The challenge was to design an interface that is instantly readable, never fatiguing to look at, and fast to navigate — all while maintaining a distinctive visual identity that stands out from WhatsApp, Telegram, and iMessage.'
    },
    process: {
      title: 'User-First, Then Aesthetic',
      text: 'The process began with a user needs analysis and competitive benchmarking, before moving into information architecture and then visual design.',
      steps: [
        { name: 'User Research', desc: 'Surveyed 12 regular messaging app users about their pain points: notification overload, poor dark mode, cluttered interfaces.' },
        { name: 'Information Architecture', desc: 'Mapped all app states and user flows: conversation list, active chat, settings, search, and media viewer.' },
        { name: 'Dark UI Design System', desc: 'Built a refined dark color palette with carefully calibrated contrast ratios for readability without eye strain.' },
        { name: 'Prototyping', desc: 'Created a fully interactive Figma prototype with realistic transitions for user testing.' }
      ]
    },
    results: {
      title: 'A Calm, Focused Experience',
      text: 'The app design achieved its goal: a messaging interface that feels premium and calm. User testing showed strong preference for the notification system and typography choices over existing apps.',
      metrics: [
        { value: '12', label: 'App Screens Designed' },
        { value: '4.7/5', label: 'Usability Score' },
        { value: '100%', label: 'WCAG AA Contrast' }
      ]
    },
    learnings: {
      title: 'What I Took Away',
      text: 'This was my deepest dive into interaction design. I learned that the best UI work is invisible — the user never thinks about the design, they just feel like everything is exactly where it should be. Dark mode design also demands much more care than light mode: every shadow, every surface elevation matters.'
    },
    next: { title: 'ChatGPT Clone', slug: 'chatgpt-clone' }
  },

  'chatgpt-clone': {
    title: 'ChatGPT Clone',
    category: 'Frontend Development',
    year: '2024',
    tagline: 'Functional chat UI clone that decodes interaction design rules of modern AI assistants.',
    tags: ['JavaScript', 'API', 'Frontend', 'AI Interface', 'Clone'],
    role: 'Frontend Developer',
    duration: '2 weeks',
    tools: 'HTML, CSS, JavaScript, REST API',
    challenge: {
      title: 'Functional, Not Just Visual',
      text: 'Unlike a static visual clone, this project required actual functionality: real-time streaming responses, conversation history management, message formatting (including code blocks and markdown), and error states. The challenge was building something that actually works, not just looks right.'
    },
    process: {
      title: 'Build for Function, Style for Quality',
      text: 'The development process prioritized functional completeness before visual polish, ensuring every interaction worked correctly before refining aesthetics.',
      steps: [
        { name: 'API Integration', desc: 'Integrated with an AI API endpoint to enable real streaming responses in the chat interface.' },
        { name: 'State Management', desc: 'Built vanilla JS conversation state management to maintain chat history and context across messages.' },
        { name: 'Markdown Rendering', desc: 'Implemented client-side markdown parsing to correctly render code blocks, lists, and formatted text.' },
        { name: 'UI Polish', desc: 'Matched the visual language of the original interface with attention to animation timing and layout accuracy.' }
      ]
    },
    results: {
      title: 'A Working AI Chat Interface',
      text: 'The final product is a fully functional AI chat interface that handles streaming responses, conversation history, and proper markdown rendering — built entirely from scratch.',
      metrics: [
        { value: '1', label: 'Framework Used (none)' },
        { value: 'Live', label: 'Streaming Responses' },
        { value: '100%', label: 'Vanilla JS' }
      ]
    },
    learnings: {
      title: 'What I Took Away',
      text: 'This project was a significant technical leap. Working with streaming API responses, asynchronous JavaScript, and real-time DOM updates required me to deeply understand the event loop and browser rendering. I came out a much stronger JS developer.'
    },
    next: { title: 'JobHelper Platform', slug: 'jobhelper' }
  },

  'jobhelper': {
    title: 'JobHelper Platform',
    category: 'Web App Design',
    year: '2024',
    tagline: 'Job search management dashboard designed for clarity, speed, and focus during an often stressful process.',
    tags: ['Web App', 'UX Research', 'Dashboard', 'Figma', 'Frontend'],
    role: 'UI/UX Designer & Frontend Dev',
    duration: '5 weeks',
    tools: 'Figma, HTML, CSS, JavaScript',
    challenge: {
      title: 'Reducing Cognitive Load in a High-Stakes Process',
      text: 'Job searching is stressful and disorganized — most people manage it through spreadsheets, sticky notes, and browser tabs. The challenge was to design a platform that consolidates this chaos into a calm, clear dashboard that actually reduces anxiety rather than adding to it.'
    },
    process: {
      title: 'Empathy-Driven Design',
      text: 'The project began by understanding the emotional reality of job searching before designing anything.',
      steps: [
        { name: 'User Interviews', desc: 'Conducted interviews with 8 active job seekers to map their current workflows, frustrations, and emotional states.' },
        { name: 'Feature Prioritization', desc: 'Identified the 3 most critical features: application tracking, interview scheduling, and follow-up reminders.' },
        { name: 'Dashboard Architecture', desc: 'Designed an information hierarchy that surfaces the most urgent items without overwhelming the user.' },
        { name: 'UI Build', desc: 'Developed the frontend with a clean card-based layout, clear status indicators, and a minimal color system.' }
      ]
    },
    results: {
      title: 'A Calmer Way to Job Hunt',
      text: 'The final platform received overwhelmingly positive feedback in user testing sessions, with participants noting that it made their job search feel "manageable" for the first time.',
      metrics: [
        { value: '8', label: 'Users Interviewed' },
        { value: '3', label: 'Core Features Built' },
        { value: '4.9/5', label: 'User Satisfaction' }
      ]
    },
    learnings: {
      title: 'What I Took Away',
      text: 'JobHelper was my most user-research intensive project. I learned that the best features often come from listening more than designing. The follow-up reminder system — which became the most praised feature — was suggested by a user in the first interview. Good design starts with good listening.'
    },
    next: { title: 'Learnlogicify Landing Page', slug: 'learnlogicify' }
  }
};

module.exports = { projects, order };
