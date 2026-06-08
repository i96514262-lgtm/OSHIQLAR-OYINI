"use client";

import { useState, useEffect } from 'react';

export interface User {
  id: string;
  balance: number;
}

const DEFAULT_USER: User = {
  id: "izr0465",
  balance: 500000,
};

export function useGameStore() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('oshiqlar_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      localStorage.setItem('oshiqlar_user', JSON.stringify(DEFAULT_USER));
      setUser(DEFAULT_USER);
    }
  }, []);

  const updateBalance = (amount: number) => {
    if (!user) return;
    const newUser = { ...user, balance: user.balance + amount };
    setUser(newUser);
    localStorage.setItem('oshiqlar_user', JSON.stringify(newUser));
  };

  const setBalance = (amount: number) => {
    if (!user) return;
    const newUser = { ...user, balance: amount };
    setUser(newUser);
    localStorage.setItem('oshiqlar_user', JSON.stringify(newUser));
  };

  return { user, updateBalance, setBalance };
}