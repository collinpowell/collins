"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useInView(threshold = 0.1) {
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

interface Project {
  name: string;
  url: string;
  image: string | null;
  placeholderClass?: string;
  description: string;
  role: string;
  stack: string[];
  tag: string;
}

const projects: Project[] = [
  {
    name: "Lunar Finance",
    url: "https://lunarfinance.io",
    image: "/projects/lunar-finance.png",
    description:
      "Multi-chain DEX aggregator — cross-chain trading and liquidity platform",
    role: "Backend Developer",
    stack: ["Rust", "Solana", "Solidity", "Jupiter API", "Node.js"],
    tag: "DeFi · DEX · Multi-chain",
  },
  {
    name: "Solvux",
    url: "https://www.solvux.xyz",
    image: "/projects/solvux.png",
    description:
      "Cross-chain DeFi platform supporting 50+ networks with advanced swap and bridge routing",
    role: "Solo Builder — Full Stack",
    stack: ["Next.js", "Rust", "Solana", "Solidity", "Node.js"],
    tag: "Personal Project · DeFi · DEX",
  },
  {
    name: "Shuri Education",
    url: "https://www.shurieducation.com",
    image: "/projects/shuri-education.png",
    description:
      "UK-based international relocation and education platform covering 10+ countries",
    role: "Full-Stack Developer",
    stack: ["Next.js", "Node.js", "Cloudinary"],
    tag: "Client Work · UK · Full-Stack",
  },
  {
    name: "The Offshore Lab",
    url: "https://www.theoffshorelab.com",
    image: "/projects/offshore-lab.png",
    description:
      "Enterprise website for a Nigerian/UK integrated services company featured in TechCabal and national media",
    role: "Full-Stack Developer",
    stack: ["Next.js", "Node.js"],
    tag: "Client Work · Lagos · Enterprise",
  },
  {
    name: "Kitty Couture",
    url: "https://www.kittycouturememe.com",
    image: "/projects/kitty-couture.png",
    description:
      "Solana meme coin + NFT ecosystem website for Dream Girls Digital Collectibles",
    role: "Solana Developer + Frontend",
    stack: ["Next.js", "Rust", "Solana", "Token Deployment"],
    tag: "Client Work · Solana · NFT",
  },
  {
    name: "Lupply",
    url: "https://lupply.com",
    image: "/projects/lupply.png",
    description:
      "Food delivery and business management SaaS — POS, delivery platform, restaurant management, mobile apps. Fully built solo.",
    role: "Founder & Solo Developer",
    stack: ["Flutter", "Next.js", "Node.js", "Express"],
    tag: "Founder · SaaS · Mobile",
  },
  {
    name: "NodeX iHub",
    url: "https://www.nodexihub.com",
    image: null,
    placeholderClass: "nodex",
    description:
      "Nigerian tech learning hub — built full website, student portal, and internal tools. Co-founder.",
    role: "Co-Founder & Lead Developer",
    stack: ["Next.js", "Node.js"],
    tag: "Co-Founder · EdTech · Nigeria",
  },
  {
    name: "Howell Network",
    url: "https://howell-chain.vercel.app",
    image: null,
    placeholderClass: "howell",
    description:
      "Custom blockchain built on Ethermint, Tendermint, and Cosmos SDK. Deployed on AWS EC2. Connected to MetaMask.",
    role: "Blockchain Developer & PM",
    stack: ["Cosmos SDK", "Ethermint", "Tendermint", "AWS EC2"],
    tag: "Custom Blockchain · Infrastructure",
  },
];

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: Project;
  index: number;
  inView: boolean;
}) {
  return (
    <div
      className={`project-card ${
        inView ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: inView ? `${index * 0.1}s` : undefined }}
    >
      {/* Image */}
      <div className="project-image">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.name} preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full project-placeholder ${project.placeholderClass || ""}`}
          >
            {project.name}
          </div>
        )}
        {/* Hover overlay */}
        <div className="project-overlay">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2.5 !px-5 text-sm"
          >
            <span className="flex items-center gap-2">
              Visit Live Site
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="project-body">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="project-tag">{project.tag}</span>
        </div>
        <h3 className="project-title">{project.name}</h3>
        <p className="project-role">{project.role}</p>
        <p className="project-desc">{project.description}</p>
        <div className="project-stack">
          {project.stack.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link"
        >
          View Project
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
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="projects" className="relative">
      <div className="gradient-divider" />
      <div className="section-container" ref={ref}>
        <div className="text-center mb-14">
          <div
            className={`section-label mx-auto w-fit ${
              inView ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Featured Work
          </div>
          <h2
            className={`section-title ${
              inView ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            Projects that{" "}
            <span className="gradient-text">ship & scale</span>
          </h2>
          <p
            className={`section-subtitle mx-auto ${
              inView ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            From DeFi protocols processing millions to enterprise platforms
            featured in national media.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
