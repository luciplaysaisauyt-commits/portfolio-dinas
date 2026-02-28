// Portfolio project data
// Order is used for prev and next navigation on case study pages
const order = [
  'clm',
  'unnie-box',
  'chatgpt-clone',
  'jobhelper'
];

const projects = {
  'clm': {
    title: 'CLM Mafia Platform',
    category: 'UI UX Redesign',
    year: '2026',
    tagline: 'Full platform redesign for competitive Mafia community ratings tournaments clubs and game tracking.',
    tags: ['UI UX', 'Figma', 'Design System', 'Redesign'],
    role: 'UI UX Designer',
    duration: '—',
    tools: 'Figma',
    template: 'portfolio/clm',
    next: { title: 'Unnie Box', slug: 'unnie-box' }
  },

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
      text: 'This project taught me the importance of hierarchy in landing page design. Every element needs a clear role. I also learned how powerful whitespace is as a design tool. It draws attention to what matters rather than filling every inch with content.'
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
      text: 'JobHelper was my most user-research intensive project. I learned that the best features often come from listening more than designing. The follow-up reminder system, which became the most praised feature, was suggested by a user in the first interview. Good design starts with good listening.'
    },
    next: { title: 'ChatGPT Clone', slug: 'chatgpt-clone' }
  }
};

module.exports = { projects, order };