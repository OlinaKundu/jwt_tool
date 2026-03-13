import React from 'react';
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
}

export function TokenInput({ value, onChange, onClear }: TokenInputProps) {
  const parts = value.split('.');
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="flex justify-between items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">Encoded</h2>
        <div className="flex space-x-2">
          <button 
            onClick={copyToClipboard}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Copy token"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={onClear}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
            title="Clear token"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="relative flex-grow p-4 overflow-hidden group">
        {/* We use a colored display overlay, but the actual input is a transparent textarea */}
        <div className="absolute inset-4 font-mono text-sm break-all whitespace-pre-wrap pointer-events-none leading-relaxed">
          {parts.length > 0 && <span className="text-red-400">{parts[0]}</span>}
          {parts.length > 1 && <span className="text-slate-500">.</span>}
          {parts.length > 1 && <span className="text-purple-400">{parts[1]}</span>}
          {parts.length > 2 && <span className="text-slate-500">.</span>}
          {parts.length > 2 && <span className="text-blue-400">{parts.slice(2).join('.')}</span>}
        </div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-full resize-none bg-transparent text-transparent caret-white outline-none font-mono text-sm leading-relaxed",
            "break-all whitespace-pre-wrap z-10 relative"
          )}
          spellCheck="false"
          placeholder="Paste JWT here..."
        />
      </div>
    </div>
  );
}
