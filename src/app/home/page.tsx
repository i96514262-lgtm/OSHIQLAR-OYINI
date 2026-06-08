"use client";

import { useGameStore } from '@/app/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, Settings, LogOut, ShieldCheck, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const BETTING_TIERS = [
  { amount: 40000, label: "40k" },
  { amount: 100000, label: "100k" },
  { amount: 300000, label: "300k" },
  { amount: 700000, label: "700k" },
  { amount: 1000000, label: "1m" },
  { amount: 1200000, label: "1.2m" },
];

export default function HomePage() {
  const { user } = useGameStore();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('oshiqlar_auth');
    router.push('/auth');
  };

  const handleTierClick = (amount: number) => {
    if (user.balance < amount) {
      alert("Insufficient balance!");
      return;
    }
    router.push(`/game/${amount}`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-y-0.5">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="ml-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Player ID</p>
            <h2 className="text-sm font-bold text-primary">{user.id}</h2>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href="/admin">
             <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-primary">
                <Settings className="w-5 h-5" />
             </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-destructive" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="glass-card p-6 border-primary/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <TrendingUp className="w-24 h-24 text-primary" />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-muted-foreground text-sm font-medium flex items-center">
            <Wallet className="w-4 h-4 mr-2 text-primary" /> Total Balance
          </p>
          <h1 className="text-4xl font-black text-primary font-headline tracking-tighter">
            {user.balance.toLocaleString()} <span className="text-lg font-bold">SO'M</span>
          </h1>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button className="w-full bg-white/5 hover:bg-white/10 text-primary border border-primary/20 rounded-xl font-bold h-11">
            DEPOSIT
          </Button>
          <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold h-11">
            WITHDRAW
          </Button>
        </div>
      </Card>

      {/* Betting Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold font-headline text-primary uppercase tracking-wide">Select Betting Tier</h3>
          <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">Tax: 2%</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {BETTING_TIERS.map((tier) => (
            <button
              key={tier.amount}
              onClick={() => handleTierClick(tier.amount)}
              disabled={user.balance < tier.amount}
              className={`
                relative h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center space-y-1 group
                ${user.balance >= tier.amount 
                  ? 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5 active:scale-95' 
                  : 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'}
              `}
            >
              {user.balance >= tier.amount && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
              <span className="text-2xl font-black font-headline text-white group-hover:text-primary transition-colors">
                {tier.label}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Bet Amount
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-3 text-center space-y-1 rounded-xl">
          <p className="text-[10px] text-muted-foreground font-bold uppercase">Wins</p>
          <p className="text-lg font-black text-primary">124</p>
        </div>
        <div className="glass-card p-3 text-center space-y-1 rounded-xl">
          <p className="text-[10px] text-muted-foreground font-bold uppercase">Loses</p>
          <p className="text-lg font-black text-destructive">89</p>
        </div>
        <div className="glass-card p-3 text-center space-y-1 rounded-xl">
          <p className="text-[10px] text-muted-foreground font-bold uppercase">Win Rate</p>
          <p className="text-lg font-black text-secondary">58%</p>
        </div>
      </div>
    </div>
  );
}