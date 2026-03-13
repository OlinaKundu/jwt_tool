import { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TokenInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  hoveredSegment: 'header' | 'payload' | 'signature' | null;
  onHoverSegment: (segment: 'header' | 'payload' | 'signature' | null) => void;
}

export function TokenInput({ value, onChange, onClear, hoveredSegment, onHoverSegment }: TokenInputProps) {
  const [copied, setCopied] = useState(false);
  const parts = value.split('.');
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#2a0f0f] border border-[#800020]/40 rounded-xl overflow-hidden shadow-xl">
      <div className="flex justify-between items-center px-4 py-3 bg-[#800020]/20 border-b border-[#800020]/40">
        <h2 className="text-sm font-semibold text-[#f5eaea] uppercase tracking-widest">Encoded</h2>
        <div className="flex space-x-2 relative">
          <button 
            onClick={copyToClipboard}
            className="p-1.5 text-[#f5eaea]/70 hover:text-white hover:bg-[#9b1c31]/50 rounded transition-colors relative group"
            title="Copy token"
          >
            <Copy size={16} />
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#800020] text-[#f5eaea] text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                Copied!
              </span>
            )}
          </button>
          <button 
            onClick={onClear}
            className="p-1.5 text-[#f5eaea]/70 hover:text-red-400 hover:bg-[#9b1c31]/50 rounded transition-colors"
            title="Clear token"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="relative flex-grow p-4 overflow-hidden group">
        {/* We use a colored display overlay, but the actual input is a transparent textarea */}
        <div className="absolute inset-4 font-mono text-sm break-all whitespace-pre-wrap pointer-events-none leading-relaxed select-none">
          {parts.length > 0 && (
            <span 
              className={cn(
                "transition-colors duration-200 pointer-events-auto",
                hoveredSegment === 'header' ? "text-yellow-300 font-bold" : "text-yellow-500"
              )}
              onMouseEnter={() => onHoverSegment('header')}
              onMouseLeave={() => onHoverSegment(null)}
            >
              {parts[0]}
            </span>
          )}
          {parts.length > 1 && <span className="text-[#f5eaea]/50 pointer-events-auto">.</span>}
          {parts.length > 1 && (
            <span 
              className={cn(
                "transition-colors duration-200 pointer-events-auto",
                hoveredSegment === 'payload' ? "text-cyan-300 font-bold" : "text-cyan-500"
              )}
              onMouseEnter={() => onHoverSegment('payload')}
              onMouseLeave={() => onHoverSegment(null)}
            >
              {parts[1]}
            </span>
          )}
          {parts.length > 2 && <span className="text-[#f5eaea]/50 pointer-events-auto">.</span>}
          {parts.length > 2 && (
            <span 
              className={cn(
                "transition-colors duration-200 pointer-events-auto",
                hoveredSegment === 'signature' ? "text-orange-400 font-bold" : "text-red-500"
              )}
              onMouseEnter={() => onHoverSegment('signature')}
              onMouseLeave={() => onHoverSegment(null)}
            >
              {parts.slice(2).join('.')}
            </span>
          )}
        </div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-full resize-none bg-transparent text-transparent caret-[#f5eaea] outline-none font-mono text-sm leading-relaxed",
            "break-all whitespace-pre-wrap z-10 relative selection:bg-[#800020]/30 selection:text-transparent"
          )}
          spellCheck="false"
          placeholder="Paste JWT here..."
        />
      </div>
    </div>
  );
}
