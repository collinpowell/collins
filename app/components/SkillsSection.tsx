"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const categories = [
  {
    title: "Embedded Systems & IoT",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    skills: [
      "C / C++", "Arduino", "ESP32", "FreeRTOS", "PlatformIO",
      "MQTT", "Sensor Integration", "Hardware-to-Cloud Pipelines",
      "Real-Time Control Loops", "Smart Home Devices", "IoT Telemetry",
    ],
  },
  {
    title: "Blockchain & Web3",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    skills: [
      "Solana", "Rust", "Anchor", "Jupiter API", "Solidity", "OpenZeppelin",
      "Hardhat", "Truffle", "Cosmos SDK", "Ethermint", "Tendermint",
      "DeFi", "DEX Architecture", "NFTs", "Token Deployment",
    ],
  },
  {
    title: "Frontend",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    skills: [
      "Next.js", "React", "TypeScript", "Tailwind CSS", "MUI", "HTML/CSS",
    ],
  },
  {
    title: "App Development",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    skills: [
      "Flutter", "iOS / Android", "Windows Desktop", "Cross-Platform Apps", "Mobile Wallets", "Fastlane CI/CD",
    ],
  },
  {
    title: "Backend & Infrastructure",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    skills: [
      "Go (Golang)", "Node.js", "Express", "REST APIs", "WebSockets",
      "PostgreSQL", "MongoDB", "Redis",
      "Docker", "Kubernetes", "AWS EC2", "Vercel", "Digital Ocean",
      "GitHub Actions", "GitLab CI",
    ],
  },
  {
    title: "AI-Assisted Development",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    skills: [
      "Agentic Coding Workflows", "Claude (Anthropic)", "GitHub Copilot", "Cursor",
    ],
  },
  {
    title: "Tools & Workflow",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    skills: [
      "Git", "Postman", "Swagger", "Figma", "ClickUp", "DB Diagrams",
    ],
  },
];

export default function SkillsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="skills" className="relative">
      <div className="gradient-divider" />
      <div className="section-container" ref={ref}>
        <div className="text-center mb-12">
          <div
            className={`section-label mx-auto w-fit ${
              inView ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Skills &amp; Technologies
          </div>
          <h2
            className={`section-title ${
              inView ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            A deep <span className="gradient-text">technical toolkit</span>
          </h2>
          <p
            className={`section-subtitle mx-auto ${
              inView ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            From firmware on ESP32 microcontrollers to DeFi protocols processing millions — a full-spectrum engineering stack.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`skill-category ${
                inView
                  ? `animate-fade-in-up delay-${(i + 2) * 100}`
                  : "opacity-0"
              }`}
              style={{ animationDelay: inView ? `${(i + 2) * 0.1}s` : undefined }}
            >
              <h3>
                <span className="text-accent-purple">{cat.icon}</span>
                {cat.title}
              </h3>
              <div className="skills-grid">
                {cat.skills.map((skill) => (
                  <span key={skill} className="tech-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
