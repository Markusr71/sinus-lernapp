import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import { Settings, BookOpen, Activity, Info, ChevronDown } from 'lucide-react';
import '../index.css';

// --- MATH LOGIC ---
const calculateEff = (amp: number) => amp / Math.sqrt(2);
const calculateUpp = (amp: number) => amp * 2;
const calculatePeriod = (f: number) => (1 / f) * 1000;

// --- SCOPE COMPONENT ---
const Scope = ({ amp, freq, phase, showMarkers }: any) => {
  const width = 800; const height = 400; const padding = 50;
  const yScale = (v: number) => (height / 2) - (v * (height / 2 - padding) / 500);
  const xScale = (t: number) => (t * (width - 2 * padding) / 40) + padding;

  const points = Array.from({ length: 200 }, (_, i) => {
    const t = (i / 199) * 40;
    const v = amp * Math.sin(2 * Math.PI * freq * (t / 1000) + (phase * Math.PI / 180));
    return `${xScale(t)},${yScale(v)}`;
  }).join(' ');

  const uEff = calculateEff(amp);

  return (
    <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-4 right-6 text-[10px] font-mono text-slate-500 italic">
        u(t) = {amp}V · sin(2π · {freq}Hz · t)
      </div>
      <h3 className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">Oszilloskop-Ansicht</h3>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-[0_0_15px_rgba(14,165,233,0.2)]">
        {/* Grid Lines */}
        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#334155" strokeWidth="1" />
        {[0, 10, 20, 30, 40].map(ms => (
          <text key={ms} x={xScale(ms)} y={height-10} fontSize="12" fill="#475569" textAnchor="middle">{ms}ms</text>
        ))}
        {[-325, 0, 325].map(v => (
          <text key={v} x={padding-10} y={yScale(v)} fontSize="12" fill="#475569" textAnchor="end">{v}V</text>
        ))}

        {/* Dynamic Markers */}
        {showMarkers && (
          <>
            <line x1={padding} y1={yScale(uEff)} x2={width-padding} y2={yScale(uEff)} stroke="#f59e0b" strokeDasharray="4" opacity="0.6" />
            <line x1={padding} y1={yScale(-uEff)} x2={width-padding} y2={yScale(-uEff)} stroke="#f59e0b" strokeDasharray="4" opacity="0.6" />
          </>
        )}

        {/* The Wave */}
        <polyline points={points} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinejoin="round" />
      </svg>

      <div className="flex gap-6 mt-4 border-t border-slate-800 pt-4 text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-sky-500 rounded-full"></div> Spannung u(t)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-0.5 border-t border-dashed border-amber-500"></div> Effektivwert U_eff</div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [amp, setAmp] = useState(325);
  const [freq, setFreq] = useState(50);
  const [phase, setPhase] = useState(0);
  const [showMarkers, setShowMarkers] = useState(true);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-12 font-sans selection:bg-sky-500/30">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-sky-400 tracking-tight mb-2">Sinus-Lernapp – Elektrotechnik</h1>
          <p className="text-slate-500 text-sm">Lerne sinusförmige Spannungen und Ströme zu verstehen und zu berechnen.</p>
        </header>

        <Tabs.Root defaultValue="learn">
          <Tabs.List className="flex gap-10 mb-10 border-b border-slate-800/50">
            <Tabs.Trigger value="learn" className="pb-4 text-sm font-bold tracking-wide data-[state=active]:text-sky-400 data-[state=active]:border-b-2 border-sky-400 transition-all outline-none opacity-60 data-[state=active]:opacity-100">Lernen & Verstehen</Tabs.Trigger>
            <Tabs.Trigger value="quiz" className="pb-4 text-sm font-bold tracking-wide data-[state=active]:text-sky-400 data-[state=active]:border-b-2 border-sky-400 transition-all outline-none opacity-60 data-[state=active]:opacity-100 uppercase italic">Aufgaben & Üben</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="learn" className="grid grid-cols-1 lg:grid-cols-12 gap-8 outline-none animate-in fade-in duration-500">
            <div className="lg:col-span-8 space-y-8">
              <Scope amp={amp} freq={freq} phase={phase} showMarkers={showMarkers} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800/50">
                  <h3 className="text-sm font-bold mb-8 flex items-center gap-3 text-slate-300">Signal-Einstellungen</h3>
                  <div className="space-y-8">
                    <Slider label="Scheitelwert (Amplitude) Û" val={amp} set={setAmp} min={10} max={500} unit="V" color="text-sky-400" />
                    <Slider label="Frequenz f" val={freq} set={setFreq} min={1} max={200} unit="Hz" color="text-sky-400" />
                    <Slider label="Phasenwinkel φ" val={phase} set={setPhase} min={-180} max={180} unit="°" color="text-sky-400" />
                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                      <input type="checkbox" checked={showMarkers} onChange={e => setShowMarkers(e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-sky-500/20" />
                      <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Markierungen anzeigen</span>
                    </label>
                  </div>
                </div>

                {/* Value Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <ValueCard label="Effektivwert U_eff" val={calculateEff(amp).toFixed(1)} unit="V" formula="= Û / √2" color="text-amber-500" />
                  <ValueCard label="Spitzen-Spitzen-Wert U_pp" val={calculateUpp(amp)} unit="V" formula="= 2 × Û" color="text-emerald-500" />
                  <ValueCard label="Periodendauer T" val={calculatePeriod(freq).toFixed(0)} unit="ms" formula="= 1 / f" color="text-purple-400" />
                  <ValueCard label="Frequenz f" val={freq} unit="Hz" formula="= 1 / T" color="text-sky-400" />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800/50 h-full">
                <h3 className="text-sm font-bold mb-6 text-slate-300">Fachbegriffe erklärt</h3>
                <Accordion.Root type="single" collapsible className="space-y-4">
                  <InfoItem value="1" title="Û Scheitelwert / Amplitude" content="Das ist der größte Wert, den die Spannung erreicht – der höchste Punkt der Kurve." />
                  <InfoItem value="2" title="U_eff Effektivwert" content="Der Wert, der an einem Widerstand die gleiche Wärme erzeugt wie Gleichspannung." />
                  <InfoItem value="3" title="T Periodendauer" content="Die Zeit, die eine vollständige Schwingung (einmal hoch, einmal runter) benötigt." />
                </Accordion.Root>
              </div>
            </aside>
          </Tabs.Content>
          <Tabs.Content value="quiz">
            <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center">
              <p className="text-slate-500 font-medium italic">Übungs-Bereich wird gerade vorbereitet...</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

// --- HELPERS ---
const Slider = ({ label, val, set, min, max, unit, color }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      <span className={`font-mono font-black text-sm ${color}`}>{val} {unit}</span>
    </div>
    <input type="range" min={min} max={max} value={val} onChange={e => set(+e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none" />
    <div className="flex justify-between text-[9px] text-slate-600 font-bold px-1"><span>{min}{unit}</span><span>{max}{unit}</span></div>
  </div>
);

const ValueCard = ({ label, val, unit, formula, color }: any) => (
  <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/60 flex flex-col justify-between hover:border-slate-700 transition-colors">
    <div>
      <p className="text-[9px] font-bold text-slate-500 uppercase mb-2 tracking-tighter">{label}</p>
      <p className={`text-xl font-black tracking-tight ${color}`}>{val} <span className="text-xs">{unit}</span></p>
    </div>
    <p className="text-[9px] font-mono text-slate-700 mt-3">{formula}</p>
  </div>
);

const InfoItem = ({ value, title, content }: any) => (
  <Accordion.Item value={value} className="bg-slate-950/40 rounded-xl border border-slate-800/40 overflow-hidden">
    <Accordion.Trigger className="w-full p-4 text-left text-xs font-bold hover:bg-slate-800/30 transition-all flex justify-between items-center group">
      {title} <ChevronDown size={14} className="text-slate-600 group-data-[state=open]:rotate-180 transition-transform" />
    </Accordion.Trigger>
    <Accordion.Content className="p-4 pt-0 text-[11px] leading-relaxed text-slate-400">
      {content}
    </Accordion.Content>
  </Accordion.Item>
);

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
