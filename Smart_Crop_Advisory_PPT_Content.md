# Smart Crop Advisory System - Presentation Content (8 Slides)

## Slide 1: Title Slide
**Smart Crop Advisory System**
*AI-Powered Multilingual Agricultural Advisory Platform*

Presented by: [Your Name/Group]
Department of Computer Science and Engineering
Sharnbasva University
Date: 11-04-2026 / 12-04-2026

Government of Punjab | Agriculture, FoodTech & Rural Development

---

## Slide 2: Abstract & Introduction

**Abstract:**
The Smart Crop Advisory System is a multilingual, AI-powered mobile and web application designed for small and marginal farmers in India. It provides real-time, location-specific guidance on crop selection, soil health, fertilizer use, pest/disease detection, weather alerts, and market prices.

**Problem Statement:**
- Farmers lack access to expert agricultural knowledge
- Dependence on guesswork for crop and fertilizer decisions
- Language barriers and low literacy rates limit technology adoption
- Delayed response to weather events and pest outbreaks
- No real-time market price information for informed selling

**Solution:**
Integrated platform combining AI-powered advisory, soil analysis, pest detection, weather alerts, market prices, and voice support in regional languages (English, Hindi, Punjabi).

---

## Slide 3: Literature Survey & Problem Formulation

**Existing Systems & Gaps:**

| System | Features | Limitations |
|--------|----------|-------------|
| mKisan Portal | SMS-based advisory | No AI recommendations, text-only |
| Kisan Suvidha | Weather, market prices | No personalized soil-based advice |
| Plantix | Image-based pest detection | Limited to disease ID, no comprehensive advisory |
| Crop Insurance Apps | Insurance claims | No preventive guidance |

**Research Gap:** No integrated system combining AI crop advisory, soil analysis, pest detection, weather alerts, market prices, and voice support in regional languages.

**Current Technology Trends:**
- AI/ML for precision agriculture
- Computer vision for crop health monitoring
- Mobile-first applications for rural connectivity
- Voice-based interfaces for accessibility
- Cloud computing for scalable data processing

---

## Slide 4: Scope, Objectives & Methodology

**Scope:**
- Geographic: Punjab (scalable to pan-India)
- Users: Small and marginal farmers (< 5 acres)
- Crops: Kharif, rabi, and zaid crops
- Languages: English, Hindi, Punjabi

**Key Objectives:**
1. Personalized crop recommendations based on soil and location
2. AI-powered pest/disease detection via image analysis
3. Timely weather alerts to protect crops
4. Real-time market price information
5. Voice interaction for low-literate farmers
6. Feedback collection for continuous improvement
7. Data security and privacy compliance

**Methodology:**
Microservices architecture with separate frontend (React web + React Native mobile) and backend (Node.js/Express API), AI/ML engines (Python FastAPI), PostgreSQL database, Redis cache, and external API integrations.

---

## Slide 5: System Architecture & Technology Stack

**Layered Architecture:**

```
┌─────────────────────────────────────────┐
│  Client Tier                            │
│  • React Web + Vite                     │
│  • React Native Mobile (Expo)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  API Gateway (Express + JWT Auth)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Application Services                   │
│  • User • Advisory • Image • Weather    │
│  • Market • Voice • Notification        │
└─────────┬───────────────┬───────────────┘
          │               │
┌─────────▼─────┐  ┌──────▼──────────────┐
│  AI/ML Tier   │  │  Data Tier          │
│  • Advisory   │  │  • PostgreSQL 15    │
│    Engine     │  │  • Redis 7 (Cache)  │
│  • Vision     │  │                     │
│    Engine     │  │                     │
└───────────────┘  └─────────────────────┘
```

**Technology Stack:**
Backend: Node.js 20 + Express | Database: PostgreSQL 15 | Cache: Redis 7 | AI/ML: Python FastAPI | Frontend: React 18 + React Native | APIs: Google Cloud Speech, OpenWeatherMap, Agmarknet, Firebase FCM | Container: Docker + Docker Compose

---

## Slide 6: Key Features & Implementation

**Core Features:**

**1. Farmer Registration & Profile**
- OTP-based mobile verification
- Profile: location, land details, preferred language
- JWT authentication (1h access + 30d refresh tokens)

**2. Soil Profile & Crop Advisory**
- Input: soil type, pH [0-14], NPK values, GPS location
- AI generates 3+ ranked crop recommendations
- Includes: yield range, water requirement, input cost
- Considers crop rotation principles

**3. Fertilizer Guidance**
- Type, quantity (kg/acre), application timing
- Organic alternatives + soil amendments
- pH-based recommendations

**4. Pest & Disease Detection**
- Image upload (JPEG/PNG, max 10MB)
- AI diagnosis with confidence score
- Chemical + organic treatment options
- Extension officer referral if confidence <60%

**5. Weather Alerts**
- Heavy rainfall (>50mm/24h) and frost warnings
- 12h advance alerts via push notifications
- 6-hour data refresh cycle

**6. Market Price Tracking**
- Prices from 3+ mandis within 100km
- Distance, last update timestamp
- Staleness warning if data >24h old
- 12-hour refresh cycle

**7. Voice Support**
- Speech-to-Text and Text-to-Speech
- English, Hindi, Punjabi
- <5 second response time

---

## Slide 7: Data Architecture & Expected Outcomes

**Data Models:**
- **farmers**: Profile, location, language preference
- **soil_profiles**: Type, pH, NPK, GPS coordinates
- **crop_history**: Rotation tracking
- **advisory_sessions**: Anonymized for analytics
- **feedback**: 1-5 ratings for continuous improvement
- **notifications**: Alert logs

**Redis Cache:**
- OTP (10min TTL) | JWT refresh (30d TTL)
- Weather (6h TTL) | Market prices (12h TTL)

**Security:**
- Environment-based API key management
- No secrets in version control
- JWT authentication + rate limiting
- Anonymized data collection

**Expected Outcomes:**

**For Farmers:**
- Improved crop yield through data-driven decisions
- Reduced input costs via optimized fertilizer use
- Early pest detection minimizing crop loss
- Better market prices through informed selling
- Accessible expertise in local language

**For Agriculture Sector:**
- Data-driven insights into farming patterns
- Scalable advisory delivery model
- Digital inclusion of low-literate farmers
- Reduced dependency on physical extension services

**Measurable Metrics:**
User adoption rate | Advisory accuracy (feedback ratings) | Response time | Pest detection accuracy | System uptime

---

## Slide 8: Conclusion & Q&A

**Key Achievements:**
✓ Comprehensive agricultural advisory platform
✓ AI-powered personalized recommendations
✓ Multilingual and voice-enabled accessibility
✓ Real-time weather and market integration
✓ Scalable microservices architecture
✓ Privacy-compliant data handling

**Implementation Status:**
✓ System architecture, database schema, API specification
✓ Backend services, frontend web/mobile applications
✓ Advisory Engine and Vision Engine microservices
✓ Authentication, authorization, multilingual support
⚙ ML model training, integration testing, voice optimization

**Impact Potential:**
- Empowering small and marginal farmers
- Bridging the agricultural knowledge gap
- Reducing crop losses through early detection
- Improving farmer income through better decisions
- Digital inclusion of low-literate rural population

**Alignment with Government Initiatives:**
Agriculture, FoodTech & Rural Development | Digital India | Farmer Welfare Programs

---

**Thank You! Questions?**

**Contact:** [Your Name] | [Email] | [Mobile]
**Repository:** [GitHub Link]

---

## Presentation Notes

**Visual Aids to Include:**
- System architecture diagram (Slide 5)
- User journey flowchart
- Screenshots of mobile and web interfaces
- Sample crop recommendations
- Pest detection examples
- Market price comparison table

**Demo Preparation:**
- Test registration → OTP → profile flow
- Soil profile → crop advisory → fertilizer schedule
- Image upload → pest detection → treatment
- Voice interaction in Hindi/Punjabi
- Market price comparison
- Have backup video if live demo fails
