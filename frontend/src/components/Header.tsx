import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Info, 
  User 
} from 'lucide-react';
import type { AOI } from '../types';

interface HeaderProps {
  currentAoi: AOI;
  activeTab: 'dashboard' | 'analysis' | 'routing' | 'about';
  setActiveTab: (tab: 'dashboard' | 'analysis' | 'routing' | 'about') => void;
  onOpenInfoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAoi,
  activeTab,
  setActiveTab,
  onOpenInfoModal
}) => {
  const [timeStr, setTimeStr] = useState<string>('UTC 14:32:08');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(`UTC ${now.toUTCString().slice(17, 25)}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#080e1d]/90 backdrop-blur-xl border-b border-[#1f2937] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-14 w-full px-4 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-1.5 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wider text-[#8ed5ff] uppercase leading-none font-mono">
                MULTIHAZARD
              </span>
              <span className="text-[10px] tracking-widest text-[#bdc8d1] uppercase mt-0.5 leading-none">
                Geospatial Disaster Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1 ml-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 text-xs font-semibold tracking-wide rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#3b475a] text-[#dde2f8]'
                  : 'text-[#bdc8d1] hover:text-[#dde2f8] hover:bg-[#191f2f]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-1 text-xs font-semibold tracking-wide rounded-md transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-[#3b475a] text-[#dde2f8]'
                  : 'text-[#bdc8d1] hover:text-[#dde2f8] hover:bg-[#191f2f]'
              }`}
            >
              Analysis Engine
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`px-3 py-1 text-xs font-semibold tracking-wide rounded-md transition-colors ${
                activeTab === 'routing'
                  ? 'bg-[#3b475a] text-[#dde2f8]'
                  : 'text-[#bdc8d1] hover:text-[#dde2f8] hover:bg-[#191f2f]'
              }`}
            >
              Emergency Routing
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1 text-xs font-semibold tracking-wide rounded-md transition-colors ${
                activeTab === 'about'
                  ? 'bg-[#3b475a] text-[#dde2f8]'
                  : 'text-[#bdc8d1] hover:text-[#dde2f8] hover:bg-[#191f2f]'
              }`}
            >
              About & Methodology
            </button>
          </nav>
        </div>

        {/* Center: Active AOI Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-[#151b2b] border border-white/5">
          <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="text-xs text-[#dde2f8] font-semibold tracking-wider truncate max-w-xs">
            {currentAoi.name}
          </span>
          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#38bdf8] text-[#004965] font-bold tracking-widest">
            AOI Active
          </span>
        </div>

        {/* Right HUD: Status, Telemetry Time & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Data Ready Pulse */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#151b2b] border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]"></span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#38bdf8] font-bold hidden sm:inline">
              Data Ready
            </span>
          </div>

          {/* UTC Clock */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] tracking-widest text-[#bdc8d1] bg-[#191f2f] px-2.5 py-1 rounded font-mono border border-white/5">
            <Clock className="w-3.5 h-3.5 text-[#8ed5ff]" />
            <span>{timeStr}</span>
          </div>

          {/* Icon buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenInfoModal}
              className="p-1.5 rounded hover:bg-[#242a3a] text-[#bdc8d1] hover:text-[#dde2f8] transition-colors"
              title="Operational System & Methodology Information"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Commander Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#38bdf8] text-[#00354a] flex items-center justify-center font-bold text-xs shadow-md">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
