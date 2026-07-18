# Company Dossier: Picnic Technologies

## 1. Company Overview
*   **Mission:** Building the "supermarket on wheels." Picnic is a tech-first online grocery delivery service that relies entirely on a highly optimized, "just-in-time" supply chain to eliminate food waste and reduce costs.
*   **Scale:** Operates across the Netherlands, Germany, and France with a fleet of over 5,000 custom-built electric delivery vehicles.
*   **Engineering Culture:** They are famous for building *everything* in-house. From the consumer-facing mobile apps to the software that routes the electric vehicles and the systems that manage automated conveyor belts in the warehouses, it is all homegrown.

## 2. The Logistics & Supply Chain Architecture
Since you are interviewing for the **Logistics Domain**, this is what you need to know about how they operate under the hood:

### Automated Fulfillment Centers (FCA)
*   Picnic doesn't just manage data; their software controls physical hardware. Their backend systems communicate with PLCs (Programmable Logic Controllers), robot arms, and massive conveyor belt networks. 
*   **Your NodeX Angle:** This is exactly what you did at NodeX iHub with the smart traffic lights. You understand how software must bridge the gap to control and ingest data from physical IoT hardware in real-time.

### "Just-in-Time" Routing
*   They don't hold massive inventories. They order from suppliers based exactly on what customers have requested in the app, and it is immediately cross-docked onto electric vans. 
*   **Your Lupply Angle:** Talk about how you handled delivery routing in Lupply Food. Picnic uses complex ML models for demand forecasting, but the core engineering challenge is moving data fast enough to coordinate the physical vans.

## 3. The Tech Stack Deep Dive
*   **Core Backend:** Java 21/25 (Spring Boot 3.5). Python is also heavily used for ML and data pipelines. 
*   **Messaging (Crucial):** **RabbitMQ** is the absolute backbone of their architecture. Because warehouse systems and delivery vans generate massive amounts of events, they rely on an event-driven microservices architecture. 
*   **Database & Analytics:** PostgreSQL, MongoDB, and they recently migrated to **ClickHouse Cloud** for real-time analytics across their 20+ fulfillment centers.
*   **Infrastructure:** 100% AWS. Heavy use of Docker, Kubernetes, Helm, and Terraform. Datadog for monitoring.

## 4. How to Impress Them in an Interview
1.  **Talk about "Discrete Event Simulation":** Picnic is famous for building "Matrix-like" virtual environments to simulate their warehouses before deploying code to the real physical robots. When discussing testing, mention that you understand the importance of simulating physical hardware constraints in software.
2.  **Focus on Waste Reduction:** Their entire business model hinges on reducing food waste to near zero. Frame your architectural decisions around efficiency (e.g., "In Lupply, we optimized the database queries so the delivery drivers had the most up-to-date route to prevent delays and spoilage").
3.  **Lean into the Go/Java Comparison:** Picnic engineers love performance. Remind them that your recent backend work was in Go (Golang), which shares Java's need for strict typing, concurrency, and high-performance execution.

## 5. Key People
*   **Daniel Gebler (CTO & Co-founder):** A highly technical CTO who frequently blogs and speaks about AI and supply chain optimization. Reading his recent tech blog posts on the Picnic Engineering Blog (Medium) is highly recommended before the final interview stage.
