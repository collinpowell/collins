"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
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

export default function AISection() {
  const { ref, inView } = useInView();

  return (
    <section id="ai-section" className="relative">
      <div className="gradient-divider" />
      <div className="section-container" ref={ref}>
        <div
          className={`max-w-[800px] mx-auto ${
            inView ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          {/* Glass card */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(124,58,237,0.2)] bg-gradient-to-br from-[rgba(124,58,237,0.08)] via-[rgba(22,22,30,0.6)] to-[rgba(6,182,212,0.05)] p-8 sm:p-12">
            {/* Corner glow */}
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    AI-Augmented Engineer
                  </h3>
                  <p className="text-sm text-accent-purple-light font-medium">
                    Faster delivery · Better architecture · Production quality
                  </p>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed text-lg">
                Collin integrates AI tools — including{" "}
                <span className="text-accent-purple-light font-semibold">
                  Claude Opus (Anthropic)
                </span>{" "}
                and{" "}
                <span className="text-accent-purple-light font-semibold">
                  GitHub Copilot
                </span>{" "}
                — directly into his development workflow. This means faster
                delivery, better architecture decisions, and production-quality
                code without sacrificing precision.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  { icon: "⚡", label: "2× Faster Shipping" },
                  { icon: "🧠", label: "AI-Driven Architecture" },
                  { icon: "🎯", label: "Production Quality" },
                  { icon: "🔄", label: "Integrated Workflow" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.15)] text-sm text-text-primary"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
