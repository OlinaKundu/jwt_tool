import { useState } from 'react';
import { Copy } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SignatureViewerProps {
  value: string;
  isHighlighted?: boolean;
}

export function SignatureViewer({ value, isHighlighted }: SignatureViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-[#2a0f0f] border rounded-xl overflow-hidden shadow-xl transition-colors duration-300",
      isHighlighted ? "border-orange-500/80 shadow-orange-900/40" : "border-[#800020]/40"
    )}>
      <div className={cn(
        "px-4 py-3 border-b flex justify-between items-center transition-colors duration-300",
        isHighlighted ? "bg-orange-900/30 border-orange-900/50" : "bg-[#800020]/20 border-[#800020]/40"
      )}>
        <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-widest">
          Signature <span className="text-[#f5eaea]/50 ml-1 text-xs normal-case">(Verification string)</span>
        </h2>
        
        <div className="flex space-x-2 relative">
          <button 
            onClick={copyToClipboard}
            className="p-1.5 text-[#f5eaea]/70 hover:text-white hover:bg-[#9b1c31]/50 rounded transition-colors relative group"
            title="Copy signature"
            disabled={!value}
          >
            <Copy size={16} />
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#800020] text-[#f5eaea] text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-grow p-4 bg-black/20 overflow-auto">
        <div className="font-mono text-sm text-red-500 break-all whitespace-pre-wrap leading-relaxed">
          {value || <span className="text-[#f5eaea]/30 italic">No signature found</span>}
        </div>
      </div>
    </div>
  );
}
