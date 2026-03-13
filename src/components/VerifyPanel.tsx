import React from 'react';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { VerifyResult } from '../utils/verifyJWT';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VerifyPanelProps {
  secret: string;
  onChangeSecret: (val: string) => void;
  algorithm: string;
  onChangeAlgorithm: (val: string) => void;
  verifyResult: VerifyResult | null;
  onGenerate: () => void;
  warnings: string[];
}

const ALGORITHMS = ['HS256', 'HS384', 'HS512', 'none'];

export function VerifyPanel({
  secret,
  onChangeSecret,
  algorithm,
  onChangeAlgorithm,
  verifyResult,
  onGenerate,
  warnings
}: VerifyPanelProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Verify Signature</h2>
        
        {verifyResult && (
          <div className={cn(
            "flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide",
            verifyResult.isValid ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          )}>
            {verifyResult.isValid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            <span>{verifyResult.isValid ? "Signature Verified" : "Invalid Signature"}</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => onChangeAlgorithm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              {ALGORITHMS.map(alg => (
                <option key={alg} value={alg}>{alg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Secret Key</label>
            <input
              type="text"
              value={secret}
              onChange={(e) => onChangeSecret(e.target.value)}
              placeholder="YOUR-256-BIT-SECRET"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
            />
          </div>
          
          {warnings.length > 0 && (
            <div className="space-y-2 mt-4">
              {warnings.map((warn, i) => (
                <div key={i} className="flex items-start space-x-2 text-amber-400 bg-amber-900/20 p-2.5 rounded-lg border border-amber-900/50">
                  <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="text-xs leading-relaxed">{warn}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onGenerate}
          className="w-full mt-auto bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center space-x-2 shadow-lg shadow-blue-900/20"
        >
          <span>Re-sign & Generate Token</span>
        </button>
      </div>
    </div>
  );
}
