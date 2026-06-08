"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('oshiqlar_auth', 'true');
      router.push('/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gold-gradient mb-4 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-black font-headline uppercase tracking-tighter text-primary">
            Oshiqlar Oyini
          </h1>
          <p className="text-muted-foreground font-body">Premium Dice Game Experience</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="glass-card shadow-2xl border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to continue your legacy.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Username" 
                      className="bg-background/50 border-white/10 focus:border-primary transition-all" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      className="bg-background/50 border-white/10 focus:border-primary transition-all" 
                      required 
                    />
                  </div>
                  <Button disabled={loading} className="w-full h-12 text-lg font-bold gold-gradient text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                    {loading ? "AUTHENTICATING..." : "ENTER ARENA"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="glass-card shadow-2xl border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Join the Elite</CardTitle>
                <CardDescription>Create your account and start your journey.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Input placeholder="Full Name" className="bg-background/50 border-white/10 focus:border-primary transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Username" className="bg-background/50 border-white/10 focus:border-primary transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Password" className="bg-background/50 border-white/10 focus:border-primary transition-all" required />
                  </div>
                  <Button disabled={loading} className="w-full h-12 text-lg font-bold gold-gradient text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                    {loading ? "CREATING PROFILE..." : "CLAIM 500k BONUS"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}