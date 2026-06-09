"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/app/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { aiDiceRollSimulation } from '@/ai/flows/ai-dice-roll-simulation-flow';
import { Trophy, Swords, User, Bot, Dice5, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type GameState = 'matchmaking' | 'accept' | 'playing' | 'result';

export default function GamePage() {
  const { bet } = useParams();
  const betAmount = parseInt(bet as string);
  const router = useRouter();
  const { user, updateBalance } = useGameStore();

  const [gameState, setGameState] = useState<GameState>('matchmaking');
  const [timer, setTimer] = useState(20);
  const [matchFound, setMatchFound] = useState(false);
  
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [playerRoll, setPlayerRoll] = useState<[number, number] | null>(null);
  const [botRoll, setBotRoll] = useState<[number, number] | null>(null);
  const [botComment, setBotComment] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const [round, setRound] = useState(1);
  const totalRounds = 3;

  // Matchmaking effect
  useEffect(() => {
    if (gameState === 'matchmaking') {
      const matchTimeout = setTimeout(() => {
        setMatchFound(true);
        setGameState('accept');
        setTimer(20);
      }, 3000);
      return () => clearTimeout(matchTimeout);
    }
  }, [gameState]);

  // Acceptance timer
  useEffect(() => {
    if (gameState === 'accept' && timer > 0) {
      const t = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (gameState === 'accept' && timer === 0) {
      router.push('/home');
    }
  }, [gameState, timer, router]);

  const handleAccept = () => {
    setGameState('playing');
    updateBalance(-betAmount);
    toast({
      title: "Game Started!",
      description: `${betAmount.toLocaleString()} SO'M bet placed. Good luck!`,
    });
  };

  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);

    // Player rolls
    const p1 = Math.floor(Math.random() * 6) + 1;
    const p2 = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(async () => {
      setPlayerRoll([p1, p2]);
      const roundPlayerScore = p1 + p2;
      setPlayerScore(prev => prev + roundPlayerScore);

      // Bot logic using GenAI
      try {
        const botResult = await aiDiceRollSimulation({
          playerScore: playerScore + roundPlayerScore,
          botScore: botScore,
          playerLastRoll: [p1, p2],
          gamePhase: round === totalRounds ? 'endgame' : 'midgame',
        });

        setBotRoll([botResult.dice1, botResult.dice2]);
        setBotScore(prev => prev + (botResult.dice1 + botResult.dice2));
        setBotComment(botResult.botComment || "My turn!");
      } catch (e) {
        // Fallback if AI fails
        const b1 = Math.floor(Math.random() * 6) + 1;
        const b2 = Math.floor(Math.random() * 6) + 1;
        setBotRoll([b1, b2]);
        setBotScore(prev => prev + (b1 + b2));
      }

      setIsRolling(false);
      
      if (round < totalRounds) {
        setRound(prev => prev + 1);
      } else {
        setTimeout(() => setGameState('result'), 1500);
      }
    }, 1000);
  };

  const gameResult = useMemo(() => {
    if (playerScore > botScore) {
      const winnings = betAmount * 2;
      const tax = winnings * 0.02;
      const netProfit = winnings - tax;
      return { status: 'win', amount: netProfit, tax };
    } else if (playerScore < botScore) {
      return { status: 'lose', amount: 0, tax: 0 };
    }
    return { status: 'draw', amount: betAmount, tax: 0 };
  }, [playerScore, botScore, betAmount]);

  useEffect(() => {
    if (gameState === 'result') {
      if (gameResult.status === 'win' || gameResult.status === 'draw') {
        updateBalance(gameResult.amount);
      }
    }
  }, [gameState, gameResult, updateBalance]);

  if (gameState === 'matchmaking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Swords className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black font-headline uppercase tracking-tight text-primary">Finding Opponent</h2>
          <p className="text-muted-foreground">Searching for players in {betAmount.toLocaleString()} range...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'accept') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
        <Card className="glass-card w-full max-sm p-8 border-primary/20 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-headline text-primary uppercase">Opponent Found!</h2>
            <p className="text-muted-foreground">Pro_Gamer_777 is ready.</p>
          </div>
          
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xs font-bold uppercase text-primary">YOU</p>
            </div>
            <Swords className="w-8 h-8 text-white/20" />
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <p className="text-xs font-bold uppercase text-muted-foreground">OPPONENT</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm px-2">
              <span className="text-muted-foreground">Bet Amount</span>
              <span className="text-primary font-bold">{betAmount.toLocaleString()} SO'M</span>
            </div>
            <Progress value={(timer / 20) * 100} className="h-2 bg-white/5" />
            <p className="text-sm font-bold text-secondary">Accepting in {timer}s...</p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleAccept} className="gold-gradient text-primary-foreground h-12 font-bold text-lg rounded-xl">ACCEPT</Button>
              <Button onClick={() => router.push('/home')} variant="ghost" className="border border-white/10 text-white h-12 font-bold rounded-xl">DECLINE</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen p-4 flex flex-col space-y-6 max-w-md mx-auto">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 py-1">ROUND {round}/{totalRounds}</Badge>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Prize Pool</p>
            <p className="text-sm font-black text-primary">{(betAmount * 1.98).toLocaleString()} SO'M</p>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 space-y-8 py-8 flex flex-col justify-center">
          {/* Opponent Side */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <Bot className="w-10 h-10 text-white/50" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-muted px-2 py-0.5 rounded border border-white/10 text-[10px] font-bold">BOT</div>
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-black text-white font-headline">{botScore}</h2>
              {botComment && <p className="text-xs text-primary font-medium italic mt-1 max-w-[200px]">"{botComment}"</p>}
            </div>
            <div className="flex space-x-3">
              {botRoll ? (
                botRoll.map((d, i) => (
                  <div key={i} className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-lg transform rotate-3 scale-110">
                    <span className="text-2xl font-black text-primary-foreground">{d}</span>
                  </div>
                ))
              ) : (
                <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center">
                  <span className="text-white/10">?</span>
                </div>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {/* Player Side */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-3">
              {playerRoll ? (
                playerRoll.map((d, i) => (
                  <div key={i} className={`w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-lg transform -rotate-3 scale-110 ${isRolling ? 'dice-shake' : ''}`}>
                    <span className="text-2xl font-black text-primary-foreground">{d}</span>
                  </div>
                ))
              ) : (
                <div className={`w-12 h-12 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center ${isRolling ? 'dice-shake' : ''}`}>
                   <Dice5 className="w-6 h-6 text-white/10" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-5xl font-black text-primary font-headline">{playerScore}</h2>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Your Total Score</p>
            </div>
            <div className="relative">
               <div className="w-20 h-20 rounded-full gold-gradient border-4 border-black shadow-xl flex items-center justify-center">
                 <User className="w-10 h-10 text-black" />
               </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pb-8">
          <Button 
            disabled={isRolling}
            onClick={rollDice}
            className="w-full h-16 rounded-2xl gold-gradient text-primary-foreground text-xl font-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isRolling ? "ROLLING..." : "ROLL DICE"}
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 bg-black/60 backdrop-blur-sm">
        <Card className={`glass-card w-full max-sm p-8 border-2 text-center space-y-6 ${gameResult.status === 'win' ? 'border-primary' : 'border-destructive/50'}`}>
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${gameResult.status === 'win' ? 'gold-gradient' : 'bg-muted'}`}>
              {gameResult.status === 'win' ? <Trophy className="w-12 h-12 text-black" /> : <History className="w-12 h-12 text-white/50" />}
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className={`text-4xl font-black font-headline uppercase ${gameResult.status === 'win' ? 'text-primary' : 'text-white'}`}>
              {gameResult.status === 'win' ? 'VICTORY' : gameResult.status === 'draw' ? 'DRAW' : 'DEFEAT'}
            </h2>
            <p className="text-muted-foreground">Final Score: {playerScore} - {botScore}</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Return</span>
              <span className={`font-bold ${gameResult.status === 'win' ? 'text-primary' : 'text-white'}`}>
                {gameResult.amount.toLocaleString()} SO'M
              </span>
            </div>
            {gameResult.status === 'win' && (
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-secondary">
                <span>Company Tax (2%)</span>
                <span>-{gameResult.tax.toLocaleString()} SO'M</span>
              </div>
            )}
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground uppercase font-bold">Net Change</span>
              <span className={`text-xl font-black ${gameResult.status === 'win' ? 'text-primary' : gameResult.status === 'draw' ? 'text-white' : 'text-destructive'}`}>
                {gameResult.status === 'win' ? '+' : gameResult.status === 'draw' ? '0' : '-'}{(gameResult.status === 'win' ? gameResult.amount - betAmount : betAmount).toLocaleString()}
              </span>
            </div>
          </div>

          <Button onClick={() => router.push('/home')} className="w-full h-12 gold-gradient text-primary-foreground font-bold rounded-xl">RETURN HOME</Button>
        </Card>
      </div>
    );
  }

  return null;
}