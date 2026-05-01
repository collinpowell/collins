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

export default function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="relative">
      <div className="gradient-divider" />
      <div className="section-container" ref={ref}>
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Left column */}
          <div
            className={`${
              inView ? "animate-slide-in-left" : "opacity-0"
            }`}
          >
            <div className="section-label">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              About
            </div>
            <h2 className="section-title">
              Crafting the{" "}
              <span className="gradient-text">future of finance</span>
            </h2>
            <div className="available-badge mt-6">
              <span className="pulse-dot" />
              Currently Available
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { value: "6+", label: "Years Exp." },
                { value: "10+", label: "Projects Shipped" },
                { value: "5+", label: "Countries Served" },
                { value: "3+", label: "Blockchains" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-4 text-center"
                >
                  <div className="text-2xl font-black gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Bio */}
          <div
            className={`${
              inView ? "animate-fade-in-up delay-300" : "opacity-0"
            }`}
          >
            <div className="space-y-5 text-text-secondary leading-relaxed">
              <p className="text-lg">
                Collin Powell is a senior blockchain and full-stack engineer
                based in Lagos, Nigeria. Over 6 years he&apos;s shipped DEX
                aggregators, DeFi platforms, custom blockchains, SaaS products,
                mobile apps, and enterprise websites for clients across Nigeria,
                the UK, the Philippines, India, and the US.
              </p>
              <p>
                He builds with AI-assisted workflows — using{" "}
                <span className="text-accent-purple-light font-medium">
                  Claude Opus
                </span>{" "}
                and{" "}
                <span className="text-accent-purple-light font-medium">
                  GitHub Copilot
                </span>{" "}
                to move faster without cutting corners. He&apos;s a former
                co-founder of{" "}
                <span className="text-white font-medium">NodeX iHub</span>, a
                technology learning hub in Warri, Nigeria.
              </p>
              <p>
                He&apos;s available for{" "}
                <span className="text-accent-cyan-light font-medium">
                  full-time remote roles
                </span>
                , contracts, and part-time consulting worldwide.
              </p>
            </div>

            {/* Location & contact pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-[rgba(124,58,237,0.1)] text-sm text-text-secondary">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Lagos, Nigeria — Remote Worldwide
              </div>
              <a
                href="mailto:collinskrubu723@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-[rgba(124,58,237,0.1)] text-sm text-text-secondary hover:text-accent-purple-light hover:border-accent-purple transition-all"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                collinskrubu723@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
