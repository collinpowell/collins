"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
  "React",
  "Next.js",
  "Node.js",
  "Flutter",
  "Go",
  "TypeScript",
];

export default function HeroSection() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary"
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
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-8 sm:px-12 lg:px-16 text-center pt-24 sm:pt-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="available-badge mx-auto w-fit">
            <span className="pulse-dot" />
            Available for Opportunities
          </div>
        </motion.div>

        {/* Headline */}
        <div className="min-h-[160px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[250px] flex flex-col justify-center mb-4">
          <motion.h1
            key={titleIndex}
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[3.5rem] sm:text-6xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[1.05]"
          >
            {titleIndex === 0 ? (
              <>
                <span className="text-white">I Build the</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-purple-light via-accent-cyan to-accent-purple">
                  Infrastructure
                </span>
                <br />
                <span className="text-white">the</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan-light to-accent-green">
                  Modern Web
                </span>
              </>
            ) : (
              <>
                <span className="text-white">I Build</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-purple-light via-accent-cyan to-accent-purple">
                  Enterprise Apps
                </span>
                <br />
                <span className="text-white">&amp;</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan-light to-accent-green">
                  SaaS
                </span>
              </>
            )}
          </motion.h1>
        </div>

        {/* Tech stack row */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          {techStack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-mono text-white/80 hover:border-accent-purple/50 hover:bg-accent-purple/10 hover:text-white transition-all cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl text-text-secondary max-w-[700px] mx-auto mb-10 leading-relaxed font-light"
        >
          6+ years shipping Enterprise platforms, Marketplaces, and full-stack
          products from <span className="font-semibold text-white/90">hardware prototypes</span> to <span className="font-semibold text-white/90">global production</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <a href="#about" className="btn-primary">
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
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              Discover the Journey
            </span>
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
        </motion.div>
      </div>
    </section>
  );
}
