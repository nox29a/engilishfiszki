"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFlagUsa, FaFlag } from "react-icons/fa";

const popular1000 = [
  { id: 1, pl: "porzucić", en: "abandon" },
  { id: 2, pl: "radzić sobie", en: "cope" },
  { id: 3, pl: "krytyczny", en: "critical" }
];

const popular3000 = [
  { id: 1, pl: "zdesperowany", en: "desperate" },
  { id: 2, pl: "rdzeń", en: "core" },
  { id: 3, pl: "wykres", en: "chart" }
];

const c1words = [
  { id: 1, pl: "niedopowiedziany", en: "implicit" },
  { id: 2, pl: "zbiorowy", en: "collective" },
  { id: 3, pl: "wyczerpujący", en: "exhaustive" }
];

export default function FlashcardGame() {
  const [level, setLevel] = useState<'1000' | '3000' | 'c1'>('1000');
  const getWords = () => level === '1000' ? popular1000 : level === '3000' ? popular3000 : c1words;

  const [direction, setDirection] = useState<'pl-en' | 'en-pl'>('pl-en');
  const [input, setInput] = useState('');
  const [remaining, setRemaining] = useState(getWords());
  const [current, setCurrent] = useState(getWords()[0]);
  const [score, setScore] = useState(0);
  const [feedbackColor, setFeedbackColor] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const correct = direction === 'pl-en' ? current.en.toLowerCase() : current.pl.toLowerCase();
    const userAnswer = input.trim().toLowerCase();

    let nextDelay = 500;
    let updatedList = remaining;

    if (userAnswer === correct) {
      setFeedbackColor('bg-green-500');
      updatedList = remaining.filter(word => word.id !== current.id);
      setScore(prev => prev + 1);
    } else {
      setFeedbackColor('bg-red-500');
      setCorrectAnswer(correct);
      nextDelay = 2000;
    }

    const next = updatedList[Math.floor(Math.random() * updatedList.length)];
    setTimeout(() => {
      setCurrent(next);
      setFeedbackColor('');
      setCorrectAnswer('');
      setInput('');
      setRemaining(updatedList);
    }, nextDelay);
  };

  const resetGame = () => {
    const newWords = getWords();
    setRemaining(newWords);
    setCurrent(newWords[0]);
    setInput('');
    setScore(0);
    setFeedbackColor('');
    setCorrectAnswer('');
  };

  const handleLevelChange = (lvl: '1000' | '3000' | 'c1') => {
    setLevel(lvl);
    const newWords = lvl === '1000' ? popular1000 : lvl === '3000' ? popular3000 : c1words;
    setRemaining(newWords);
    setCurrent(newWords[0]);
    setInput('');
    setScore(0);
    setFeedbackColor('');
    setCorrectAnswer('');
  };

  return (
    <div className="min-h-screen bg-[#0e0e1a] text-white flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-400">FISZKI</h1>

      <div className="text-sm text-gray-400">Wybierz poziom trudności:</div>
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => handleLevelChange('1000')} className={`rounded-full px-4 py-2 text-sm transition-colors ${level === '1000' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}>1000 słów</Button>
        <Button onClick={() => handleLevelChange('3000')} className={`rounded-full px-4 py-2 text-sm transition-colors ${level === '3000' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}>3000  słów</Button>
        <Button onClick={() => handleLevelChange('c1')} className={`rounded-full px-4 py-2 text-sm transition-colors ${level === 'c1' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}>Poziom C1</Button>
      </div>

      <div className="text-sm text-gray-400">Wybierz kierunek tłumaczenia:</div>
      <div className="flex space-x-4">
        <Button onClick={() => setDirection('pl-en')} className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${direction === 'pl-en' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}>
          <span>🇵🇱 Polski</span>
        </Button>
        <Button onClick={() => setDirection('en-pl')} className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${direction === 'en-pl' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}>
          <span>🇬🇧 Angielski</span>
        </Button>
      </div>

      <div className={`text-2xl font-semibold text-blue-400 px-6 py-2 rounded`}>
        {direction === 'pl-en' ? current.pl : current.en}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-4">
        <Input
          className={`text-black bg-white transition-colors duration-200 ${feedbackColor}`}
          placeholder="Wpisz tłumaczenie..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" className="border border-white">
          Sprawdź
        </Button>
      </form>

      {correctAnswer && (
        <div className="text-red-400 text-sm">
          Poprawna odpowiedź: <span className="font-semibold">{correctAnswer}</span>
        </div>
      )}

      <div className="text-sm text-gray-400">
        Pozostało słów: {remaining.length} / {getWords().length} | Trafienia: {score}
      </div>

      <Button onClick={resetGame} variant="outline" className="text-black">
        Reset
      </Button>
    </div>
  );
}