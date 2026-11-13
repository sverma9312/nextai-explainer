# 🧠 NextAI Explainer

> **Autonomous 60-Second Animated Software Architecture & System Design Breakdowns for Engineers.**  
> Deconstructing large-scale distributed systems (Uber, Netflix, WhatsApp, Stripe, UPI, Discord) into cinematic animated diagrams — rendered and published with **$0 recurring infrastructure cost**.

---

## 🚀 Overview

**NextAI Explainer** is an autonomous content engine and interactive educational platform designed for software engineers, engineering managers, and FAANG technical interview candidates.

Every day, the system autonomously:
1. Selects an architectural case study from the distributed systems catalog.
2. Synthesizes a high-density, authoritative technical script using **Google Gemini 2.5 Flash**.
3. Generates high-clarity neural narration and millisecond word-level timestamps via **Microsoft Edge-TTS**.
4. Renders a cinematic 1080×1920 30FPS vertical video using **Remotion (React 19)** with dynamic glowing network graphs and flowing data packets.
5. Publishes automatically to **YouTube Shorts** and **Instagram Reels** via direct binary API uploads.
6. Updates the interactive web hub at **`explainer.nextai-apps.com`**.

---

## 🏗️ 5-Stage Autonomous Engine Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   NextAI Explainer Engine                   │
└─────────────────────────────────────────────────────────────┘
                              │
   [1. System Design Catalog] ├── 6 Curated Case Studies (Uber, Netflix, WhatsApp...)
                              │
   [2. Gemini 2.5 Flash]      ├── Layered Technical Script (Hook, L1, L2, L3, Takeaway)
                              │
   [3. Edge-TTS Engine]       ├── Andrew Neural Voice + Millisecond Word Timestamps
                              │
   [4. Remotion Headless]     ├── React 19 + SVG Bezier Network Graphs + Packet Physics
                              │
   [5. Social Distribution]   └── Direct Resumable Binary Upload (YouTube + Meta Graph)
```

---

## 📚 Curated Architecture Case Studies

| Topic | Company | Scale & Core Metric | Key Architectural Breakthrough |
| :--- | :--- | :--- | :--- |
| **H3 Geospatial Matching** | Uber | 1M+ Drivers, <100ms P99 | Replaced slow distance geometry with hierarchical integer hexagon lookups in Redis clusters |
| **Open Connect CDN** | Netflix | 250M Users, 15% Web Traffic | Zero-copy FreeBSD kernel TLS appliances deployed directly inside 1,000+ local ISP data centers |
| **Actor Concurrency** | WhatsApp | 100B Msgs/Day, 50 Engineers | Lightweight Erlang BEAM actors (300 bytes memory) maintaining 2M live TCP sockets per node |
| **Distributed Payments** | UPI | 14B Monthly Txns, 50k TPS | Hardware HSM encrypted authentication with automated 2-phase distributed commit rollbacks |
| **Idempotency Engine** | Stripe | Millions TPS, 99.999% ACID | Client-injected idempotency keys locked with atomic Redis SETNX mutexes to prevent double charges |
| **ScyllaDB Migration** | Discord | Trillions of Msgs, 5ms P99 | Eliminated JVM garbage collection pauses by migrating from Cassandra to C++ thread-per-core ScyllaDB |

---

## 💰 $0 Infrastructure Cost Breakdown

| Component | Technology | Monthly Cost |
| :--- | :--- | :--- |
| **Script Synthesis** | Google Gemini 2.5 Flash (Free Tier) | **$0.00** |
| **Voiceover & Subtitles** | Microsoft Edge-TTS Neural API | **$0.00** |
| **Headless Rendering** | GitHub Actions Ubuntu Runners (2,000 free min/mo) | **$0.00** |
| **Video Storage** | YouTube Shorts & Instagram Reels CDNs | **$0.00** |
| **Web Hub & CDN** | Cloudflare Workers & Pages Edge Network | **$0.00** |
| **Total Recurring Cost** | — | **$0.00 / month** |

---

## 💻 Local Development & CLI

```bash
# 1. Install dependencies
pnpm install

# 2. Preview the interactive Remotion studio
pnpm remotion:preview

# 3. Test script synthesis & speech without rendering video
pnpm generate:dry-run

# 4. Render a full 1080x1920 MP4 for a specific case study
pnpm generate:latest --topic uber-h3-matching

# 5. List all topics in the catalog
pnpm test:catalog
```

---

## 📄 License

MIT © 2026 [NextAI Apps Studio](https://nextai-apps.com/)

