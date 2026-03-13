"use client";

import React, { useState } from "react";
import { HeaderViewer } from "@/components/HeaderViewer";
import { PayloadViewer } from "@/components/PayloadViewer";
import { Copy, ShieldCheck, KeyRound } from "lucide-react";
import { SignJWT } from "jose";

const DEFAULT_HEADER = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify({ sub: "1234567890", name: "John Doe", iat: 1516239022 }, null, 2);

const ALGORITHMS = ['HS256', 'HS384', 'HS512', 'none'];



export default function EncoderPage() {
  const [headerJson, setHeaderJson] = useState(DEFAULT_HEADER);
  const [payloadJson, setPayloadJson] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [algorithm, setAlgorithm] = useState("HS256");
  
  const [generatedToken, setGeneratedToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleGenerate = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setGeneratedToken("");
    
    if (!secret.trim() && algorithm !== 'none') {
      setErrorMsg("Secret key is required for signing.");
      return;
    }

    try {
      const headerObj = JSON.parse(headerJson);
      const payloadObj = JSON.parse(payloadJson);
      
      // Enforce algorithm match in the header JSON view intuitively
      headerObj.alg = algorithm;
      
      let token = "";
      if (algorithm === "none") {
        const encHeader = Buffer.from(JSON.stringify(headerObj)).toString('base64url');
        const encPayload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
        token = `${encHeader}.${encPayload}.`;
      } else {
        const secretKey = new TextEncoder().encode(secret);
        token = await new SignJWT(payloadObj)
          .setProtectedHeader(headerObj)
          .sign(secretKey);
      }
      
      setGeneratedToken(token);
      setSuccessMsg("Token generated successfully!");
    } catch (error) {
       setErrorMsg("Invalid JSON or token generation failed: " + ((error as Error).message || "Unknown error"));
    }
  };

  const copyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setSuccessMsg("Copied to clipboard!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-8 flex flex-col max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f5eaea]">JWT Encoder</h1>
          <p className="text-sm text-[#f5eaea]/70 mt-1">Edit JSON data and generate a new signed JWT token.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow mb-8">
        {/* Left Side: Inputs */}
        <div className="flex flex-col space-y-6">
          <div className="flex-grow min-h-[250px] lg:min-h-[350px]">
             <HeaderViewer value={headerJson} onChange={setHeaderJson} />
          </div>
          <div className="flex-grow min-h-[350px]">
             <PayloadViewer value={payloadJson} onChange={setPayloadJson} />
          </div>
        </div>

        {/* Right Side: Options & Output */}
        <div className="flex flex-col space-y-6">
          <div className="bg-[#2a0f0f] border border-[#800020]/40 rounded-xl p-5 shadow-xl">
            <h2 className="text-sm font-semibold text-[#f5eaea] uppercase tracking-widest border-b border-[#800020]/40 pb-3 mb-5">Signing Configuration</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#f5eaea]/70 mb-1.5 uppercase tracking-wider">Algorithm</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full bg-[#1b0b0b] border border-[#800020]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5eaea] outline-none focus:ring-2 focus:ring-[#800020] appearance-none"
                >
                  {ALGORITHMS.map(alg => (
                    <option key={alg} value={alg}>{alg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#f5eaea]/70 mb-1.5 uppercase tracking-wider">Secret Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound size={16} className="text-[#f5eaea]/40" />
                  </div>
                  <input
                    type="text"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="YOUR-256-BIT-SECRET"
                    disabled={algorithm === 'none'}
                    className="w-full bg-[#1b0b0b] border border-[#800020]/50 rounded-lg pl-10 pr-3 py-2.5 text-sm text-[#f5eaea] outline-none focus:ring-2 focus:ring-[#800020] font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-[#800020] to-[#9b1c31] hover:from-[#9b1c31] hover:to-[#b22234] text-[#f5eaea] font-bold py-3 rounded-lg transition-all shadow-lg shadow-[#800020]/30 flex justify-center items-center space-x-2 mt-4"
              >
                <ShieldCheck size={18} />
                <span>Generate Token</span>
              </button>
            </div>
          </div>

          <div className="bg-[#2a0f0f] border border-[#800020]/40 rounded-xl flex flex-col flex-grow shadow-xl overflow-hidden min-h-[250px]">
            <div className="flex justify-between items-center px-4 py-3 bg-[#800020]/20 border-b border-[#800020]/40">
              <h2 className="text-sm font-semibold text-[#f5eaea] uppercase tracking-widest">Output Token</h2>
              <div className="flex items-center space-x-3">
                {errorMsg && <span className="text-red-400 text-xs font-semibold">{errorMsg}</span>}
                {successMsg && <span className="text-emerald-400 text-xs font-semibold">{successMsg}</span>}
                <button 
                  onClick={copyToken}
                  disabled={!generatedToken}
                  className="p-1.5 text-[#f5eaea]/70 hover:text-white hover:bg-[#9b1c31]/50 rounded transition-colors disabled:opacity-30"
                  title="Copy token"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 flex-grow relative group">
              <div className="absolute inset-4 font-mono text-sm break-all whitespace-pre-wrap pointer-events-none leading-relaxed select-none">
                {generatedToken && (
                  <>
                    <span className="text-yellow-300 font-bold">{generatedToken.split('.')[0]}</span>
                    <span className="text-[#f5eaea]/50">.</span>
                    <span className="text-cyan-300 font-bold">{generatedToken.split('.')[1]}</span>
                    <span className="text-[#f5eaea]/50">.</span>
                    <span className="text-red-500 font-bold">{generatedToken.split('.')[2] || ''}</span>
                  </>
                )}
              </div>
              <textarea
                value={generatedToken}
                readOnly
                className="w-full h-full resize-none bg-transparent text-transparent caret-[#f5eaea] font-mono text-sm leading-relaxed outline-none break-all z-10 relative selection:bg-[#800020]/30 selection:text-transparent"
                placeholder="Generated token will appear here..."
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
