import React from "react";
import { HoverFooter } from "./hover-footer";

/**
 * BrainDoc futuristic hover footer demo.
 */
export default function HoverFooterDemo() {
  return (
    <div className="w-full min-h-screen bg-[#030712] flex flex-col items-center justify-end">
      {/* Rest of the page content would go above here */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <h2 className="text-3xl font-bold text-white mb-4">Neural Platform Interface</h2>
        <p className="max-w-lg mx-auto">Scroll down to reveal the cinematic AI terminal footer.</p>
      </div>
      <HoverFooter />
    </div>
  );
}
