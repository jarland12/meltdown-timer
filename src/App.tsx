import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

// --- Funciones Globales ---
const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h > 0 ? h.toString() + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// --- Iconos Flat SVG ---
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 sm:w-8 sm:h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const Logo = () => (
  <div className="bg-indigo-900 p-2 sm:p-3 rounded-xl flex-shrink-0 shadow-lg shadow-cyan-900/40">
    <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-indigo-300 tracking-widest border-2 border-indigo-400/50 p-2 sm:p-3 rounded-lg inline-block text-center flex items-center justify-center">
      MELT<span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]">DOWN</span>
    </div>
  </div>
);

interface TimerProps {
  onDelete: () => void;
}

const Timer = ({ onDelete }: TimerProps) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isWarning, setIsWarning] = useState(false);
  const [warningIntensity, setWarningIntensity] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    setIsWarning(time <= 300 && time > 0 && isRunning);
  }, [time, isRunning]);

  useEffect(() => {
    let warningInterval: ReturnType<typeof setInterval>;
    if (isWarning) {
      warningInterval = setInterval(() => {
        setWarningIntensity(prev => (prev + 1) % 3);
      }, 500);
    } else {
      setWarningIntensity(0);
    }
    return () => clearInterval(warningInterval);
  }, [isWarning]);

  const startTimer = () => { if (!isRunning && time > 0) setIsRunning(true); };
  const stopTimer = () => setIsRunning(false);

  const resetTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setIsRunning(false);
    setTime(totalSeconds);
    setIsWarning(false);
  };

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setHours(value);
    updateTime(value, minutes, seconds);
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setMinutes(value);
    updateTime(hours, value, seconds);
  };

  const handleSecondsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setSeconds(value);
    updateTime(hours, minutes, value);
  };

  const updateTime = (h: number, m: number, s: number) => {
    const totalSeconds = h * 3600 + m * 60 + s;
    setTime(totalSeconds);
  };

  // Extraer horas, minutos y segundos si no corre automáticamente
  useEffect(() => {
    if (time > 0) {
      const h = Math.floor(time / 3600);
      const m = Math.floor((time % 3600) / 60);
      const s = time % 60;
      if (!isRunning) {
        setHours(h);
        setMinutes(m);
        setSeconds(s);
      }
    }
  }, [time, isRunning]);



  const getWarningStyles = () => {
    if (!isWarning) return "bg-indigo-900/80 border-indigo-700/80 backdrop-blur-md shadow-2xl";
    const warningStyles = [
      "bg-red-900/90 border-red-600 shadow-[0_0_25px_rgba(239,68,68,0.7)]",
      "bg-red-800 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.9)] scale-[1.03]",
      "bg-red-900 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.8)]"
    ];
    return `${warningStyles[warningIntensity]} transform transition-all duration-300`;
  };

  const timerDisplayColor = isWarning
    ? (warningIntensity === 1 ? 'text-red-200 drop-shadow-[0_0_15px_rgba(254,202,202,0.9)]' : 'text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.9)]')
    : 'text-cyan-300 drop-shadow-[0_0_12px_rgba(103,232,249,0.5)]';

  return (
    <div className={`relative rounded-2xl p-6 sm:p-8 h-auto flex flex-col border-2 transition-all duration-500 w-full ${getWarningStyles()}`}>

      {isWarning && (
        <div className="absolute -top-4 right-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-full text-base sm:text-xl font-black tracking-widest animate-bounce shadow-[0_0_20px_rgba(220,38,38,0.9)] z-10 border-2 border-red-400">
          ¡ALERTA CRÍTICA!
        </div>
      )}

      {/* Encabezado del Temporizador */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-indigo-300 truncate pr-4 flex-grow text-xl sm:text-3xl lg:text-4xl tracking-wide uppercase">
          {name || "TEMPORIZADOR"}
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-indigo-400 hover:text-white font-bold transition-colors bg-indigo-950/60 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border-2 border-indigo-600/50 hover:bg-indigo-700 hover:border-indigo-400 text-sm sm:text-lg shadow-lg"
        >
          {isMinimized ? "▼ CONFIGURAR" : "▲ OCULTAR CONFIG"}
        </button>
      </div>

      {/* VISTA MINIMIZADA (NÚMEROS GIGANTES) */}
      <div className={`transition-all duration-500 overflow-hidden ${isMinimized ? 'opacity-100 max-h-[400px] mt-4' : 'opacity-0 max-h-0'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 bg-black/30 p-6 sm:p-8 rounded-2xl border border-indigo-800/30">

          <div className={`font-mono font-black tracking-tighter tabular-nums ${timerDisplayColor} text-[5rem] sm:text-[8rem] lg:text-[11rem] leading-none flex-grow text-center`}>
            {formatTime(time)}
          </div>

          <div className="flex sm:flex-col gap-4 sm:gap-6 justify-center bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/40">
            {!isRunning ? (
              <button onClick={startTimer} disabled={time === 0} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:bg-indigo-900 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                <PlayIcon />
              </button>
            ) : (
              <button onClick={stopTimer} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-amber-500 text-white hover:bg-amber-400 transition-colors border-2 border-amber-300/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse">
                <PauseIcon />
              </button>
            )}
            <button onClick={onDelete} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-red-900/80 text-red-200 hover:bg-red-700 hover:text-white transition-colors border-2 border-red-700/50 shadow-lg">
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>

      {/* VISTA COMPLETA (CONFIGURACIÓN) */}
      <div className={`transition-all duration-500 overflow-hidden ${!isMinimized ? 'opacity-100 max-h-[800px] mt-6' : 'opacity-0 max-h-0'}`}>
        <input
          type="text"
          placeholder="TÍTULO DE LA TAREA / NOMBRE"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-6 p-4 sm:p-5 bg-indigo-950/80 border-2 border-indigo-700/60 rounded-xl text-indigo-100 text-lg sm:text-2xl font-bold uppercase placeholder-indigo-600/70 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all text-center tracking-widest shadow-inner placeholder:font-bold"
        />

        <div className="flex gap-4 sm:gap-6 mb-8">
          <div className="w-1/3 flex flex-col">
            <span className="text-center text-indigo-400 font-bold mb-2 text-sm sm:text-xl tracking-widest">HORAS</span>
            <input type="number" min="0" value={hours} onChange={handleHoursChange} className="w-full p-4 sm:p-6 bg-black/40 border-2 border-indigo-700/50 rounded-xl text-indigo-100 text-center focus:outline-none focus:border-cyan-500 focus:bg-indigo-900/40 transition-all text-4xl sm:text-6xl font-mono shadow-inner font-bold" />
          </div>
          <div className="w-1/3 flex flex-col">
            <span className="text-center text-indigo-400 font-bold mb-2 text-sm sm:text-xl tracking-widest">MINUTOS</span>
            <input type="number" min="0" max="59" value={minutes} onChange={handleMinutesChange} className="w-full p-4 sm:p-6 bg-black/40 border-2 border-indigo-700/50 rounded-xl text-indigo-100 text-center focus:outline-none focus:border-cyan-500 focus:bg-indigo-900/40 transition-all text-4xl sm:text-6xl font-mono shadow-inner font-bold" />
          </div>
          <div className="w-1/3 flex flex-col">
            <span className="text-center text-indigo-400 font-bold mb-2 text-sm sm:text-xl tracking-widest">SEGUNDOS</span>
            <input type="number" min="0" max="59" value={seconds} onChange={handleSecondsChange} className="w-full p-4 sm:p-6 bg-black/40 border-2 border-indigo-700/50 rounded-xl text-indigo-100 text-center focus:outline-none focus:border-cyan-500 focus:bg-indigo-900/40 transition-all text-4xl sm:text-6xl font-mono shadow-inner font-bold" />
          </div>
        </div>

        <div className={`text-center mb-8 p-6 sm:p-8 rounded-2xl border-4 ${isWarning ? `bg-black/50 border-red-500 ${warningIntensity === 2 ? 'shadow-[inset_0_0_50px_rgba(239,68,68,0.3)]' : ''}` : 'bg-black/40 border-indigo-800 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]'}`}>
          <div className={`font-mono text-6xl sm:text-[7rem] lg:text-[9rem] font-black tracking-tighter tabular-nums leading-none ${timerDisplayColor}`}>
            {formatTime(time)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {!isRunning ? (
            <button onClick={startTimer} disabled={time === 0} className="col-span-1 flex items-center justify-center gap-3 bg-cyan-700 text-cyan-50 py-4 sm:py-6 rounded-xl font-black text-lg sm:text-2xl border-2 border-cyan-500 hover:bg-cyan-600 disabled:bg-indigo-950 disabled:border-indigo-900 disabled:text-indigo-800 transition-all shadow-lg active:scale-95">
              <PlayIcon /> INICIAR
            </button>
          ) : (
            <button onClick={stopTimer} className="col-span-1 flex items-center justify-center gap-3 bg-amber-600 text-amber-50 py-4 sm:py-6 rounded-xl font-black text-lg sm:text-2xl border-2 border-amber-400 hover:bg-amber-500 transition-all shadow-lg active:scale-95 animate-pulse">
              <PauseIcon /> PAUSAR
            </button>
          )}
          <button onClick={resetTimer} className="col-span-1 flex items-center justify-center gap-2 bg-indigo-800 text-indigo-100 py-4 sm:py-6 rounded-xl font-bold text-lg sm:text-2xl border-2 border-indigo-600 hover:bg-indigo-700 transition-all shadow-lg active:scale-95 uppercase tracking-wider">
            REINICIAR
          </button>
          <button onClick={onDelete} className="col-span-2 md:col-span-2 flex items-center justify-center gap-3 py-4 sm:py-6 rounded-xl font-black text-lg sm:text-2xl border-2 border-red-800 bg-red-950/50 text-red-300 hover:bg-red-900 hover:text-white transition-all shadow-lg active:scale-95 tracking-widest">
            <TrashIcon /> ELIMINAR TEMPORIZADOR
          </button>
        </div>
      </div>
    </div>
  );
};

interface StopwatchProps {
  onDelete: () => void;
}

const Stopwatch = ({ onDelete }: StopwatchProps) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startStopwatch = () => { if (!isRunning) setIsRunning(true); };
  const stopStopwatch = () => { setIsRunning(false); };
  const resetStopwatch = () => { setIsRunning(false); setTime(0); };



  return (
    <div className="relative rounded-2xl p-6 sm:p-8 h-auto flex flex-col border-2 transition-all duration-500 w-full bg-indigo-900/60 border-indigo-700/80 backdrop-blur-md shadow-2xl">

      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-green-300/80 truncate pr-4 flex-grow text-xl sm:text-3xl lg:text-4xl tracking-wide uppercase">
          {name || "CRONÓMETRO PROGRESSIVO"}
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-indigo-400 hover:text-white font-bold transition-colors bg-indigo-950/60 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border-2 border-indigo-600/50 hover:bg-indigo-700 hover:border-indigo-400 text-sm sm:text-lg shadow-lg"
        >
          {isMinimized ? "▼ CONFIGURAR" : "▲ OCULTAR CONFIG"}
        </button>
      </div>

      {/* VISTA MINIMIZADA (NÚMEROS GIGANTES) */}
      <div className={`transition-all duration-500 overflow-hidden ${isMinimized ? 'opacity-100 max-h-[400px] mt-4' : 'opacity-0 max-h-0'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 bg-black/30 p-6 sm:p-8 rounded-2xl border border-indigo-800/30">

          <div className="font-mono font-black tracking-tighter tabular-nums text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] text-[5rem] sm:text-[8rem] lg:text-[11rem] leading-none flex-grow text-center">
            {formatTime(time)}
          </div>

          <div className="flex sm:flex-col gap-4 sm:gap-6 justify-center bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/40">
            {!isRunning ? (
              <button onClick={startStopwatch} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-green-600 text-white hover:bg-green-500 transition-colors border-2 border-green-400/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <PlayIcon />
              </button>
            ) : (
              <button onClick={stopStopwatch} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-amber-500 text-white hover:bg-amber-400 transition-colors border-2 border-amber-300/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse">
                <PauseIcon />
              </button>
            )}
            <button onClick={onDelete} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-red-900/80 text-red-200 hover:bg-red-700 hover:text-white transition-colors border-2 border-red-700/50 shadow-lg">
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>

      {/* VISTA COMPLETA (CONFIGURACIÓN) */}
      <div className={`transition-all duration-500 overflow-hidden ${!isMinimized ? 'opacity-100 max-h-[600px] mt-6' : 'opacity-0 max-h-0'}`}>
        <input
          type="text"
          placeholder="TÍTULO / NOMBRE DEL EVENTO"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-8 p-4 sm:p-5 bg-indigo-950/80 border-2 border-indigo-700/60 rounded-xl text-indigo-100 text-lg sm:text-2xl font-bold uppercase placeholder-indigo-600/70 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/50 transition-all text-center tracking-widest shadow-inner placeholder:font-bold"
        />

        <div className="text-center mb-8 p-6 sm:p-8 rounded-2xl border-4 bg-black/40 border-indigo-800 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">
          <div className="font-mono text-6xl sm:text-[7rem] lg:text-[9rem] font-black tracking-tighter tabular-nums leading-none text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]">
            {formatTime(time)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {!isRunning ? (
            <button onClick={startStopwatch} className="col-span-1 flex items-center justify-center gap-3 bg-green-600 text-green-50 py-4 sm:py-6 rounded-xl font-black text-lg sm:text-2xl border-2 border-green-500 hover:bg-green-500 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-95">
              <PlayIcon /> INICIAR
            </button>
          ) : (
            <button onClick={stopStopwatch} className="col-span-1 flex items-center justify-center gap-3 bg-amber-600 text-amber-50 py-4 sm:py-6 rounded-xl font-black text-lg sm:text-2xl border-2 border-amber-400 hover:bg-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 animate-pulse">
              <PauseIcon /> PAUSAR
            </button>
          )}
          <button onClick={resetStopwatch} className="col-span-1 flex items-center justify-center gap-2 bg-indigo-800 text-indigo-100 py-4 sm:py-6 rounded-xl font-bold text-lg sm:text-2xl border-2 border-indigo-600 hover:bg-indigo-700 transition-all shadow-lg active:scale-95 uppercase tracking-wider">
            REINICIAR
          </button>
          <button onClick={onDelete} className="col-span-2 md:col-span-2 flex items-center justify-center gap-3 py-4 sm:py-6 rounded-xl font-black text-lg sm:text-2xl border-2 border-red-800 bg-red-950/50 text-red-300 hover:bg-red-900 hover:text-white transition-all shadow-lg active:scale-95 tracking-widest">
            <TrashIcon /> ELIMINAR CRONÓMETRO
          </button>
        </div>
      </div>
    </div>
  );
};

interface TimerItem {
  id: number;
  type: 'timer' | 'stopwatch';
}

const App = () => {
  const [timers, setTimers] = useState<TimerItem[]>([{ id: 1, type: 'timer' }]);

  const addTimer = () => {
    setTimers(prev => [...prev, { id: Date.now(), type: 'timer' }]);
  };

  const addStopwatch = () => {
    setTimers(prev => [...prev, { id: Date.now(), type: 'stopwatch' }]);
  };

  const removeTimer = (id: number) => {
    setTimers(prev => prev.filter((timer) => timer.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-gray-900 to-black p-4 sm:p-8 lg:p-12 overflow-y-auto w-full">
      <div className="mx-auto w-full flex flex-col items-center">

        {/* Encabezado Principal Super Grande */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-8 sm:mb-12 gap-6 w-full max-w-7xl">
          <div className="bg-indigo-950/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-indigo-600/50 flex flex-col sm:flex-row items-center shadow-2xl shadow-cyan-900/20 w-full xl:w-auto justify-center">
            <Logo />
            <div className="mt-4 sm:mt-0 sm:ml-8 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-cyan-300 to-indigo-400 tracking-widest drop-shadow-sm leading-none">MELTDOWN</h1>
              <p className="text-indigo-400/80 text-sm sm:text-xl font-mono uppercase tracking-[0.3em] font-bold mt-2">Gestor de Tiempo Global</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4 sm:gap-6 shrink-0 h-auto self-stretch">
            <button onClick={addTimer} className="flex-1 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-cyan-900/80 to-indigo-900/80 text-cyan-100 p-6 rounded-3xl border-2 border-cyan-800/80 hover:from-cyan-800 hover:to-indigo-800 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all">
              <span className="text-4xl sm:text-5xl font-black leading-none bg-black/30 rounded-full w-16 h-16 flex items-center justify-center mb-1">+</span>
              <span className="text-sm sm:text-lg font-black tracking-widest uppercase">Nuevo Temporizador</span>
            </button>
            <button onClick={addStopwatch} className="flex-1 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-green-900/80 to-indigo-900/80 text-green-100 p-6 rounded-3xl border-2 border-green-800/80 hover:from-green-800 hover:to-indigo-800 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all">
              <span className="text-4xl sm:text-5xl font-black leading-none bg-black/30 rounded-full w-16 h-16 flex items-center justify-center mb-1">+</span>
              <span className="text-sm sm:text-lg font-black tracking-widest uppercase">Nuevo Cronómetro</span>
            </button>
          </div>
        </div>

        {/* Contenedor Flex en UNA sola columna vertical (optimizada para retrato) */}
        <div className="flex flex-col w-full gap-8 sm:gap-10 pb-20">
          {timers.map((timer) => (
            <div key={timer.id} className="w-full">
              {timer.type === 'timer' ?
                <Timer onDelete={() => removeTimer(timer.id)} /> :
                <Stopwatch onDelete={() => removeTimer(timer.id)} />
              }
            </div>
          ))}
          {timers.length === 0 && (
            <div className="w-full text-center p-16 sm:p-32 border-4 border-dashed border-indigo-800/60 rounded-[3rem] bg-indigo-950/20 shadow-inner">
              <p className="text-indigo-400/80 font-mono text-2xl sm:text-4xl tracking-widest font-black uppercase">PANEL VACÍO - NO HAY TIEMPOS ACTIVOS</p>
              <p className="text-indigo-500/60 font-mono text-lg sm:text-2xl mt-4 font-bold">Use los controles superiores para inicializar un panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
