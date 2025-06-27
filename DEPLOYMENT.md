
# Deployment Guide

## Complete Code Files for Local Development

### Package.json
```json
{
  "name": "yt-summarizer",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@supabase/supabase-js": "^2.50.2",
    "@tanstack/react-query": "^5.56.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.3.0",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-resizable-panels": "^2.1.3",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.15.0",
    "@typescript-eslint/parser": "^7.15.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.2.2",
    "vite": "^5.3.4"
  }
}
```

### Environment Setup Instructions

1. **Create `.env.local`** (for local development only):
```env
VITE_SUPABASE_URL=https://mfajfuvpmixxhcyofmzx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mYWpmdXZwbWl4eGhjeW9mbXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDg1NjIsImV4cCI6MjA2NjU4NDU2Mn0.XRh0yfU3BTGfVtYuFSoFKQocPahbBhq48a0j2u0VmxE
```

2. **Supabase Edge Function Environment**:
   - Go to your Supabase Dashboard
   - Navigate to Project Settings → Edge Functions → Environment Variables
   - Add: `GROQ_API_KEY` with your Groq API key

### Quick Start Commands

```bash
# Clone and setup
git clone <your-repo>
cd ai-youtube-summarizer
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Groq API key added to Supabase Edge Functions
- [ ] Edge function deployed: `npx supabase functions deploy summarize-video`
- [ ] Frontend built and deployed to hosting platform
- [ ] Domain configured (if applicable)

## Troubleshooting

### Common Issues:
1. **API Key not working**: Ensure GROQ_API_KEY is set in Supabase Edge Functions environment
2. **CORS errors**: Check that corsHeaders are properly configured
3. **Transcript extraction fails**: The app includes fallback methods and mock data for testing

### Testing the API:
```bash
curl -X POST https://mfajfuvpmixxhcyofmzx.supabase.co/functions/v1/summarize-video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{"videoUrl":"https://youtu.be/dQw4w9WgXcQ","language":"english","model":"groq"}'
```
