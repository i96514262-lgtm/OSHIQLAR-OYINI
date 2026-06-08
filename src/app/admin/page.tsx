"use client";

import { useGameStore } from '@/app/lib/store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldCheck, PlusCircle, Users, BarChart3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, setBalance } = useGameStore();
  const [topUpAmount, setTopUpAmount] = useState<string>("1000000");

  if (!user) return null;

  const handleTopUp = () => {
    const amount = parseInt(topUpAmount);
    if (isNaN(amount)) return;
    setBalance(user.balance + amount);
    alert(`Added ${amount.toLocaleString()} SO'M to balance!`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-lg">
             <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-black font-headline text-primary uppercase tracking-tighter">Admin Console</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Users</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-secondary font-bold">+12% from last week</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Platform Revenue</CardTitle>
            <BarChart3 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42,850,000 <span className="text-sm">SO'M</span></div>
            <p className="text-xs text-primary font-bold">2% tax accumulating</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Active Tables</CardTitle>
            <PlusCircle className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54</div>
            <p className="text-xs text-muted-foreground">High traffic detected</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-headline">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-primary font-bold uppercase text-[10px]">User ID</TableHead>
                <TableHead className="text-primary font-bold uppercase text-[10px]">Status</TableHead>
                <TableHead className="text-primary font-bold uppercase text-[10px]">Balance</TableHead>
                <TableHead className="text-primary font-bold uppercase text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-white/5 hover:bg-white/5">
                <TableCell className="font-medium text-white">{user.id}</TableCell>
                <TableCell>
                   <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">ADMIN</span>
                </TableCell>
                <TableCell className="text-white font-bold">{user.balance.toLocaleString()} SO'M</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Input 
                      className="w-32 h-8 bg-background/50 border-white/10" 
                      value={topUpAmount} 
                      onChange={(e) => setTopUpAmount(e.target.value)} 
                    />
                    <Button size="sm" onClick={handleTopUp} className="gold-gradient text-black font-bold h-8">TOP UP</Button>
                  </div>
                </TableCell>
              </TableRow>
              {/* Dummy Users */}
              <TableRow className="border-white/5 hover:bg-white/5 opacity-60">
                <TableCell className="font-medium">USR_9921</TableCell>
                <TableCell>
                   <span className="px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground text-[10px] font-bold border border-white/10">PLAYER</span>
                </TableCell>
                <TableCell>42,000 SO'M</TableCell>
                <TableCell className="text-right">
                   <Button size="sm" variant="ghost" className="h-8 border border-white/10">EDIT</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}