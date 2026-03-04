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
  const [isMinimized, setIsMinimized] = useState(true);

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
    if (!isWarning) return "bg-indigo-900/90 border-indigo-700/80 shadow-xl";
    const warningStyles = [
      "bg-red-900/90 border-red-600 shadow-red-900/50 shadow-xl",
      "bg-red-800 border-red-500 shadow-red-900/80 shadow-2xl scale-[1.01]",
      "bg-red-900 border-yellow-500 shadow-yellow-900/50 shadow-xl"
    ];
    return `${warningStyles[warningIntensity]} transform transition-all duration-300`;
  };

  const timerDisplayColor = isWarning
    ? (warningIntensity === 1 ? 'text-red-300' : 'text-cyan-400')
    : 'text-cyan-400';

  return (
    <div className={`relative rounded-xl p-4 sm:p-5 h-auto flex flex-col border-2 transition-all duration-300 w-full ${getWarningStyles()}`}>

      {isWarning && (
        <div className="absolute -top-3 right-4 bg-red-600 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-black tracking-widest shadow-md z-10 border border-red-400">
          ¡ALERTA!
        </div>
      )}

      {/* Encabezado del Temporizador */}
      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="font-bold text-indigo-200 truncate pr-2 flex-grow text-base sm:text-xl tracking-wide uppercase">
          {name || "TEMPORIZADOR"}
        </div>

        {/* Controles en el encabezado (visibles solo cuando está minimizado) */}
        {isMinimized && (
          <div className="flex flex-row gap-1 sm:gap-2 justify-center bg-indigo-950/40 p-1 sm:p-1.5 rounded-lg border border-indigo-800/30">
            {!isRunning ? (
              <button onClick={startTimer} disabled={time === 0} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded bg-cyan-700 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:bg-indigo-900 border border-cyan-500 shadow-sm">
                <PlayIcon />
              </button>
            ) : (
              <button onClick={stopTimer} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded bg-amber-600 text-white hover:bg-amber-500 transition-colors border border-amber-400 shadow-sm">
                <PauseIcon />
              </button>
            )}
            <button onClick={onDelete} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded bg-red-900/90 text-red-200 hover:bg-red-700 hover:text-white transition-colors border border-red-700 shadow-sm">
              <TrashIcon />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-indigo-300 hover:text-white font-bold transition-colors bg-indigo-950/80 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-md border border-indigo-600/50 hover:bg-indigo-700 hover:border-indigo-400 text-[0.65rem] sm:text-sm shadow-md whitespace-nowrap"
        >
          {isMinimized ? "▼ CONFIG" : "▲ OCULTAR"}
        </button>
      </div>

      {/* VISTA MINIMIZADA (NÚMEROS SOLOS) */}
      <div className={`transition-all duration-300 overflow-hidden ${isMinimized ? 'opacity-100 max-h-[200px] mt-2' : 'opacity-0 max-h-0'}`}>
        <div className="flex flex-row items-center justify-center bg-black/40 p-2 sm:p-3 rounded-xl border border-indigo-800/50">
          <div className={`font-mono font-black tracking-tighter tabular-nums ${timerDisplayColor} text-4xl sm:text-6xl lg:text-7xl leading-none text-center`}>
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* VISTA COMPLETA (CONFIGURACIÓN COMPACTA) */}
      <div className={`transition-all duration-300 overflow-hidden ${!isMinimized ? 'opacity-100 max-h-[600px] mt-3' : 'opacity-0 max-h-0'}`}>
        <input
          type="text"
          placeholder="TÍTULO DE LA TAREA / NOMBRE"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 bg-indigo-950/90 border border-indigo-700/80 rounded-lg text-indigo-100 text-base sm:text-lg font-bold uppercase placeholder-indigo-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center tracking-wider shadow-inner"
        />

        <div className="flex gap-3 sm:gap-4 mb-5">
          <div className="w-1/3 flex flex-col">
            <span className="text-center text-indigo-400 font-bold mb-1 text-xs tracking-wider">HORAS</span>
            <input type="number" min="0" value={hours} onChange={handleHoursChange} className="w-full p-2 sm:p-3 bg-black/50 border border-indigo-700/70 rounded-lg text-indigo-100 text-center focus:outline-none focus:border-cyan-500 focus:bg-indigo-900/60 transition-all text-2xl sm:text-4xl font-mono shadow-inner font-bold" />
          </div>
          <div className="w-1/3 flex flex-col">
            <span className="text-center text-indigo-400 font-bold mb-1 text-xs tracking-wider">MINUTOS</span>
            <input type="number" min="0" max="59" value={minutes} onChange={handleMinutesChange} className="w-full p-2 sm:p-3 bg-black/50 border border-indigo-700/70 rounded-lg text-indigo-100 text-center focus:outline-none focus:border-cyan-500 focus:bg-indigo-900/60 transition-all text-2xl sm:text-4xl font-mono shadow-inner font-bold" />
          </div>
          <div className="w-1/3 flex flex-col">
            <span className="text-center text-indigo-400 font-bold mb-1 text-xs tracking-wider">SEGUNDOS</span>
            <input type="number" min="0" max="59" value={seconds} onChange={handleSecondsChange} className="w-full p-2 sm:p-3 bg-black/50 border border-indigo-700/70 rounded-lg text-indigo-100 text-center focus:outline-none focus:border-cyan-500 focus:bg-indigo-900/60 transition-all text-2xl sm:text-4xl font-mono shadow-inner font-bold" />
          </div>
        </div>

        <div className={`text-center mb-4 p-3 sm:p-4 rounded-xl border-2 ${isWarning ? `bg-black/60 border-red-600` : 'bg-black/50 border-indigo-800'}`}>
          <div className={`font-mono text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter tabular-nums leading-none ${timerDisplayColor}`}>
            {formatTime(time)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {!isRunning ? (
            <button onClick={startTimer} disabled={time === 0} className="col-span-1 flex items-center justify-center gap-2 bg-cyan-700 text-cyan-50 py-3 rounded-lg font-bold text-sm sm:text-base border border-cyan-500 hover:bg-cyan-600 disabled:bg-indigo-950 disabled:border-indigo-900 disabled:text-indigo-800 transition-colors shadow-md active:scale-95">
              <PlayIcon /> INICIAR
            </button>
          ) : (
            <button onClick={stopTimer} className="col-span-1 flex items-center justify-center gap-2 bg-amber-600 text-amber-50 py-3 rounded-lg font-bold text-sm sm:text-base border border-amber-500 hover:bg-amber-500 transition-colors shadow-md active:scale-95">
              <PauseIcon /> PAUSAR
            </button>
          )}
          <button onClick={resetTimer} className="col-span-1 flex items-center justify-center gap-1 bg-indigo-800 text-indigo-100 py-3 rounded-lg font-bold text-sm sm:text-base border border-indigo-600 hover:bg-indigo-700 transition-colors shadow-md active:scale-95 uppercase tracking-wide">
            REINICIAR
          </button>
          <button onClick={onDelete} className="col-span-2 md:col-span-2 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm sm:text-base border border-red-800 bg-red-950/70 text-red-200 hover:bg-red-800 hover:text-white transition-colors shadow-md active:scale-95 tracking-wider">
            <TrashIcon /> ELIMINAR
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
  const [isMinimized, setIsMinimized] = useState(true);

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
    <div className="relative rounded-xl p-4 sm:p-5 h-auto flex flex-col border border-indigo-700/80 shadow-xl w-full bg-indigo-900/80">

      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="font-bold text-green-300/90 truncate pr-2 flex-grow text-base sm:text-xl tracking-wide uppercase">
          {name || "CRONÓMETRO"}
        </div>

        {/* Controles en el encabezado (visibles solo cuando está minimizado) */}
        {isMinimized && (
          <div className="flex flex-row gap-1 sm:gap-2 justify-center bg-indigo-950/40 p-1 sm:p-1.5 rounded-lg border border-indigo-800/30">
            {!isRunning ? (
              <button onClick={startStopwatch} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded bg-green-700 text-white hover:bg-green-600 transition-colors border border-green-500 shadow-sm">
                <PlayIcon />
              </button>
            ) : (
              <button onClick={stopStopwatch} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded bg-amber-600 text-white hover:bg-amber-500 transition-colors border border-amber-400 shadow-sm">
                <PauseIcon />
              </button>
            )}
            <button onClick={onDelete} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded bg-red-900/90 text-red-200 hover:bg-red-700 hover:text-white transition-colors border border-red-700 shadow-sm">
              <TrashIcon />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-indigo-300 hover:text-white font-bold transition-colors bg-indigo-950/80 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-md border border-indigo-600/50 hover:bg-indigo-700 hover:border-indigo-400 text-[0.65rem] sm:text-sm shadow-md whitespace-nowrap"
        >
          {isMinimized ? "▼ CONFIG" : "▲ OCULTAR"}
        </button>
      </div>

      {/* VISTA MINIMIZADA (NÚMEROS SOLOS) */}
      <div className={`transition-all duration-300 overflow-hidden ${isMinimized ? 'opacity-100 max-h-[200px] mt-2' : 'opacity-0 max-h-0'}`}>
        <div className="flex flex-row items-center justify-center bg-black/40 p-2 sm:p-3 rounded-xl border border-indigo-800/50">
          <div className="font-mono font-black tracking-tighter tabular-nums text-green-400 text-4xl sm:text-6xl lg:text-7xl leading-none text-center">
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* VISTA COMPLETA */}
      <div className={`transition-all duration-300 overflow-hidden ${!isMinimized ? 'opacity-100 max-h-[600px] mt-3' : 'opacity-0 max-h-0'}`}>
        <input
          type="text"
          placeholder="TÍTULO DEL EVENTO"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 bg-indigo-950/90 border border-indigo-700/80 rounded-lg text-indigo-100 text-base sm:text-lg font-bold uppercase placeholder-indigo-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-center tracking-wider shadow-inner"
        />

        <div className="text-center mb-4 p-3 sm:p-4 rounded-xl border-2 bg-black/50 border-indigo-800 shadow-inner">
          <div className="font-mono text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter tabular-nums leading-none text-green-400">
            {formatTime(time)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {!isRunning ? (
            <button onClick={startStopwatch} className="col-span-1 flex items-center justify-center gap-2 bg-green-700 text-green-50 py-3 rounded-lg font-bold text-sm sm:text-base border border-green-500 hover:bg-green-600 transition-colors shadow-md active:scale-95">
              <PlayIcon /> INICIAR
            </button>
          ) : (
            <button onClick={stopStopwatch} className="col-span-1 flex items-center justify-center gap-2 bg-amber-600 text-amber-50 py-3 rounded-lg font-bold text-sm sm:text-base border border-amber-500 hover:bg-amber-500 transition-colors shadow-md active:scale-95">
              <PauseIcon /> PAUSAR
            </button>
          )}
          <button onClick={resetStopwatch} className="col-span-1 flex items-center justify-center gap-1 bg-indigo-800 text-indigo-100 py-3 rounded-lg font-bold text-sm sm:text-base border border-indigo-600 hover:bg-indigo-700 transition-colors shadow-md active:scale-95 uppercase tracking-wide">
            REINICIAR
          </button>
          <button onClick={onDelete} className="col-span-2 md:col-span-2 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm sm:text-base border border-red-800 bg-red-950/70 text-red-200 hover:bg-red-800 hover:text-white transition-colors shadow-md active:scale-95 tracking-wider">
            <TrashIcon /> ELIMINAR
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
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-gray-900 to-black p-3 sm:p-5 overflow-y-auto w-full">
      <div className="mx-auto w-full flex flex-col items-center max-w-5xl">

        {/* Encabezado Principal Orientado a 720p (Vertical) */}
        <div className="flex flex-row justify-between items-center mb-5 gap-3 w-full bg-indigo-950/80 rounded-2xl p-3 sm:p-4 border border-indigo-600/50 shadow-md flex-wrap sm:flex-nowrap">
          {/* Logo y Letrero */}
          <div className="flex flex-row items-center justify-start flex-shrink-0">
            <Logo />
            <div className="hidden min-[400px]:block ml-3 sm:ml-4 text-left">
              <h1 className="text-xl sm:text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-cyan-300 to-indigo-400 tracking-widest drop-shadow-sm leading-none m-0">MELTDOWN</h1>
              <p className="text-indigo-400/90 text-[0.6rem] sm:text-xs font-mono uppercase tracking-[0.1em] font-bold mt-0.5">Gestor de Tiempo</p>
            </div>
          </div>

          {/* Botones Acoplados Arriba */}
          <div className="flex flex-row flex-grow justify-end gap-2 sm:gap-3 shrink-0 h-auto">
            <button onClick={addTimer} className="flex-1 max-w-[140px] flex flex-row items-center justify-center gap-1.5 bg-gradient-to-b from-cyan-900/90 to-indigo-900/90 text-cyan-100 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-cyan-800/80 hover:from-cyan-800 hover:to-indigo-800 hover:shadow-md transition-colors w-full">
              <span className="text-lg sm:text-xl font-black leading-none bg-black/40 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">+</span>
              <span className="text-[0.65rem] sm:text-xs font-bold tracking-widest uppercase leading-tight">Reloj</span>
            </button>
            <button onClick={addStopwatch} className="flex-1 max-w-[140px] flex flex-row items-center justify-center gap-1.5 bg-gradient-to-b from-green-900/90 to-indigo-900/90 text-green-100 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-green-800/80 hover:from-green-800 hover:to-indigo-800 hover:shadow-md transition-colors w-full">
              <span className="text-lg sm:text-xl font-black leading-none bg-black/40 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">+</span>
              <span className="text-[0.65rem] sm:text-xs font-bold tracking-widest uppercase leading-tight">Crono</span>
            </button>
          </div>
        </div>

        {/* Contenedor Flex: Ahora con tamaños mucho más pequeños y espaciado ajustado */}
        <div className="flex flex-col w-full gap-4 sm:gap-5 pb-10">
          {timers.map((timer) => (
            <div key={timer.id} className="w-full">
              {timer.type === 'timer' ?
                <Timer onDelete={() => removeTimer(timer.id)} /> :
                <Stopwatch onDelete={() => removeTimer(timer.id)} />
              }
            </div>
          ))}
          {timers.length === 0 && (
            <div className="w-full text-center p-8 sm:p-16 border-2 border-dashed border-indigo-800/80 rounded-3xl bg-indigo-950/40 shadow-inner mt-4">
              <p className="text-indigo-400/90 font-mono text-xl sm:text-2xl tracking-widest font-black uppercase">PANEL VACÍO</p>
              <p className="text-indigo-500/80 font-mono text-sm sm:text-base mt-2 font-bold">Use los botones superiores para agregar paneles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
