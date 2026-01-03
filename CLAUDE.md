# XphoraPulse - Agentic AI Day Submission

> **Google Cloud Presents: Agentic AI Day**
> *Build the next generation of intelligent agents*
> Powered by H2S

---

## Team Details

| Field | Value |
|-------|-------|
| **Team Name** | MetroMind |
| **Team Leader** | Aakashdeep Srivastava |
| **Problem Statement** | Managing city data overload |

### The Problem

Cities like Bengaluru generate millions of scattered data points every minute. Citizens and authorities struggle with information overload, unable to extract actionable insights from fragmented social media posts, reports, and events, while also missing the financial implications of city incidents on their personal finances.

---

## Solution Overview

**MetroMind** is an intelligent city data synthesis platform that transforms chaotic urban data into actionable insights through multi-agent AI coordination.

### The Core Concept

1. **Real-time Data Fusion**: Multiple AI agents synthesize scattered city reports into single, clear insights
2. **Multimodal Intelligence**: Citizens submit photos/videos that are automatically analyzed and categorized
3. **Financial Context Integration**: Using Fi MCP, the platform provides personalized financial impact analysis for city events, property market, and inflation tracking
4. **Predictive Awareness**: AI agents predict emerging issues and investment opportunities based on city patterns
5. **Living City Pulse**: Real-time visualization showing the "heartbeat" of urban intelligence

### Example in Action

```
15 scattered traffic reports → AI synthesizes into:

"Heavy traffic on Airport Road. Alternative: Ring Road (+15 min).
Financial Impact: Costs you ₹400 extra today, ₹8,000/month.
Metro investment opportunity nearby could increase property values 12%"
```

---

## Technology Stack

### Frontend Stack
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Maps**: Google Maps JavaScript API
- **Real-time**: Firebase SDK v9
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for analytics
- **Deployment**: Vercel

### Backend Stack
- **Platform**: Firebase (Google Cloud)
- **Database**: Firebase Realtime Database
- **Functions**: Firebase Cloud Functions (Node.js)
- **Storage**: Firebase Storage for media
- **Authentication**: Firebase Authentication
- **Analytics**: Firebase Analytics

### AI & Agent Technologies
- **Agent Framework**: Google Agent Development Kit (ADK)
- **LLM**: Gemini Pro + Gemini Pro Vision
- **AI Platform**: Vertex AI
- **Agent Coordination**: Vertex AI Orchestration
- **Multimodal Processing**: Gemini Vision for image/video analysis

### Financial Integration
- **Financial Data**: Fi MCP (Model Context Protocol)
- **MCP Client**: Custom Python/JavaScript integration
- **Financial APIs**:
  1. `fetch_net_worth`
  2. `fetch_credit_report`
  3. `fetch_epf_details`
  4. `fetch_mf_transactions`

### Additional Integrations
- **Maps & Location**: Google Maps Platform
- **Weather Data**: OpenWeatherMap API
- **Traffic Data**: Google Traffic APIs
- **Notifications**: Firebase Cloud Messaging
- **Monitoring**: Cloud Monitoring + Firebase Analytics

---

## Repository Links

| Type | URL |
|------|-----|
| **Backend** | https://github.com/harsh903/xphora-pulse.1 |
| **Frontend** | https://github.com/Aakashdeep-Srivastava/xphora-frontend |
| **Deployed App** | https://xphora-pulse.vercel.app/ |

---

## Features

### Multi-Agent AI Intelligence
5 Specialized Agents working together via Google ADK:
- Data Fusion Agent
- Multimodal Analysis Agent
- Prediction Engine Agent
- Sentiment Analysis Agent
- Financial Impact Agent

### Personal Financial Intelligence
- **Budget Impact Calculator**: Real-time cost analysis of city events on personal finances
- Alternative recommendations
- Investment opportunity alerts

### Real-Time Visualization
- **Living City Map**: Interactive dashboard with:
  - Incident markers
  - Financial impact overlays
  - Mood mapping
  - Personalized alerts for citizens and officials

### Intelligent User Experience
- AI-powered photo/video submission
- Auto-categorization
- Personalized notifications
- Privacy-protected social intelligence sharing

---

## Impact

| Impact Area | Description |
|-------------|-------------|
| **Faster Response Times** | Real-time data and AI insights help authorities act swiftly during disruptions |
| **Citizen-Centric Engagement** | WhatsApp-based bot allows people to report issues, get updates, and feel heard |
| **Efficient Resource Management** | Predictive alerts enable smarter deployment of municipal services and infrastructure |
| **Transparent & Unified Governance** | A single dashboard builds trust through verified, easily accessible civic data |
| **Financial Awareness for Individuals** | Converts urban disruptions into clear cost implications for better decision-making |
| **Inclusive & Localized Access** | Multi-language AI assistant ensures equitable access across communities |

---

## Competitive Advantage

### How XphoraPulse Differs from Existing Solutions

| Aspect | Existing Solutions | XphoraPulse |
|--------|-------------------|-------------|
| AI Architecture | Single AI models | **5 specialized agents** (Google ADK coordination) |
| Financial Context | None | **Fi MCP integration** - personal budget impact |
| Intelligence Type | Reactive information | **Predictive financial opportunities** |
| Data Processing | Basic aggregation | **Multi-agent synthesis** with deduplication |
| User Experience | Generic city updates | **Personalized financial insights** |

### Unique Selling Points

| USP | Value | Advantage |
|-----|-------|-----------|
| Financial-First City Intelligence | "Only platform showing personal cost of city events" | **No competitor** has financial context |
| Multi-Agent Coordination | 5 AI agents working together via Google ADK | **Cutting-edge agentic AI** showcase |
| Predictive Wealth Building | Investment opportunities from city developments | City intelligence → **financial opportunity** |
| Personal Context | Every insight tailored to individual finances | **Actionable** vs informational |

---

## Process Flow

### 4-Step Intelligent Process

```
1. 📸 REPORT
   └── Citizen submits photo + location

2. 🤖 AI ANALYSIS
   └── 5 specialized agents process data

3. 💰 FINANCIAL CONTEXT
   └── Fi MCP adds personal impact

4. 📊 SMART OUTPUT
   └── Personalized alerts + recommendations
```

### Example Flow

```
Traffic photo → "Costs you ₹400 today, Metro saves ₹200"
```

**Key Tech**: Google ADK coordination + Fi MCP financial intelligence

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI Agent Layer                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Google ADK Orchestration                    │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐    │   │
│  │  │ Gemini Pro+Vision│  │    Vertex AI Platform    │    │   │
│  │  └──────────────────┘  └──────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    External APIs                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐        │
│  │Weather APIs│  │Traffic APIs│  │  Social Media Mock │        │
│  └────────────┘  └────────────┘  └────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    Backend Services                              │
│  ┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐     │
│  │ Cloud Functions │  │Firebase Auth│  │ Firebase Storage│     │
│  └─────────────────┘  └─────────────┘  └─────────────────┘     │
│                       ┌─────────────────────┐                   │
│                       │ Firebase Realtime DB│                   │
│                       └─────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│               Financial Integration                              │
│  ┌──────────────┐  ┌─────────────────────────┐                 │
│  │  Fi MCP      │  │   Financial Data APIs   │                 │
│  │  Client      │──│   (net_worth, credit,   │                 │
│  │              │  │    epf, mf_transactions)│                 │
│  └──────────────┘  └─────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    Frontend Layer                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js 14 + TypeScript                     │   │
│  │  ┌────────────────────┐  ┌────────────────────────┐    │   │
│  │  │Tailwind + shadcn/ui│  │   Google Maps API      │    │   │
│  │  └────────────────────┘  └────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Future Scope

1. **Fake Post Detection**: Integrate ML models to identify and filter out misinformation or irrelevant updates posted by users

2. **Community Approval Workflow**: Add a peer-validation mechanism where posts from citizens require upvotes or confirmation from nearby users before going live

3. **Time-Series Analysis**: Use historical urban data to forecast trends and resource demand, improving city planning and response

4. **Admin Layer Integration**: Introduce role-based dashboards and controls for municipal officers and city administrators for better governance

---

## Development Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

*Google Cloud Agentic AI Day - Building the next generation of intelligent agents*
