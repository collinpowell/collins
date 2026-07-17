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

interface ProofItem {
  image: string;
  title: string;
  category: string;
  colSpan?: boolean;
}

const proofItems: ProofItem[] = [
  {
    image: "/proof/Gov_Contract_Traffic_Light_Fixing_1.jpeg",
    title: "Mission-Critical B2G Infrastructure",
    category: "Government Contracts",
    colSpan: true,
  },
  {
    image: "/proof/NodeX_Snooker_Vending_System.jpeg",
    title: "Custom IoT Snooker Vending",
    category: "Commercial Hardware",
  },
  {
    image: "/proof/Lupply_School_Pitch_1.jpeg",
    title: "B2B SaaS Pitches & Demos",
    category: "Product Adoption",
  },
  {
    image: "/proof/ESP32_Smart_Bulb_Socket.jpeg",
    title: "ESP32 Full-Stack IoT",
    category: "Hardware & Firmware",
  },
  {
    image: "/proof/Bluetooth_Robot_Car_App.jpeg",
    title: "Mobile-Integrated Robotics",
    category: "IoT Prototyping",
  },
  {
    image: "/proof/Lupply_Fish_Farm_Sales.jpeg",
    title: "Real-World Software Ops",
    category: "SaaS Execution",
    colSpan: true,
  },
  {
    image: "/proof/Hardware_Teaching_Class.jpeg",
    title: "Engineering Leadership",
    category: "Team & Training",
  },
  {
    image: "/proof/Remote_Workstation_Setup_3.jpeg",
    title: "Professional Remote Workstation",
    category: "Developer Infrastructure",
  },
];

export default function ProofOfWorkSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="proof" className="relative py-24 bg-neutral-950 text-white overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 transform ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Proof of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Work</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            I don&apos;t just write code behind a screen. I build physical hardware, execute government contracts, pitch to B2B clients, and lead engineering teams. Here is the proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proofItems.map((item, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 ${
                item.colSpan ? "md:col-span-2" : ""
              } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] w-full relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              </div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full mb-3 backdrop-blur-md border border-emerald-500/30">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
