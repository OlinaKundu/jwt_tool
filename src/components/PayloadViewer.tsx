import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

interface PayloadViewerProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function PayloadViewer({ value, onChange, error }: PayloadViewerProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Payload <span className="text-slate-400 ml-1 text-xs normal-case">(Data)</span></h2>
      </div>
      
      <div className="flex-grow overflow-auto relative p-4 bg-slate-900/50">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={code => Prism.highlight(code, Prism.languages.json, 'json')}
          padding={0}
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 14,
            minHeight: '100%',
          }}
          className="editor-container text-slate-100"
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
