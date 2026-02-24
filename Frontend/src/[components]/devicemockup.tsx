"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DeviceMockup() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-24 flex justify-center items-center overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#fbbf24]/10 dark:bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container for the Devices */}
      <div className="relative w-full max-w-4xl mt-10">
        
        {/* ========================================== */}
        {/* 1. DESKTOP LAPTOP MOCKUP                   */}
        {/* ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          // CHANGED: once: false makes it re-animate on every scroll
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-[90%] md:w-[85%] mx-auto"
        >
          {/* Laptop Screen Bezel */}
          <div className="relative rounded-t-2xl md:rounded-t-3xl border-[8px] md:border-[12px] border-slate-800 dark:border-[#1a1a1a] bg-slate-800 dark:bg-[#1a1a1a] shadow-2xl">
            {/* Webcam dot */}
            <div className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/50"></div>
            
            {/* The Actual Desktop Screenshot */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm md:rounded-md bg-slate-100 dark:bg-black">
              <img 
                src="/desktop-screenshot.png" // <--- REPLACE THIS WITH YOUR LAPTOP SCREENSHOT
                alt="Desktop Application View" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Laptop Base / Keyboard Deck */}
          <div className="relative h-3 md:h-5 w-[110%] -ml-[5%] bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 rounded-b-xl md:rounded-b-2xl shadow-xl flex justify-center">
            {/* Trackpad Indent */}
            <div className="w-1/4 h-full bg-slate-400/50 dark:bg-slate-900/50 rounded-b-md md:rounded-b-lg"></div>
          </div>
        </motion.div>

        {/* ========================================== */}
        {/* 2. MOBILE PHONE MOCKUP                     */}
        {/* ========================================== */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          // CHANGED: once: false makes it re-animate on every scroll
          viewport={{ once: false, margin: "-100px" }}
          // CHANGED: Removed the continuous loop and just kept the delayed entrance
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-8 md:-bottom-16 -right-2 md:-right-8 w-[28%] min-w-[110px] max-w-[240px] z-20"
        >
          {/* Phone Bezel */}
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] border-[6px] md:border-[10px] border-slate-800 dark:border-[#1a1a1a] bg-slate-800 dark:bg-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Power/Volume Buttons (Left/Right edges) */}
            <div className="absolute top-20 -left-[10px] md:-left-[14px] w-1 h-10 bg-slate-700 dark:bg-[#2a2a2a] rounded-l-md"></div>
            <div className="absolute top-32 -left-[10px] md:-left-[14px] w-1 h-12 bg-slate-700 dark:bg-[#2a2a2a] rounded-l-md"></div>
            <div className="absolute top-24 -right-[10px] md:-right-[14px] w-1 h-16 bg-slate-700 dark:bg-[#2a2a2a] rounded-r-md"></div>

            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-4 md:h-5 bg-slate-800 dark:bg-[#1a1a1a] rounded-full z-10"></div>

            {/* The Actual Mobile Screenshot */}
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-slate-100 dark:bg-black">
              <img 
                src="/mobile-screenshot.png" // <--- REPLACE THIS WITH YOUR MOBILE SCREENSHOT
                alt="Mobile Application View" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}