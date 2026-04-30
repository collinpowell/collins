"use client";

import { useEffect, useRef } from "react";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "rgba(124, 58, 237, ",
      "rgba(6, 182, 212, ",
      "rgba(167, 139, 250, ",
    ];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}

const techStack = [
  "Solana",
  "Rust",
  "Solidity",
  "Next.js",
  "Go",
  "Flutter",
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background effects */}
      <div className="hero-bg">
        <ParticleField />
      </div>

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-8 sm:px-12 lg:px-16 text-center">
        {/* Available badge */}
        <div className="animate-fade-in-up mb-8">
          <div className="available-badge mx-auto w-fit">
            <span className="pulse-dot" />
            Available for Remote Roles
          </div>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up delay-200 text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black tracking-tight leading-[1.1] mb-6">
          I Build the{" "}
          <span className="gradient-text-hero">Infrastructure</span>
          <br />
          of <span className="gradient-text-hero">Web3</span>
        </h1>

        {/* Tech stack row */}
        <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-3 mb-6">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="tech-badge !text-sm !px-4 !py-1.5"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Sub-headline */}
        <p className="animate-fade-in-up delay-400 text-lg sm:text-xl text-text-secondary max-w-[650px] mx-auto mb-4 leading-relaxed">
          6+ years shipping DeFi protocols, DEX aggregators, and full-stack
          products.
        </p>
        <p className="animate-fade-in-up delay-500 text-base text-text-muted max-w-[550px] mx-auto mb-10">
          AI-assisted development with Claude Opus. Available for remote roles worldwide.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-600 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="btn-primary">
            <span className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              View My Work
            </span>
          </a>
          <a
            href="/Collins_Krubu_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Resume
          </a>
          <a
            href="mailto:collinskrubu723@gmail.com"
            className="btn-ghost"
          >
            <svg
              width="18"
              height="18"
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
            Let&apos;s Talk
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in delay-800 mt-16">
          <a
            href="#about"
            className="inline-flex flex-col items-center gap-2 text-text-muted hover:text-accent-purple-light transition-colors"
            aria-label="Scroll to about section"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
