# Picnic Interview Strategy: Software Engineer (Logistics)

## 1. Company Research & Context
Picnic Technologies is a massive, heavily funded European "supermarket on wheels."
*   **Funding & Scale:** They recently raised €430M to scale their automated fulfillment centers.
*   **The Technical Challenge:** They manage 1,500+ autonomous warehouse robots using discrete event simulation and RabbitMQ. This is high-level systems engineering bridging software with physical hardware logistics.
*   **Engineering Leadership:** Daniel Gebler (CTO & Founder), Joris Beckers (CEO), Michiel Muller (Founder), Frederik Nieuwenhuys (Founder). 
*   **Tech Recruiters (Amsterdam/EU):** Carolina Gonzalez, Frankie Prina, Nadja Feykes.
*   **Email Format:** `firstname.lastname@teampicnic.com`
*   **Core Tech Stack:** Java 21, Spring Boot, React, Python, PostgreSQL, Docker, AWS, RabbitMQ.

## 2. De-Risking the "Unconventional Hire" (The Core Strategy)
European corporate hiring managers are highly risk-averse. They often hire the "safest to justify" candidate (e.g., standard CS grad) over an innovative self-taught founder because an unconventional hire is a personal risk to the manager. Our application materials are designed specifically to eliminate that risk:
*   **Proof Links Everywhere:** Every project on the resume has a live, clickable link (Google Play, Microsoft Store, Web URLs). The manager doesn't have to guess if you can code—they can verify it instantly.
*   **Embedded Systems Shield:** Placing the "Certificate in Embedded Systems (2019)" at the top of your education provides a formal, technical anchor that satisfies HR's need for paper qualifications.
*   **Addressing Visa Compliance Upfront:** By explicitly stating you qualify for the "Highly Skilled Migrant visa", you do HR's homework for them, proving that you are a legally safe and easy hire for a Dutch company.

## 3. The "Waterfall" Cold Email Outreach
Do not blast everyone at once. Use a targeted, 1-on-1 waterfall approach to maintain a personal touch:
1.  **Initial Strike:** Send the `cold_email.txt` exactly as written to `daniel.gebler@teampicnic.com`. Attach the PDF resume. This makes it a personal conversation with the CTO.
2.  **The Follow-Up (After 4 Days):** If Daniel doesn't reply, go to your Sent folder and Forward that email to `carolina.gonzalez@teampicnic.com` with a brief note: *"Hi Carolina, I reached out to Daniel regarding the Logistics Engineering role, but I wanted to float my profile past your desk directly just in case he's swamped this week. My original email and portfolio links are below."*
3.  **Repeat:** If Carolina doesn't answer, repeat the forward process to Nadja or Frankie a few days later.

## 4. The B2B Contractor Pivot
The biggest objection to international hiring is the slow visa process. 
*   **The Spin:** Offer to start *immediately* as a remote B2B contractor while the relocation and visa paperwork is processed in the background. 
*   **Why it works:** This offers them a zero-risk trial period. If it works out, they sponsor you. If not, they end the contract with zero European labor law consequences.

## 5. Your Polyglot Superpower: C, Java, Rust, Go, TS
Picnic's backend is heavily Java 21 and Spring Boot. Because Java was your first language, and you actively build systems in C, Rust, Go, and TS, you have a massive advantage over standard bootcamp web developers.
*   **How to spin it:** "Java was my first language, which gave me a deep foundation in OOP and strict typing. However, I am a polyglot systems engineer. I built Lupply's highly concurrent microservices in Go, and I wrote the real-time hardware ingestion pipelines for NodeX in C/C++ and Rust. The syntax of Java 21 and Spring Boot 3 are tools I am highly comfortable returning to because I already write compiled, typed, and concurrent backend services."

## 6. Your Secret Weapon: Logistics Domain Expertise
Picnic solves logistics problems (routing, inbound/outbound, driver management). **You have literally built this.**
*   **Lupply Food:** You built a food delivery platform. Talk about how you managed driver routing, inventory, and customer state.
*   **Lupply Vendor Sync:** You built the inventory management and logistics for scaling B2B vendor supply chains.
*   **NodeX iHub:** You handled real-time physical logistics (traffic lights), bridging the gap between hardware and software. 
*   **Lunar Finance:** You built high-throughput RPC indexers and optimized DB queries in Rust—perfect for Picnic's massive asynchronous messaging needs.

## 7. The Technical Interview Expectations
*   **The Coding Challenge:** It will likely be a HackerRank or take-home assignment focused on a logistics problem (e.g., "Find the most efficient route for this delivery van"). Choose the language you are fastest in for algorithms.
*   **System Design:** Brush up on designing distributed systems, specifically focusing on event-driven architecture (RabbitMQ/Kafka) and message queues, as this is how their robots and microservices communicate.

## 8. Handling the "No Big Company Experience" Objection
If they ask why you haven't worked at a FAANG or massive corporation, do not be defensive. Acknowledge the difference, and immediately pivot it into your biggest strength: **Ownership.**
*   **The Problem with Big Tech Devs:** Engineers at massive companies often work in tiny silos. They only touch a small fraction of a codebase and have an army of DevOps, QA, and platform engineers doing the heavy lifting.
*   **Your Advantage:** You have built entire platforms end-to-end. You understand databases, networking, CI/CD, frontend, and backend architecture because you *had* to. 
*   **How to spin it:** *"I've spent the last 5 years acting as an owner—building platforms entirely from scratch, managing my own infrastructure, and scaling them to live users. I am applying to Picnic because I want to take that intense product-ownership mindset and apply it to a massive, hyper-scale environment where I can focus deeply on solving complex logistics bottlenecks rather than building the entire stack by myself."*
