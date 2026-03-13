"use client";

import React, { useState, useEffect } from "react";
import { TokenInput } from "@/components/TokenInput";
import { HeaderViewer } from "@/components/HeaderViewer";
import { PayloadViewer } from "@/components/PayloadViewer";
import { VerifyPanel } from "@/components/VerifyPanel";
import { decodeJWT } from "@/utils/decodeJWT";
import { generateJWT } from "@/utils/generateJWT";
import { verifyJWT, VerifyResult } from "@/utils/verifyJWT";
import { ShieldCheck } from "lucide-react";

const DEFAULT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ." +
  "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function Home() {
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [headerJson, setHeaderJson] = useState("");
  const [payloadJson, setPayloadJson] = useState("");
  
  const [headerError, setHeaderError] = useState("");
  const [payloadError, setPayloadError] = useState("");

  const [secret, setSecret] = useState("your-256-bit-secret");
  const [algorithm, setAlgorithm] = useState("HS256");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Decode on token change
  useEffect(() => {
    if (!token.trim()) {
      setHeaderJson("");
      setPayloadJson("");
      setHeaderError("");
      setPayloadError("");
      setVerifyResult(null);
      return;
    }

    const decoded = decodeJWT(token);
    if (decoded) {
      const { header, payload } = decoded;
      // Format as JSON strings
      setHeaderJson(JSON.stringify(header, null, 2));
      setPayloadJson(JSON.stringify(payload, null, 2));
      setHeaderError("");
      setPayloadError("");
      
      // update algorithm from header if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alg = (header as any)?.alg;
      if (alg) {
        setAlgorithm(alg);
      }
    } else {
      setHeaderError("Invalid Base64 in Header");
      setPayloadError("Invalid Base64 in Payload");
    }
  }, [token]);

  // Verify and Check Security on changes
  useEffect(() => {
    if (!token.trim()) {
      setWarnings([]);
      setVerifyResult(null);
      return;
    }

    // Verify token
    const result = verifyJWT(token, secret, algorithm);
    setVerifyResult(result);

    // Compute Warnings
    const newWarnings: string[] = [];
    if (algorithm.toLowerCase() === "none") {
      newWarnings.push('Critical: Algorithm "none" means no signature verification.');
    } else if (algorithm.startsWith("HS") && secret.length < 32) {
      newWarnings.push("Weak Secret: For HMAC, use a secret of at least 256 bits (32 characters).");
    }

    try {
      if (payloadJson) {
        const payloadObj = JSON.parse(payloadJson);
        if (!payloadObj.exp) {
          newWarnings.push("Warning: Token has no expiration (exp) claim.");
        } else {
          const now = Math.floor(Date.now() / 1000);
          if (payloadObj.exp < now) {
            newWarnings.push("Warning: Token is expired.");
          }
        }
      }
    } catch {
      // JSON parse error, already handled by syntax checker
    }
    
    setWarnings(newWarnings);
  }, [token, secret, algorithm, payloadJson]);

  const handleHeaderChange = (val: string) => {
    setHeaderJson(val);
    try {
      JSON.parse(val);
      setHeaderError("");
    } catch (e) {
      setHeaderError("Invalid JSON: " + (e as Error).message);
    }
  };

  const handlePayloadChange = (val: string) => {
    setPayloadJson(val);
    try {
      JSON.parse(val);
      setPayloadError("");
    } catch (e) {
      setPayloadError("Invalid JSON: " + (e as Error).message);
    }
  };

  const handleGenerate = () => {
    if (headerError || payloadError) {
      alert("Please fix JSON errors before generating token.");
      return;
    }
    
    try {
      const headerObj = JSON.parse(headerJson || "{}");
      const payloadObj = JSON.parse(payloadJson || "{}");
      
      const newToken = generateJWT(headerObj, payloadObj, secret, algorithm);
      if (newToken) {
        setToken(newToken);
      } else {
        alert("Failed to generate token.");
      }
    } catch (e) {
      alert("Error: " + (e as Error).message);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col max-w-[1600px] mx-auto">
      {/* Navbar area */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
              JWT Studio
            </h1>
            <p className="text-sm text-slate-400 font-medium">Decode, Verify, and Generate</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              setToken(DEFAULT_TOKEN);
              setSecret("your-256-bit-secret");
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-700 text-slate-300"
          >
            Example Token
          </button>
        </div>
      </header>

      {/* Main UI Grid */}
      <main className="flex-grow flex flex-col gap-6">
        
        {/* Top Section: 3 Columns Desktop / Stacked Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
          {/* Left panel: Encoded Token */}
          <div className="lg:col-span-1 h-[300px] lg:h-full">
            <TokenInput 
              value={token} 
              onChange={setToken} 
              onClear={() => setToken("")}
            />
          </div>

          {/* Middle panel: Decoded Header */}
          <div className="lg:col-span-1 h-[250px] lg:h-full">
            <HeaderViewer 
              value={headerJson} 
              onChange={handleHeaderChange} 
              error={headerError}
            />
          </div>

          {/* Right panel: Decoded Payload */}
          <div className="lg:col-span-1 h-[400px] lg:h-full">
            <PayloadViewer 
              value={payloadJson} 
              onChange={handlePayloadChange} 
              error={payloadError}
            />
          </div>
        </div>

        {/* Bottom Section: Verify Panel */}
        <div className="w-full xl:w-2/3 mx-auto mt-2">
          <VerifyPanel 
            secret={secret}
            onChangeSecret={setSecret}
            algorithm={algorithm}
            onChangeAlgorithm={setAlgorithm}
            verifyResult={verifyResult}
            onGenerate={handleGenerate}
            warnings={warnings}
          />
        </div>

      </main>

    </div>
  );
}
