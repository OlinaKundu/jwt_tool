import { useState } from 'react';
import { Copy } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PayloadViewerProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
  isHighlighted?: boolean;
}

export function PayloadViewer({ value, onChange, error, disabled, isHighlighted }: PayloadViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-[#2a0f0f] border rounded-xl overflow-hidden shadow-xl transition-colors duration-300",
      isHighlighted ? "border-cyan-500/80 shadow-cyan-900/40" : "border-[#800020]/40"
    )}>
      <div className={cn(
        "px-4 py-3 border-b flex justify-between items-center transition-colors duration-300",
        isHighlighted ? "bg-cyan-900/30 border-cyan-900/50" : "bg-[#800020]/20 border-[#800020]/40"
      )}>
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Payload <span className="text-[#f5eaea]/50 ml-1 text-xs normal-case">(Data)</span></h2>
        
        <div className="flex space-x-2 relative">
          <button 
            onClick={copyToClipboard}
            className="p-1.5 text-[#f5eaea]/70 hover:text-white hover:bg-[#9b1c31]/50 rounded transition-colors relative group"
            title="Copy JSON"
            disabled={!value || value === "{}"}
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
      
      <div className="flex-grow overflow-auto relative p-4 bg-black/20">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={code => Prism.highlight(code, Prism.languages.json, 'json')}
          padding={0}
          disabled={disabled}
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 14,
            minHeight: '100%',
          }}
          className="editor-container text-[#f5eaea]"
        />
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-900/80 text-red-200 p-2 text-xs border-t border-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
