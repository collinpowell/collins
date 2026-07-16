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

type FilterTag = "All" | "Founder" | "Client Work" | "Personal / Web3";

interface Project {
  name: string;
  url: string;
  image: string | null;
  placeholderClass?: string;
  description: string;
  role: string;
  stack: string[];
  tag: string;
  filter: FilterTag[];
}

const projects: Project[] = [
  {
    name: "Lupply",
    url: "https://lupply.com",
    image: "/projects/lupply.png",
    description:
      "Multi-platform SaaS ecosystem — Business Management, POS, food delivery, and logistics. Serving 5+ enterprise clients. Solely built, deployed, and maintained.",
    role: "Founder & Lead Engineer",
    stack: ["Next.js", "Node.js", "Flutter", "Go", "Docker"],
    tag: "Founder · SaaS · Cloud-Native",
    filter: ["All", "Founder"],
  },
  {
    name: "Lupply App",
    url: "https://play.google.com/store/apps/details?id=com.cpx.lupply",
    image: "/projects/lupply-app.png",
    placeholderClass: "lupply",
    description:
      "Mobile application for the Lupply Business ecosystem. Live on Google Play Store and Apple App Store. CI/CD managed via Fastlane.",
    role: "Founder & Lead Engineer",
    stack: ["Flutter", "Fastlane", "iOS", "Android"],
    tag: "Founder · Mobile App",
    filter: ["All", "Founder"],
  },
  {
    name: "Lupply Food",
    url: "https://play.google.com/store/apps/details?id=com.lupply.lupply_food",
    image: null,
    placeholderClass: "lupply-food",
    description:
      "Food delivery marketplace app. Live on Google Play Store and Apple App Store with active daily orders.",
    role: "Founder & Lead Engineer",
    stack: ["Flutter", "Node.js", "Fastlane"],
    tag: "Founder · Mobile · Food Delivery",
    filter: ["All", "Founder"],
  },
  {
    name: "Lupply Ride",
    url: "https://play.google.com/store/apps/details?id=com.lupply.lupply_ride&hl=en",
    image: null,
    placeholderClass: "lupply-ride",
    description:
      "Delivery and logistics platform. Real-time GPS routing and fleet management, live on Google Play Store.",
    role: "Founder & Lead Engineer",
    stack: ["Flutter", "Node.js", "Real-time GPS"],
    tag: "Founder · Logistics · Mobile",
    filter: ["All", "Founder"],
  },
  {
    name: "Lupply Windows App",
    url: "https://apps.microsoft.com/detail/9nxv0wn9cznn?hl=en-GB&gl=NG",
    image: "/projects/lupply-windows.png",
    placeholderClass: "lupply",
    description:
      "Desktop POS application for Lupply's ecosystem. Live on Microsoft Store.",
    role: "Founder & Lead Engineer",
    stack: ["Flutter", "Windows"],
    tag: "Founder · Desktop App",
    filter: ["All", "Founder"],
  },
  {
    name: "NodeX iHub",
    url: "https://node-x-frontend.vercel.app/",
    image: null,
    placeholderClass: "nodex",
    description:
      "EdTech & IoT product studio. Delivered ESP32-based smart home devices, a sensor-driven farm irrigation system, and a coin-operated vending device. Also served 200+ active students.",
    role: "Co-Founder & Lead Engineer",
    stack: ["C/C++", "ESP32", "FreeRTOS", "Next.js", "Node.js"],
    tag: "Co-Founder · IoT · EdTech",
    filter: ["All", "Founder"],
  },
  {
    name: "Shuri Education",
    url: "https://www.shurieducation.com",
    image: "/projects/shuri-education.png",
    description:
      "UK-based ed-tech platform. Managed server surge during launch month, optimized operations, and enhanced customer service via a proprietary dashboard and sophisticated APIs.",
    role: "Full-Stack Developer",
    stack: ["Next.js", "Node.js", "Cloudinary", "Vercel"],
    tag: "Client Work · Enterprise · SaaS",
    filter: ["All", "Client Work"],
  },
  {
    name: "The Offshore Lab",
    url: "https://www.theoffshorelab.com",
    image: "/projects/offshore-lab.png",
    description:
      "Enterprise platform for a Nigerian/UK integrated services company. Delivered scalable infrastructure featured in TechCabal and national media.",
    role: "Full-Stack Developer",
    stack: ["Next.js", "Node.js", "Vercel"],
    tag: "Client Work · Lagos · Enterprise",
    filter: ["All", "Client Work"],
  },
  {
    name: "Pivot Technical",
    url: "https://pivottechnical.com",
    image: null,
    placeholderClass: "pivot",
    description:
      "Engineered scalable technical infrastructure and core platform features for an enterprise client.",
    role: "Software Engineer",
    stack: ["React", "Node.js", "Next.js", "Postgres"],
    tag: "Client Work · Enterprise",
    filter: ["All", "Client Work"],
  },
  {
    name: "Lunar Finance",
    url: "https://lunarfinance.io",
    image: "/projects/lunar-finance.png",
    description:
      "Multi-chain DEX aggregator processing over $1M+ in trading volume and serving 350k+ users with high-throughput cross-chain routing.",
    role: "Backend Engineer",
    stack: ["Rust", "Go", "Solana", "Jupiter API", "Node.js"],
    tag: "DeFi · DEX · High-Throughput",
    filter: ["All", "Personal / Web3"],
  },
  {
    name: "Solvux",
    url: "https://solvux-frontend.vercel.app/",
    image: "/projects/solvux.png",
    description:
      "Cross-chain DeFi platform supporting 50+ networks. Optimized swap and bridge routing for scalable Web3 infrastructure.",
    role: "Solo Builder — Full Stack",
    stack: ["Next.js", "Rust", "Solana", "Solidity", "Node.js"],
    tag: "Personal Project · DeFi · DEX",
    filter: ["All", "Personal / Web3"],
  },
  {
    name: "Kitty Couture",
    url: "https://www.kittycouturememe.com",
    image: "/projects/kitty-couture.png",
    description:
      "Solana ecosystem for Digital Collectibles. Successfully deployed smart contracts and token economics, enabling the project to raise significant seed funding.",
    role: "Solana Developer + Frontend",
    stack: ["Next.js", "Rust", "Solana", "Token Deployment"],
    tag: "Client Work · Web3 · Smart Contracts",
    filter: ["All", "Personal / Web3"],
  },
];

const FILTER_TABS: FilterTag[] = ["All", "Founder", "Client Work", "Personal / Web3"];

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
      style={{ animationDelay: inView ? `${index * 0.08}s` : undefined }}
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
  const [activeFilter, setActiveFilter] = useState<FilterTag>("All");

  const filtered = projects.filter((p) => p.filter.includes(activeFilter));

  return (
    <section id="projects" className="relative">
      <div className="gradient-divider" />
      <div className="section-container" ref={ref}>
        <div className="text-center mb-10">
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
            <span className="gradient-text">ship &amp; scale</span>
          </h2>
          <p
            className={`section-subtitle mx-auto ${
              inView ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            From IoT hardware to DeFi protocols processing millions to enterprise platforms featured in national media.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={`flex flex-wrap justify-center gap-2 mb-10 ${inView ? "animate-fade-in-up delay-300" : "opacity-0"}`}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                activeFilter === tab
                  ? "bg-accent-purple text-white border-accent-purple shadow-lg"
                  : "bg-transparent text-text-secondary border-[var(--border-color)] hover:border-accent-purple hover:text-accent-purple-light"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
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
