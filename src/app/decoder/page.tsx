"use client";

import React, { useState, useEffect } from "react";
import { TokenInput } from "@/components/TokenInput";
import { HeaderViewer } from "@/components/HeaderViewer";
import { PayloadViewer } from "@/components/PayloadViewer";
import { SignatureViewer } from "@/components/SignatureViewer";
import { decodeJWT } from "@/utils/decodeJWT";

const DEFAULT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpZCI6IjEyNDciLCJuYW1lIjoiUmFtYSBLcmlzaG5hbiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9." +
  "V-LGsGfwOc6CES2qhAfRrbpf1eMuaS0DjACGA1fBp4M";

export default function DecoderPage() {
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [headerJson, setHeaderJson] = useState("");
  const [payloadJson, setPayloadJson] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [hoveredSegment, setHoveredSegment] = useState<'header' | 'payload' | 'signature' | null>(null);

  useEffect(() => {
    if (!token.trim()) {
      setHeaderJson("");
      setPayloadJson("");
      setSignatureText("");
      setErrorMsg("");
      return;
    }

    const result = decodeJWT(token);
    
    if (result.header && result.payload) {
      setHeaderJson(JSON.stringify(result.header, null, 2));
      setPayloadJson(JSON.stringify(result.payload, null, 2));
      setSignatureText(result.signature || "");
      setErrorMsg(result.error || "");
    } else {
      setHeaderJson("");
      setPayloadJson("");
      setSignatureText("");
      setErrorMsg(result.error || "Invalid JWT format");
    }
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-8 flex flex-col max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f5eaea]">JWT Decoder</h1>
          <p className="text-sm text-[#f5eaea]/70 mt-1">Paste a token to instantly decode its contents.</p>
        </div>
        <button 
          onClick={() => setToken(DEFAULT_TOKEN)}
          className="px-4 py-2 bg-[#800020]/20 hover:bg-[#800020]/40 border border-[#800020]/50 text-[#f5eaea] rounded-lg text-sm transition-colors"
        >
          Example Token
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-[500px]">
        {/* Left Side */}
        <div className="flex flex-col h-full lg:h-[calc(100vh-200px)]">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-semibold text-[#f5eaea]/70 uppercase tracking-widest">Token Input</h2>
            {errorMsg && <span className="text-red-400 text-xs font-semibold px-2 py-1 bg-red-900/40 rounded-md border border-red-900/50 max-w-[70%] truncate" title={errorMsg}>{errorMsg}</span>}
          </div>
          <div className="flex-grow">
            <TokenInput 
              value={token} 
              onChange={setToken} 
              onClear={() => setToken("")} 
              hoveredSegment={hoveredSegment}
              onHoverSegment={setHoveredSegment}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex-grow flex flex-col min-h-[200px]">
            <div className="flex-grow">
              <HeaderViewer 
                value={headerJson} 
                onChange={() => {}} 
                disabled 
                isHighlighted={hoveredSegment === 'header'} 
              />
            </div>
          </div>
          <div className="flex-grow flex flex-col min-h-[250px]">
            <div className="flex-grow">
              <PayloadViewer 
                value={payloadJson} 
                onChange={() => {}} 
                disabled 
                isHighlighted={hoveredSegment === 'payload'}
              />
            </div>
          </div>
          <div className="flex-grow flex flex-col min-h-[120px]">
            <div className="flex-grow">
               <SignatureViewer 
                 value={signatureText} 
                 isHighlighted={hoveredSegment === 'signature'}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
