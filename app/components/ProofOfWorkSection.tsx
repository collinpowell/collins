"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ProofItem {
  image: string;
  title: string;
  category: string;
  colSpan?: boolean;
  rowSpan?: boolean;
}

const proofItems: ProofItem[] = [
  {
    image: "/proofs/Gov_Contract_Traffic_Light_Fixing_1.jpeg",
    title: "Mission-Critical B2G Infrastructure",
    category: "Government Contracts",
    colSpan: true,
  },
  {
    image: "/proofs/NodeX_Snooker_Vending_System.jpeg",
    title: "Custom IoT Snooker Vending",
    category: "Commercial Hardware",
    rowSpan: true,
  },
  {
    image: "/proofs/Lupply_School_Pitch_1.jpeg",
    title: "B2B SaaS Pitches & Demos",
    category: "Product Adoption",
  },
  {
    image: "/proofs/ESP32_Smart_Bulb_Socket.jpeg",
    title: "ESP32 Full-Stack IoT",
    category: "Hardware & Firmware",
  },
  {
    image: "/proofs/Bluetooth_Robot_Car_App.jpeg",
    title: "Mobile-Integrated Robotics",
    category: "IoT Prototyping",
  },
  {
    image: "/proofs/Lupply_Fish_Farm_Sales.jpeg",
    title: "Real-World Software Ops",
    category: "SaaS Execution",
    colSpan: true,
  },
  {
    image: "/proofs/Hardware_Teaching_Class.jpeg",
    title: "Engineering Leadership",
    category: "Team & Training",
  },
  {
    image: "/proofs/Remote_Workstation_Setup_3.jpeg",
    title: "Professional Remote Workstation",
    category: "Developer Infrastructure",
  },
];

export default function ProofOfWorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="proof" className="relative py-32 bg-bg-primary overflow-hidden" ref={containerRef}>
      <div className="section-container relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <div className="section-label mx-auto mb-6">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Evidence
          </div>
          <h2 className="section-title">
            Proof of <span className="gradient-text">Work</span>
          </h2>
          <p className="section-subtitle mx-auto">
            I don&apos;t just write code behind a screen. I build physical hardware, execute government contracts, pitch to B2B clients, and lead engineering teams. Here is the proof.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {proofItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden bg-bg-card border border-border-color transition-all duration-500 hover:border-accent-purple hover:shadow-[0_0_40px_rgba(124,58,237,0.15)] ${
                item.colSpan ? "md:col-span-2" : ""
              } ${item.rowSpan ? "md:row-span-2" : ""}`}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              </div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-4 py-1.5 bg-accent-purple/10 text-accent-purple-light text-xs font-semibold rounded-full mb-4 backdrop-blur-md border border-accent-purple/20">
                  {item.category}
                </span>
                <h3 className="text-2xl font-bold text-text-primary tracking-wide">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
