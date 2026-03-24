import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import { Settings, Activity, BookOpen, CheckCircle2, Info } from 'lucide-react';

// --- LOGIK ---
const calculateEff = (amp: number) => amp / Math.sqrt(2);
const calculateUpp = (amp: number) => amp * 2;
const calculatePeriod = (f: number) => (1 / f) * 1000;

// --- KOMPONENTEN ---
const Scope = ({ amp, freq, phase, showMarkers }: any) => {
  const width = 800; const height = 400; const padding = 40;
  const yScale = (v: number) => (height / 2) - (v * (height / 2 - padding) / 500);
  const xScale = (t: number) => (t * (width - 2 * padding) / 40) + padding;

  const points = Array.from({ length: 150 }, (_, i) => {
    const t = (i / 149) * 40;
    const v = amp * Math.sin(2 * Math.PI * freq * (t / 1000) + (phase * Math.PI / 180));
    return `${xScale(t)},${yScale(v)}`;
  }).join(' ');

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-2xl">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]">
        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#334155" />
        <polyline points={points} fill="none" stroke="#0ea5e9" strokeWidth="3" />
        {showMarkers && <line x1={padding} y1={yScale(calculateEff(amp))} x2={width-padding} y2={yScale(calculateEff(amp))} stroke="#f59e0b" strokeDasharray="4" />}
      </svg>
    </div>
  );
};

export default function App() {
  const [amp, setAmp] = useState(325);
  const [freq, setFreq] = useState(50);
  const [phase, setPhase] = useState(0);
  const [showMarkers, setShowMarkers] = useState(true);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-sky-400 tracking-tight">SINUS-LERNAPP</h1>
          <p className="text-slate-400">Elektrotechnik interaktiv verstehen</p>
        </header>

        <Tabs.Root defaultValue="learn">
          <Tabs.List className="flex gap-8 mb-8 border-b border-slate-800">
            <Tabs.Trigger value="learn" className="pb-4 data-[state=active]:text-sky-400 data-[state=active]:border-b-2 border-sky-400 transition-all font-bold">LERNEN</Tabs.Trigger>
            <Tabs.Trigger value="quiz" className="pb-4 data-[state=active]:text-sky-400 data-[state=active]:border-b-2 border-sky-400 transition-all font-bold">ÜBUNGEN</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="learn" className="grid grid-cols-1 lg:grid-cols-3 gap-6 outline-none">
            <div className="lg:col-span-2 space-y-6">
              <Scope amp={amp} freq={freq} phase={phase} showMarkers={showMarkers} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <h3 className="flex items-center gap-2 font-bold mb-6 text-slate-300"><Settings size={18}/> Einstellungen</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs mb-2"><span>Amplitude Û</span> <span className="text-sky-400 font-mono">{amp}V</span></div>
                      <input type="range" min="10" max="500" value={amp} onChange={e => setAmp(+e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none accent-sky-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2"><span>Frequenz f</span> <span className="text-sky-400 font-mono">{freq}Hz</span></div>
                      <input type="range" min="1" max="200" value={freq} onChange={e => setFreq(+e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none accent-sky-500" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">U_eff</p>
                    <p className="text-2xl font-bold text-amber-500">{calculateEff(amp).toFixed(1)}V</p>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Periodendauer T</p>
                    <p className="text-2xl font-bold text-purple-500">{calculatePeriod(freq).toFixed(1)}ms</p>
                  </div>
                </div>
              </div>
            </div>
            
            <aside className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold mb-4 flex items-center gap-2"><BookOpen size={18}/> Fachbegriffe</h3>
              <Accordion.Root type="single" collapsible className="space-y-3">
                <Accordion.Item value="1" className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                  <Accordion.Trigger className="w-full p-3 text-left text-sm font-semibold hover:bg-slate-900 transition-colors">Was ist der Effektivwert?</Accordion.Trigger>
                  <Accordion.Content className="p-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800">
                    Der Wert, der an einem Widerstand die gleiche Wärme erzeugt wie eine Gleichspannung. Formel: U_eff = Û / √2.
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </aside>
          </Tabs.Content>
          <Tabs.Content value="quiz">
              <div className="bg-slate-900/50 p-12 rounded-3xl border border-slate-800 text-center max-w-2xl mx-auto">
                  <CheckCircle2 size={48} className="mx-auto text-sky-500 mb-4 opacity-20" />
                  <h2 className="text-2xl font-bold mb-2">Bereit für die Prüfung?</h2>
                  <p className="text-slate-400">Hier erscheinen demnächst deine interaktiven Aufgaben.</p>
              </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
