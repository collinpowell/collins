"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const journeySteps = [
  {
    title: "The Hardware Foundation",
    description: "It all started with bare metal. Before scaling cloud architectures, I spent years writing C/C++ firmware for ESP32 and Arduino, building tangible hardware products. From smart parking systems to custom PCBs, I learned to optimize for extreme resource constraints.",
    image: "/proofs/Hardware_Prototyping_Workstation.jpeg",
    year: "2018 - 2020",
    tags: ["Embedded C++", "IoT", "PCB Design", "Sensors"]
  },
  {
    title: "Building NodeX iHub",
    description: "Co-founding NodeX iHub forced me to evolve from a solo engineer to a technical leader. We scaled physical tech solutions across Nigeria, including government contracts for traffic infrastructure and commercial snooker vending systems.",
    image: "/proofs/NodeX_Team_Group.jpeg",
    year: "2020 - 2023",
    tags: ["Leadership", "B2G Contracts", "Hardware Production", "System Design"]
  },
  {
    title: "Empowering the Next Generation",
    description: "Engineering isn't just about building things; it's about building people. I've dedicated significant time to STEM outreach, teaching hardware and software principles to both kids and adults, refining my ability to communicate complex concepts simply.",
    image: "/proofs/STEM_Outreach_Kids.jpeg",
    year: "Ongoing",
    tags: ["Mentorship", "Public Speaking", "Community", "Education"]
  },
  {
    title: "The Web3 & Full-Stack Era",
    description: "Today, I leverage my deep systems knowledge to build scalable SaaS products like Lupply and decentralized financial infrastructure on Solana and Ethereum. From hardware interrupts to smart contract state transitions, the core engineering principles remain the same.",
    image: "/proofs/Software_Development_Desk.jpeg",
    year: "Present",
    tags: ["Solana", "Rust", "Next.js", "Smart Contracts"]
  }
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id="about" className="relative py-24 bg-bg-primary overflow-hidden" ref={containerRef}>
      <div className="section-container relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-24"
        >
          <div className="section-label mx-auto mb-6">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            The Journey
          </div>
          <h2 className="section-title">
            From <span className="gradient-text">Bare Metal</span> to <span className="gradient-text">Web3</span>
          </h2>
          <p className="section-subtitle mx-auto">
            My engineering path wasn't traditional. It started with soldering irons and microcontrollers, evolving into building high-performance decentralized systems.
          </p>
        </motion.div>

        <div className="space-y-32">
          {journeySteps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
                
                {/* Image Column */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50, rotate: isEven ? -2 : 2 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full md:w-1/2 relative"
                >
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden glass-card p-2 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <Image 
                      src={step.image} 
                      alt={step.title}
                      fill
                      className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>

                {/* Text Column */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full md:w-1/2 flex flex-col justify-center"
                >
                  <span className="text-accent-cyan-light font-mono text-sm tracking-wider mb-2 block">{step.year}</span>
                  <h3 className="text-3xl font-bold mb-4 text-text-primary">{step.title}</h3>
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    {step.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map(tag => (
                      <span key={tag} className="tech-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
