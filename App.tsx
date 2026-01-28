
import React, { useState, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Globe, Lock, Cpu, Terminal, ExternalLink, ArrowRight } from 'lucide-react';
import { analyzeUrlWithAI } from './services/geminiService';
import { ScanResult } from './types';
import RiskGauge from './components/RiskGauge';

const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      // Basic URL normalization if protocol is missing
      let targetUrl = urlInput.trim();
      if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
      }

      const scanResult = await analyzeUrlWithAI(targetUrl);
      setResult(scanResult);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during the scan.');
    } finally {
      setIsScanning(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10';
      case 'Medium': return 'text-amber-400 border-amber-400/20 bg-amber-400/10';
      case 'High': return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
      case 'Critical': return 'text-red-400 border-red-400/20 bg-red-400/10';
      default: return 'text-slate-400 border-slate-400/20 bg-slate-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 md:p-8 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            PhishingDetector <span className="text-indigo-400">AI</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
          <span>Engine v2.4.0</span>
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time DB Active</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Stop Phishing <span className="text-indigo-500">Before</span> It Hits.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our engine uses URL heuristics, domain reputation, and SSL signals to score suspicious links in seconds.
          </p>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleScan}
          className="w-full bg-slate-900/50 border border-slate-800 p-2 rounded-2xl flex items-center gap-2 mb-12 focus-within:border-indigo-500/50 transition-all shadow-2xl"
        >
          <div className="pl-4">
            <Globe className="w-5 h-5 text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Enter URL to scan (e.g. secure-bank-login.net)" 
            className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-100 placeholder:text-slate-600"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button 
            disabled={isScanning || !urlInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors active:scale-95"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                Analyze Link
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Loading State */}
        {isScanning && (
          <div className="w-full max-w-2xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/10">
                <div className="h-full bg-indigo-500 scanner-line w-full" />
              </div>
              <div className="flex flex-col items-center gap-4 py-8">
                <Cpu className="w-12 h-12 text-indigo-400 animate-pulse" />
                <p className="text-slate-300 font-medium text-center">
                  Executing URL Heuristics & Reputation Checks...
                </p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '0s'}} />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '0.2s'}} />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '0.4s'}} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Result State */}
        {result && !isScanning && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center">
                <RiskGauge score={result.riskScore} />
                <div className={`mt-4 px-4 py-1 rounded-full border text-sm font-bold uppercase tracking-widest ${getThreatColor(result.threatLevel)}`}>
                  {result.threatLevel} Threat
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Explainable Report</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">AI Analysis Summary</h3>
                <p className="text-slate-400 leading-relaxed">
                  {result.analysis.explanation}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {result.analysis.heuristics.map((h, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs border border-slate-700">
                      • {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h4 className="flex items-center gap-2 font-bold mb-6 text-slate-200">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  SSL & Domain Health
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-start p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Reputation</div>
                      <div className="text-slate-300">{result.analysis.reputation}</div>
                    </div>
                    {result.riskScore < 50 ? <CheckCircle className="text-emerald-500 w-5 h-5" /> : <AlertTriangle className="text-amber-500 w-5 h-5" />}
                  </div>
                  <div className="flex justify-between items-start p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Security Signals</div>
                      <div className="text-slate-300">{result.analysis.sslDns}</div>
                    </div>
                    {result.riskScore < 30 ? <CheckCircle className="text-emerald-500 w-5 h-5" /> : <AlertTriangle className="text-orange-500 w-5 h-5" />}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h4 className="flex items-center gap-2 font-bold mb-6 text-slate-200">
                  <Search className="w-5 h-5 text-indigo-400" />
                  URL Structure Patterns
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${result.details.hasIpAddress ? 'border-red-500/20 bg-red-500/5' : 'border-slate-800 bg-slate-950'}`}>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">Raw IP Address</span>
                    <span className={`text-sm font-semibold ${result.details.hasIpAddress ? 'text-red-400' : 'text-slate-400'}`}>
                      {result.details.hasIpAddress ? 'Detected' : 'Not Found'}
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${result.details.unusualTld ? 'border-amber-500/20 bg-amber-500/5' : 'border-slate-800 bg-slate-950'}`}>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">Unusual TLD</span>
                    <span className={`text-sm font-semibold ${result.details.unusualTld ? 'text-amber-400' : 'text-slate-400'}`}>
                      {result.details.unusualTld ? 'Suspicious' : 'Standard'}
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${result.details.isLongUrl ? 'border-amber-500/20 bg-amber-500/5' : 'border-slate-800 bg-slate-950'}`}>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">Length Check</span>
                    <span className={`text-sm font-semibold ${result.details.isLongUrl ? 'text-amber-400' : 'text-slate-400'}`}>
                      {result.details.isLongUrl ? 'Obfuscated' : 'Normal'}
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${result.details.excessiveSubdomains ? 'border-red-500/20 bg-red-500/5' : 'border-slate-800 bg-slate-950'}`}>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">Subdomain Flood</span>
                    <span className={`text-sm font-semibold ${result.details.excessiveSubdomains ? 'text-red-400' : 'text-slate-400'}`}>
                      {result.details.excessiveSubdomains ? 'Warning' : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Monitor */}
            {result.details.suspiciousKeywords.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h4 className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Suspicious Token Detection</h4>
                <div className="flex flex-wrap gap-2">
                  {result.details.suspiciousKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl mono text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      {kw}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* View Original Link (Caution) */}
            <div className="flex justify-center pt-4">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm"
              >
                Proceed to URL at your own risk
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-slate-600 text-sm">
        <p>&copy; 2024 PhishGuard Security. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
