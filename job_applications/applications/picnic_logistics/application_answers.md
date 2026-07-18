# Picnic Application Form Answers

*Copy and paste these directly into the Picnic application portal.*

### 1. How do you continue learning and staying up to date in tech? Tell us about the conferences, meetups, communities, blogs, newsletters, podcasts, or other resources you regularly engage with.

As a self-taught software engineer, continuous learning is the only way I survive. I stay up to date primarily by studying the engineering blogs of companies that handle massive, asynchronous data throughput. I regularly read the engineering blogs from Cloudflare, Uber (specifically their routing and logistics architecture breakdowns), and naturally, the Picnic Engineering blog on Medium, which first introduced me to your use of discrete event simulation for physical warehouse hardware. 

Additionally, because my work bridges web backend systems and low-level IoT hardware, I am highly active in the Go (Golang) and Rust open-source communities. I follow the Go Time podcast for systems-level discussions and regularly participate in GitHub discussions regarding concurrent microservice optimization. When I need to solve a new hardware integration problem, I dive deep into IEEE papers on sensor networks and IoT data pipelines to ensure my backend can handle the physical telemetry safely.

---

### 2. Tell us about a time a decision you made caused a problem. How did you handle that problem, and what would you do differently?

When I initially built the architecture for Lupply (my food delivery and B2B logistics platform), I made the mistake of relying on a synchronous REST architecture to handle driver routing updates and inventory state changes. Because I wanted to ship the MVP quickly, I assumed direct database writes to MongoDB would be sufficient. 

The problem surfaced when we experienced sudden spikes in order volume. Multiple drivers were pinging the server simultaneously for route updates while vendors were concurrently pushing inventory changes. The synchronous architecture caused severe database contention, resulting in timeouts, delayed driver routing, and ultimately, a poor customer experience. 

To solve this, I had to rapidly redesign the core routing engine. I decoupled the inventory and routing logic and migrated to an asynchronous, event-driven architecture using a message broker. Instead of synchronous database writes, drivers and machines published events to a queue, allowing the backend to process them reliably without locking the database. 

If I were to do it again, I would implement an event-driven architecture using RabbitMQ or Kafka from day one. I learned the hard way that when dealing with real-world physical logistics, asynchronous messaging is not an optional optimization—it is a baseline requirement.
