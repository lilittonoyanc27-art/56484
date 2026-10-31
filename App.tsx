/**
 * Pasapalabra: Spanish - Armenian Interactive Educational Game
 * Features:
 * - Full 27-letter Rosco (Football, Days of the week, Numbers)
 * - Click Spanish text to reveal Armenian translation
 * - Dedicated "Ответ / Տեսնել պատասխանը" (Show Answer) button on click
 * - Keeps playing even after incorrect answers (marks red and continues)
 * - ¡Pasapalabra! cycling mechanism
 * - 10-Question Quick Bonus Round (with Show Answer button)
 * - Complete Dictionary / Study Sheet
 * - Pure text/interactive mode without voiceover (без озвучки)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Languages,
  Trophy,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Info,
  Lightbulb
} from 'lucide-react';

import {
  ROSCO_QUESTIONS,
  BONUS_QUESTIONS,
  QuestionItem,
  checkAnswer,
} from './data.ts';
import {
  playCorrectSound,
  playWrongSound,
  playPasapalabraSound,
  playFanfareSound,
  setMuted
} from './sound.ts';

type LetterStatus = 'pending' | 'correct' | 'wrong' | 'passed';

interface LetterState {
  letter: string;
  status: LetterStatus;
  userAnswer?: string;
}

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'rosco' | 'bonus' | 'dictionary' | 'rules'>('rosco');

  // Rosco Game States
  const [letterStates, setLetterStates] = useState<LetterState[]>(() =>
    ROSCO_QUESTIONS.map(q => ({ letter: q.letter, status: 'pending' }))
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  // Feedback popup after answering
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'passed' | null;
    messageEs: string;
    messageHy: string;
    correctAnswerEs?: string;
    correctAnswerHy?: string;
  } | null>(null);

  // Translation revelation on click
  const [showArmenian, setShowArmenian] = useState<boolean>(false);

  // Dedicated Answer revelation on click ("Кнопка Ответ")
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Bonus Game State
  const [bonusIndex, setBonusIndex] = useState<number>(0);
  const [bonusInput, setBonusInput] = useState<string>('');
  const [bonusScore, setBonusScore] = useState<number>(0);
  const [bonusAnswers, setBonusAnswers] = useState<{ isCorrect: boolean; userAns: string }[]>([]);
  const [bonusFinished, setBonusFinished] = useState<boolean>(false);
  const [bonusFeedback, setBonusFeedback] = useState<{
    isCorrect: boolean;
    textEs: string;
    textHy: string;
  } | null>(null);
  const [showBonusArmenian, setShowBonusArmenian] = useState<boolean>(false);
  const [showBonusAnswer, setShowBonusAnswer] = useState<boolean>(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active question in Rosco
  const currentQuestion: QuestionItem = ROSCO_QUESTIONS[currentIndex];

  // Counts
  const stats = useMemo(() => {
    const correct = letterStates.filter(s => s.status === 'correct').length;
    const wrong = letterStates.filter(s => s.status === 'wrong').length;
    const pending = letterStates.filter(s => s.status === 'pending' || s.status === 'passed').length;
    return { correct, wrong, pending };
  }, [letterStates]);

  // Sync mute state
  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Reset inputs and reveals when letter changes
  useEffect(() => {
    setShowArmenian(false);
    setShowAnswer(false);
    setUserInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, activeTab, isGameOver]);

  // Find next unanswered letter
  const findNextIndex = (fromIdx: number, states: LetterState[]): number => {
    const total = states.length;
    for (let offset = 1; offset <= total; offset++) {
      const checkIdx = (fromIdx + offset) % total;
      if (states[checkIdx].status === 'pending' || states[checkIdx].status === 'passed') {
        return checkIdx;
      }
    }
    return -1; // All letters answered
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    playFanfareSound();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    const val = userInput.trim();
    if (!val) return;

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    const isCorrect = checkAnswer(val, currentQuestion.answerEs, currentQuestion.acceptedAnswers);
    const updatedStates = [...letterStates];

    if (isCorrect) {
      playCorrectSound();
      updatedStates[currentIndex] = {
        ...updatedStates[currentIndex],
        status: 'correct',
        userAnswer: val
      };
      setFeedback({
        type: 'correct',
        messageEs: `¡CORRECTO! ${currentQuestion.answerEs}`,
        messageHy: `ՃԻՇՏ Է: ${currentQuestion.answerHy}`,
        correctAnswerEs: currentQuestion.answerEs,
        correctAnswerHy: currentQuestion.answerHy
      });
    } else {
      // Continues playing even when wrong!
      playWrongSound();
      updatedStates[currentIndex] = {
        ...updatedStates[currentIndex],
        status: 'wrong',
        userAnswer: val
      };
      setFeedback({
        type: 'wrong',
        messageEs: `¡INCORRECTO! Era: "${currentQuestion.answerEs}"`,
        messageHy: `ՍԽԱԼ Է: Ճիշտ պատասխանն էր՝ «${currentQuestion.answerHy}» (${currentQuestion.answerEs})`,
        correctAnswerEs: currentQuestion.answerEs,
        correctAnswerHy: currentQuestion.answerHy
      });
    }

    setLetterStates(updatedStates);
    setUserInput('');
    setShowAnswer(false);

    // Check if game is completed
    const nextIdx = findNextIndex(currentIndex, updatedStates);

    const delay = isCorrect ? 1200 : 2200; // Give slightly more time to read the wrong answer correction
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      if (nextIdx === -1) {
        handleGameOver();
      } else {
        if (nextIdx <= currentIndex) {
          setRoundNumber(r => r + 1);
        }
        setCurrentIndex(nextIdx);
      }
    }, delay);
  };

  // Pasapalabra Action
  const handlePasapalabra = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    playPasapalabraSound();
    const updatedStates = [...letterStates];
    updatedStates[currentIndex] = {
      ...updatedStates[currentIndex],
      status: 'passed'
    };
    setLetterStates(updatedStates);

    setFeedback({
      type: 'passed',
      messageEs: '¡PASAPALABRA!',
      messageHy: 'ՊԱՍԱՊԱԼԱԲՐԱ (Անցնել հաջորդին)',
    });

    const nextIdx = findNextIndex(currentIndex, updatedStates);

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      if (nextIdx === -1) {
        const stillPassed = updatedStates.findIndex(s => s.status === 'passed');
        if (stillPassed !== -1) {
          setCurrentIndex(stillPassed);
          setRoundNumber(r => r + 1);
        } else {
          handleGameOver();
        }
      } else {
        if (nextIdx <= currentIndex) {
          setRoundNumber(r => r + 1);
        }
        setCurrentIndex(nextIdx);
      }
    }, 700);
  };

  // Quick next when feedback is displayed
  const handleImmediateNext = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setFeedback(null);
    const nextIdx = findNextIndex(currentIndex, letterStates);
    if (nextIdx === -1) {
      handleGameOver();
    } else {
      if (nextIdx <= currentIndex) {
        setRoundNumber(r => r + 1);
      }
      setCurrentIndex(nextIdx);
    }
  };

  // Reset Game
  const restartGame = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setLetterStates(ROSCO_QUESTIONS.map(q => ({ letter: q.letter, status: 'pending' })));
    setCurrentIndex(0);
    setUserInput('');
    setRoundNumber(1);
    setIsGameOver(false);
    setFeedback(null);
    setShowArmenian(false);
    setShowAnswer(false);
  };

  // Append Spanish accent letter into user input
  const insertAccent = (char: string) => {
    setUserInput(prev => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // BONUS GAME HANDLERS
  const currentBonus = BONUS_QUESTIONS[bonusIndex];

  const handleBonusSubmit = () => {
    if (!bonusInput.trim() || !currentBonus) return;
    const isCorrect = checkAnswer(bonusInput, currentBonus.answerEs, currentBonus.acceptedAnswers);
    if (isCorrect) {
      playCorrectSound();
      setBonusScore(s => s + 1);
    } else {
      playWrongSound();
    }

    setBonusAnswers(prev => [...prev, { isCorrect, userAns: bonusInput.trim() }]);
    setBonusFeedback({
      isCorrect,
      textEs: currentBonus.answerEs,
      textHy: currentBonus.answerHy
    });

    setTimeout(() => {
      setBonusFeedback(null);
      setBonusInput('');
      setShowBonusArmenian(false);
      setShowBonusAnswer(false);
      if (bonusIndex + 1 < BONUS_QUESTIONS.length) {
        setBonusIndex(i => i + 1);
      } else {
        setBonusFinished(true);
        playFanfareSound();
        confetti({ particleCount: 100, spread: 70 });
      }
    }, 1800);
  };

  const restartBonus = () => {
    setBonusIndex(0);
    setBonusInput('');
    setBonusScore(0);
    setBonusAnswers([]);
    setBonusFinished(false);
    setBonusFeedback(null);
    setShowBonusArmenian(false);
    setShowBonusAnswer(false);
  };

  return (
    <div className="min-h-screen rosco-bg-radial text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header Bar */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950 font-black text-xl">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-200 to-white">
                  PASAPALABRA
                </h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  27 Letras
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Իսպաներեն — Հայերեն ինտերակտիվ խաղ (Ֆուտբոլ, Օրեր, Թվեր)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('rosco')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rosco'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Էլ Ռոսկո</span>
            </button>
            <button
              onClick={() => setActiveTab('bonus')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bonus'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>10 Բոնուս</span>
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dictionary'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>Բառարան</span>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Կանոններ</span>
            </button>
          </nav>

          {/* Sound FX Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Ձայնային էֆեկտներն անջատել' : 'Ձայնային էֆեկտները միացնել'}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border-white/5'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Ձայն' : 'Անձայն'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        {activeTab === 'rosco' && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 xl:gap-12 my-auto">
            
            {/* Left/Center: The Rosco Wheel (Authentic Circular TV Show Ring) */}
            <div className="flex flex-col items-center justify-center w-full max-w-[360px] sm:max-w-[440px] md:max-w-[480px] shrink-0">
              
              {/* Circular Container with safe padding and guaranteed boundaries */}
              <div className="relative w-[330px] h-[330px] sm:w-[410px] sm:h-[410px] md:w-[450px] md:h-[450px] select-none flex items-center justify-center p-2">
                {/* Outer atmospheric glowing ring */}
                <div className="absolute inset-2 sm:inset-3 rounded-full border border-blue-500/20 shadow-[0_0_60px_rgba(37,99,235,0.2)] pointer-events-none" />
                <div className="absolute inset-12 sm:inset-16 rounded-full border border-indigo-400/10 pointer-events-none" />

                {/* Rosco Letters arranged in a mathematically precise 360 circle */}
                <div className="relative w-full h-full">
                  {ROSCO_QUESTIONS.map((item, index) => {
                    const state = letterStates[index];
                    const isActive = index === currentIndex && !isGameOver;
                    const total = ROSCO_QUESTIONS.length;
                    
                    // Angle: Start at top (-90 degrees), arrange clockwise
                    const angle = -90 + (index * 360) / total;
                    const angleRad = (angle * Math.PI) / 180;
                    
                    // Radius: 39.5% provides safe margin on all sides
                    const radiusPercent = 39.5;
                    const left = 50 + radiusPercent * Math.cos(angleRad);
                    const top = 50 + radiusPercent * Math.sin(angleRad);

                    // Badge appearance by state
                    let badgeBg = 'bg-gradient-to-b from-blue-500 to-blue-700 text-white border-blue-300/40 shadow-blue-950/60';
                    if (state.status === 'correct') {
                      badgeBg = 'bg-gradient-to-b from-emerald-400 to-green-600 text-white border-emerald-100 shadow-[0_0_12px_rgba(34,197,94,0.6)]';
                    } else if (state.status === 'wrong') {
                      badgeBg = 'bg-gradient-to-b from-red-500 to-rose-700 text-white border-rose-100 shadow-[0_0_12px_rgba(239,68,68,0.6)]';
                    } else if (state.status === 'passed') {
                      badgeBg = 'bg-gradient-to-b from-sky-600 to-blue-800 text-amber-200 border-amber-300/50 shadow-sky-950/70';
                    }

                    if (isActive) {
                      badgeBg = 'bg-gradient-to-b from-amber-300 to-yellow-500 text-slate-950 border-white rosco-badge-active font-black';
                    }

                    return (
                      <div
                        key={item.letter}
                        style={{
                          position: 'absolute',
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: isActive ? 30 : 15,
                        }}
                        className="pointer-events-auto"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (!isGameOver && (state.status === 'pending' || state.status === 'passed')) {
                              setCurrentIndex(index);
                            }
                          }}
                          title={`${item.letter} — ${item.typeLabelEs} (${item.theme}): ${state.status.toUpperCase()}`}
                          className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm tracking-tight border-2 shadow-lg transition-transform duration-150 leading-none overflow-visible ${badgeBg} ${
                            state.status === 'pending' || state.status === 'passed' ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
                          }`}
                        >
                          <span className="flex items-center justify-center w-full h-full text-center leading-none select-none">
                            {item.letter}
                          </span>
                        </button>
                      </div>
                    );
                  })}

                  {/* Center of the Rosco: Contestant Stage Info */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none z-10">
                    {/* Current Letter Giant Badge */}
                    <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center mb-1.5">
                      <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border border-amber-400/50">
                        <span className="text-xl sm:text-2xl font-black text-amber-300 leading-none">
                          {currentQuestion ? currentQuestion.letter : '—'}
                        </span>
                        <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-wider">
                          {currentQuestion?.type === 'starts_with' ? 'Empieza' : 'Contiene'}
                        </span>
                      </div>
                    </div>

                    {/* Theme & Clue Type */}
                    <div className="flex items-center gap-1.5 bg-blue-950/90 border border-blue-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-blue-200 shadow-md">
                      <span>{currentQuestion?.themeIcon}</span>
                      <span>{currentQuestion?.theme}</span>
                    </div>

                    {/* Progress indicator */}
                    <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                      Փուլ {roundNumber} • {stats.correct + stats.wrong}/27
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Authentic TV Score Pods (Neat, aligned bar below the wheel) */}
              <div className="flex items-center justify-center gap-3 bg-slate-950/85 px-4 py-2 rounded-2xl border border-white/15 shadow-xl backdrop-blur-md mt-2 w-full max-w-[320px]">
                {/* Correct Pod (Green) */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 border border-white/80 flex items-center justify-center shadow text-white font-black text-sm">
                    {stats.correct}
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-emerald-400 block">Ճիշտ</span>
                    <span className="text-[9px] text-slate-400 uppercase">Aciertos</span>
                  </div>
                </div>

                <div className="w-px h-6 bg-white/10" />

                {/* Errors Pod (Red) */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-red-400 border border-white/80 flex items-center justify-center shadow text-white font-black text-sm">
                    {stats.wrong}
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-rose-400 block">Սխալ</span>
                    <span className="text-[9px] text-slate-400 uppercase">Fallos</span>
                  </div>
                </div>

                <div className="w-px h-6 bg-white/10" />

                {/* Remaining Pod (Blue) */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-500 border border-white/80 flex items-center justify-center shadow text-white font-black text-sm">
                    {stats.pending}
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-sky-400 block">Մնաց</span>
                    <span className="text-[9px] text-slate-400 uppercase">Quedan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Interactive Question Card, Input & Armenian Translation Click-Reveal */}
            <div className="w-full lg:max-w-xl flex flex-col gap-4">
              
              {/* Feedback Alert Bar when answered */}
              {feedback && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top duration-300 ${
                    feedback.type === 'correct'
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                      : feedback.type === 'wrong'
                      ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                      : 'bg-blue-950/90 border-blue-400 text-blue-200'
                  }`}
                >
                  {feedback.type === 'correct' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
                  ) : feedback.type === 'wrong' ? (
                    <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-black text-base sm:text-lg">{feedback.messageEs}</p>
                    <p className="text-sm opacity-90 mt-0.5">{feedback.messageHy}</p>
                    {feedback.type === 'wrong' && (
                      <p className="text-xs text-rose-300/80 mt-1 italic">
                        ℹ️ Խաղը շարունակվում է: Կարող եք շարունակել մյուս տառերը:
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleImmediateNext}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold shrink-0 self-center cursor-pointer"
                  >
                    Հաջորդը ➔
                  </button>
                </div>
              )}

              {/* Game Over Screen if finished */}
              {isGameOver ? (
                <div className="card-glass rounded-3xl p-6 sm:p-8 text-center border-amber-400/30 shadow-2xl relative overflow-hidden">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 text-4xl shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
                    🏆
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 mb-2">
                    ¡Fin de El Rosco! — Խաղն ավարտվեց:
                  </h2>
                  <p className="text-sm text-slate-300 mb-6">
                    Դուք անցաք Pasapalabra-ի բոլոր 27 տառերը: Ահա ձեր արդյունքները.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl">
                      <span className="text-2xl sm:text-4xl font-black text-emerald-400">{stats.correct}</span>
                      <p className="text-xs font-bold text-emerald-300 uppercase mt-1">Ճիշտ (Aciertos)</p>
                    </div>
                    <div className="bg-rose-950/60 border border-rose-500/40 p-4 rounded-2xl">
                      <span className="text-2xl sm:text-4xl font-black text-rose-400">{stats.wrong}</span>
                      <p className="text-xs font-bold text-rose-300 uppercase mt-1">Սխալ (Fallos)</p>
                    </div>
                    <div className="bg-blue-950/60 border border-blue-500/40 p-4 rounded-2xl">
                      <span className="text-2xl sm:text-4xl font-black text-blue-300">
                        {Math.round((stats.correct / 27) * 100)}%
                      </span>
                      <p className="text-xs font-bold text-blue-300 uppercase mt-1">Հաջողություն</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={restartGame}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-900/40 flex items-center gap-2 tv-button-3d cursor-pointer"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Խաղալ կրկին / Jugar de nuevo</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('bonus')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black shadow-lg shadow-amber-900/40 flex items-center gap-2 tv-button-3d cursor-pointer"
                    >
                      <Zap className="w-5 h-5 text-yellow-200" />
                      <span>10 Բոնուս Հարցեր ➔</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('dictionary')}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Տեսնել բոլոր պատասխանները</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Active Question & Answer Box */
                <div className="card-glass rounded-3xl p-5 sm:p-7 border-blue-400/30 shadow-2xl relative">
                  
                  {/* Top Bar inside Card: Clue Letter info, Armenian Translation Toggle & Show Answer Button */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                        {currentQuestion.letter}
                      </span>
                      <div>
                        <span className="text-sm font-extrabold text-amber-300">
                          {currentQuestion.typeLabelEs}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          {currentQuestion.typeLabelHy}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* DEDICATED SEPARATE ANSWER BUTTON */}
                      <button
                        type="button"
                        onClick={() => setShowAnswer(!showAnswer)}
                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black transition cursor-pointer shadow-md ${
                          showAnswer
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                        }`}
                        title="Սեղմեք պատասխանը տեսնելու համար / Ver respuesta"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                        <span>💡 {showAnswer ? 'Փակել պատասխանը' : 'Պատասխան (Ответ)'}</span>
                      </button>

                      {/* Explicit Armenian Translation Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowArmenian(!showArmenian)}
                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                          showArmenian
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-800 text-purple-300 border-purple-500/30 hover:bg-slate-700'
                        }`}
                        title="Ցույց տալ հայերեն թարգմանությունը"
                      >
                        {showArmenian ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span>🇦🇲 {showArmenian ? 'Թաքցնել' : 'Թարգմանել'}</span>
                      </button>
                    </div>
                  </div>

                  {/* SPANISH QUESTION CARD — CLICKABLE TO REVEAL ARMENIAN! */}
                  <div
                    onClick={() => setShowArmenian(!showArmenian)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowArmenian(!showArmenian); }}
                    className="group relative cursor-pointer p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/80 border-2 border-blue-400/40 hover:border-amber-400/80 transition-all duration-200 shadow-inner hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] mb-3"
                  >
                    {/* Badge Clue */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                        <span>🇪🇸 Español (Սեղմեք թարգմանության համար)</span>
                      </div>
                      <span className="text-[11px] text-slate-400 group-hover:text-amber-300 transition flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5" />
                        <span>{showArmenian ? 'Սեղմեք թաքցնելու' : 'Սեղմեք հայերենի'}</span>
                      </span>
                    </div>

                    {/* Spanish Question Text */}
                    <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                      {currentQuestion.questionEs}
                    </p>

                    {/* Visual hint indicator */}
                    <div className="mt-2 text-right">
                      <span className="inline-block text-[11px] font-semibold text-sky-300 bg-sky-950/70 border border-sky-400/30 px-2 py-0.5 rounded-md">
                        👆 Կտտացրեք այստեղ՝ հայերեն բացատրությունը տեսնելու համար
                      </span>
                    </div>
                  </div>

                  {/* REVEALED ANSWER CARD (When clicking the separate "Ответ" button) */}
                  {showAnswer && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-400 text-amber-100 flex items-center justify-between gap-3 mb-3 animate-in fade-in duration-200 shadow-xl shadow-amber-950/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow">
                          💡
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider block">
                            Ճիշտ պատասխանը (Respuesta):
                          </span>
                          <span className="text-lg sm:text-xl font-black text-white">
                            {currentQuestion.answerEs}
                          </span>
                          <span className="text-sm font-semibold text-amber-300 ml-2">
                            — {currentQuestion.answerHy}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserInput(currentQuestion.answerEs);
                          if (inputRef.current) inputRef.current.focus();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition cursor-pointer shadow active:scale-95 shrink-0"
                        title="Տեղադրել դաշտում"
                      >
                        ✍️ Լրացնել
                      </button>
                    </div>
                  )}

                  {/* ARMENIAN TRANSLATION ACCORDION CARD (Opens on click) */}
                  {showArmenian && (
                    <div className="p-4 rounded-2xl bg-purple-950/60 border-2 border-purple-400/50 text-purple-100 mb-3 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">🇦🇲</span>
                        <span className="text-xs font-black uppercase text-purple-300 tracking-wider">
                          Հայերեն թարգմանություն
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-purple-50 leading-relaxed">
                        {currentQuestion.questionHy}
                      </p>
                    </div>
                  )}

                  {/* Virtual Spanish Accents Bar (Á, É, Í, Ó, Ú, Ñ) */}
                  <div className="flex items-center justify-between gap-1 mb-3 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
                    <span className="text-[11px] text-slate-400 font-medium px-1 hidden sm:inline">
                      Իսպանական տառեր:
                    </span>
                    <div className="flex items-center gap-1 flex-1 justify-end">
                      {['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'].map((char) => (
                        <button
                          key={char}
                          type="button"
                          onClick={() => insertAccent(char)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs border border-white/10 active:scale-95 transition cursor-pointer"
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Answer Input Field & Actions */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }}
                    className="flex flex-col gap-3"
                  >
                    <div className="relative flex items-center">
                      <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={`Մուտքագրեք բառը (${currentQuestion.typeLabelEs})...`}
                        autoComplete="off"
                        spellCheck="false"
                        className="w-full bg-slate-950/80 border-2 border-blue-500/50 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-base sm:text-lg font-bold text-white placeholder-slate-500 focus:outline-none shadow-inner pr-12 transition"
                      />

                      {/* Clear button */}
                      {userInput && (
                        <button
                          type="button"
                          onClick={() => setUserInput('')}
                          className="absolute right-3 text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Action Buttons: Pasapalabra, Separate Show Answer Button, and Enviar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={handlePasapalabra}
                        className="py-3 px-3 rounded-xl bg-gradient-to-r from-blue-700 via-sky-600 to-blue-800 hover:from-blue-600 hover:to-sky-500 text-white font-black text-xs sm:text-sm border border-sky-400/40 shadow-lg shadow-blue-900/50 flex items-center justify-center gap-1.5 tv-button-3d cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                        <span>¡Pasapalabra! (Պաս)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs sm:text-sm border border-amber-300/40 shadow-lg shadow-amber-950/50 flex items-center justify-center gap-1.5 tv-button-3d cursor-pointer"
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-200 fill-yellow-200/20" />
                        <span>{showAnswer ? 'Փակել պատասխանը' : 'Պատասխան (Ответ)'}</span>
                      </button>

                      <button
                        type="submit"
                        disabled={!userInput.trim()}
                        className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm border border-emerald-300/40 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-1.5 tv-button-3d cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ուղարկել (Enviar)</span>
                      </button>
                    </div>
                  </form>

                  {/* Helpful hints & Restart control */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-400" />
                      <span>
                        💡 Սխալ պատասխանի դեպքում խաղը <b>չի կանգնում</b>, այլ շարունակվում է:
                      </span>
                    </div>

                    <button
                      onClick={restartGame}
                      className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Վերսկսել</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Rosco Question Quick Legend */}
              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Ճիշտ (Acierto)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block" />
                  <span>Սխալ (Fallo)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block" />
                  <span>Սպասող (Pendiente)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block" />
                  <span>Ընթացիկ (Activa)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BONUS 10 QUICK QUESTIONS */}
        {activeTab === 'bonus' && (
          <div className="max-w-2xl mx-auto w-full my-auto">
            <div className="card-glass rounded-3xl p-6 sm:p-8 border-amber-500/30 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xl font-black">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-amber-300">
                      10 Preguntas Rápidas (Bonus)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Արագ հարցեր ֆուտբոլի, շաբաթվա օրերի և թվերի մասին
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Հաշիվ</span>
                  <p className="text-lg font-black text-emerald-400">
                    {bonusScore} / {BONUS_QUESTIONS.length}
                  </p>
                </div>
              </div>

              {bonusFinished ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    Բոնուս փուլն ավարտվեց:
                  </h3>
                  <p className="text-sm text-slate-300 mb-6">
                    Դուք ճիշտ պատասխանեցիք <b>{bonusScore}</b> հարցի <b>{BONUS_QUESTIONS.length}</b>-ից:
                  </p>

                  <div className="space-y-2 mb-6 text-left max-h-60 overflow-y-auto pr-2">
                    {BONUS_QUESTIONS.map((q, idx) => {
                      const ans = bonusAnswers[idx];
                      return (
                        <div
                          key={q.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                            ans?.isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                          }`}
                        >
                          <div>
                            <span className="font-bold mr-2">#{idx + 1}</span>
                            <span>{q.questionEs}</span>
                            <span className="block text-slate-400 text-[11px] mt-0.5">
                              Ճիշտը՝ {q.answerEs} ({q.answerHy})
                            </span>
                          </div>
                          <span className="font-bold">
                            {ans?.isCorrect ? '✅ Ճիշտ' : '❌ Սխալ'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={restartBonus}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Կրկնել բոնուսը</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('rosco')}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer"
                    >
                      Վերադառնալ Էլ Ռոսկո
                    </button>
                  </div>
                </div>
              ) : currentBonus ? (
                <div>
                  {/* Progress Indicator */}
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${((bonusIndex + 1) / BONUS_QUESTIONS.length) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-full">
                      Հարց {bonusIndex + 1} / {BONUS_QUESTIONS.length} • {currentBonus.theme}
                    </span>

                    {/* Bonus Show Answer Button */}
                    <button
                      type="button"
                      onClick={() => setShowBonusAnswer(!showBonusAnswer)}
                      className="text-xs text-amber-300 hover:text-white bg-amber-950/50 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{showBonusAnswer ? 'Փակել' : 'Պատասխան (Ответ)'}</span>
                    </button>
                  </div>

                  {/* Clickable Question Card to reveal Armenian */}
                  <div
                    onClick={() => setShowBonusArmenian(!showBonusArmenian)}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-amber-400/40 hover:border-amber-400 cursor-pointer transition mb-3 shadow-inner"
                  >
                    <p className="text-lg font-semibold text-white leading-relaxed">
                      {currentBonus.questionEs}
                    </p>
                    <p className="text-[11px] text-sky-300 mt-2">
                      👆 Կտտացրեք հարցի վրա՝ հայերեն թարգմանությունը տեսնելու համար
                    </p>
                  </div>

                  {/* Revealed Answer Card for Bonus */}
                  {showBonusAnswer && (
                    <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-400 text-amber-100 flex items-center justify-between mb-3 text-sm">
                      <div>
                        <span className="font-bold text-amber-300 mr-2">💡 Պատասխան:</span>
                        <span className="font-black text-white">{currentBonus.answerEs}</span>
                        <span className="text-slate-300 ml-1">({currentBonus.answerHy})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBonusInput(currentBonus.answerEs)}
                        className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Լրացնել
                      </button>
                    </div>
                  )}

                  {showBonusArmenian && (
                    <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-400/40 text-purple-100 text-base mb-3">
                      🇦🇲 {currentBonus.questionHy}
                    </div>
                  )}

                  {bonusFeedback && (
                    <div
                      className={`p-3 rounded-xl mb-4 font-bold text-sm ${
                        bonusFeedback.isCorrect
                          ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                          : 'bg-rose-950 border border-rose-500 text-rose-300'
                      }`}
                    >
                      {bonusFeedback.isCorrect ? '✅ ՃԻՇՏ Է!' : '❌ ՍԽԱԼ Է: '} Պատասխանն է՝ {bonusFeedback.textEs} ({bonusFeedback.textHy})
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBonusSubmit();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={bonusInput}
                      onChange={(e) => setBonusInput(e.target.value)}
                      placeholder="Մուտքագրեք պատասխանը իսպաներենով..."
                      className="flex-1 bg-slate-950 border border-white/20 focus:border-amber-400 rounded-xl px-4 py-3 text-white font-bold focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!bonusInput.trim()}
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black transition tv-button-3d cursor-pointer"
                    >
                      Ուղարկել
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETE 27-QUESTION DICTIONARY & STUDY SHEET */}
        {activeTab === 'dictionary' && (
          <div className="card-glass rounded-3xl p-4 sm:p-6 border-purple-500/30 shadow-2xl max-w-5xl mx-auto w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-black text-purple-300 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Pasapalabra Բառարան և Ուսումնական Նյութ</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Բոլոր 27 բառերը ըստ տառերի՝ իսպաներեն բացատրությամբ և հայերեն թարգմանությամբ:
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                  ⚽ Fútbol
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                  📅 Días
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  🔢 Números
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-1">
              {ROSCO_QUESTIONS.map((item) => (
                <div
                  key={item.letter}
                  className="bg-slate-900/80 border border-white/10 hover:border-purple-400/50 rounded-2xl p-4 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
                          {item.letter}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          {item.typeLabelEs}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {item.themeIcon} {item.theme}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 mb-2 leading-relaxed">
                      {item.questionEs}
                    </p>
                    <p className="text-xs text-purple-300/90 mb-3 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20">
                      🇦🇲 {item.questionHy}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div>
                      <span className="text-xs text-slate-400">Պատասխան: </span>
                      <span className="text-sm font-black text-amber-400">{item.answerEs}</span>
                      <span className="text-xs text-slate-300 ml-1">({item.answerHy})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RULES / INSTRUCTIONS */}
        {activeTab === 'rules' && (
          <div className="card-glass rounded-3xl p-6 sm:p-8 border-white/10 shadow-2xl max-w-3xl mx-auto w-full">
            <h2 className="text-2xl font-black text-amber-300 mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              <span>Ինչպե՞ս խաղալ Pasapalabra</span>
            </h2>

            <div className="space-y-4 text-sm text-slate-200 leading-relaxed">
              <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-2xl">
                <h3 className="font-bold text-amber-300 text-base mb-1">
                  1. Խաղի կանոնները (El Rosco)
                </h3>
                <p>
                  Էլ Ռոսկոն կազմված է իսպանական այբուբենի <b>27 տառերից</b> (A-Z ներառյալ Ñ): Յուրաքանչյուր տառի համար տրվում է նկարագրություն իսպաներենով (Fútbol, Días de la semana, Números):
                </p>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl">
                <h3 className="font-bold text-emerald-300 text-base mb-1">
                  2. Ինչպե՞ս պատասխանել կամ անցնել
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>
                    Եթե գիտեք բառը՝ մուտքագրեք այն և սեղմեք <b>Enviar (Ուղարկել)</b>:
                  </li>
                  <li>
                    Եթե չգիտեք բառը կամ ցանկանում եք մտածել՝ սեղմեք <b>¡Pasapalabra! (Պաս)</b>: Տառը կմնա կապույտ և կվերադառնա հաջորդ շրջանում:
                  </li>
                  <li>
                    <b>Սխալ պատասխանի դեպքում.</b> Տառը կդառնա կարմիր 🔴, ճիշտ պատասխանը կցուցադրվի, և <b>դուք կշարունակեք խաղալ</b> հաջորդ տառերով առանց խաղը դադարեցնելու:
                  </li>
                  <li>
                    <b>Պատասխանը տեսնելու համար.</b> Սեղմեք առանձին <b>💡 Պատասխան (Ответ)</b> կոճակը, որպեսզի անմիջապես տեսնեք ճիշտ բառն ու դրա հայերեն թարգմանությունը:
                  </li>
                </ul>
              </div>

              <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-2xl">
                <h3 className="font-bold text-purple-300 text-base mb-1">
                  3. Հայերեն թարգմանություն
                </h3>
                <p>
                  Ուղղակի <b>կտտացրեք իսպաներեն տեքստի քարտի վրա</b>, և կբացվի հարցի ու բառի հայերեն ամբողջական թարգմանությունը:
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveTab('rosco')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition tv-button-3d cursor-pointer"
              >
                Սկսել խաղը ➔
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-3 px-4 text-center text-xs text-slate-500 border-t border-white/5 bg-slate-950/40">
        ⚽ Pasapalabra: Español — Հայերեն • 27 Letras (A–Z) • Fútbol, Días y Números
      </footer>
    </div>
  );
}
