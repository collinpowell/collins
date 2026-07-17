"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];



export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    // Force dark mode
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-8 sm:px-12 lg:px-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight group flex items-center"
          aria-label="Collin Powell - Home"
        >
          <span className="text-text-primary group-hover:text-accent-purple-light transition-colors duration-300">
            Collin
          </span>
          <span className="gradient-text ml-1.5">Powell</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-accent-purple to-accent-cyan group-hover:w-full transition-all duration-300" />
            </a>
          ))}

          <a
            href="mailto:collinskrubu723@gmail.com"
            className="btn-primary text-sm !py-2.5 !px-5"
          >
            <span>Let&apos;s Talk</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span
              className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pt-4 pb-6 flex flex-col gap-4 nav-blur mt-2 rounded-b-2xl mx-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:collinskrubu723@gmail.com"
            onClick={() => setMobileOpen(false)}
            className="btn-primary text-sm !py-2.5 text-center justify-center"
          >
            <span>Let&apos;s Talk</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
