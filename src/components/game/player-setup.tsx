"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGameStore } from "@/lib/store";
import { Card } from "@/components/ui/card";

export function PlayerSetup() {
  const [step, setStep] = useState<"count" | "names">("count");
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const { addPlayer, startGame } = useGameStore();

  const handlePlayerCountChange = (value: string) => {
    const count = parseInt(value);
    setPlayerCount(count);
    setStep("names");
  };

  const handlePlayerNamesSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!playerCount) return;

    const formData = new FormData(e.currentTarget);

    for (let i = 0; i < playerCount; i++) {
      const name = formData.get(`player${i}`)?.toString() || `Player ${i + 1}`;
      addPlayer(name);
    }

    startGame();
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700/50 shadow-xl">
      {step === "count" ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-amber-100 text-center sm:text-left">
            Select Number of Players
          </h2>
          <RadioGroup
            onValueChange={handlePlayerCountChange}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {[2, 3, 4].map((num) => (
              <div key={num} className="relative">
                <RadioGroupItem
                  value={num.toString()}
                  id={`player-count-${num}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`player-count-${num}`}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-zinc-700 bg-zinc-800/50 p-6 hover:bg-zinc-700/50 hover:border-amber-500/30 peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-500/10 transition-all cursor-pointer"
                >
                  <span className="text-3xl font-bold text-amber-100">
                    {num}
                  </span>
                  <span className="text-sm text-amber-200/60 mt-1">
                    Players
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ) : (
        <form onSubmit={handlePlayerNamesSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-amber-100 text-center sm:text-left">
            Enter Player Names
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {playerCount &&
              Array.from({ length: playerCount }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Label htmlFor={`player${i}`} className="text-amber-200/80">
                    Player {i + 1}
                  </Label>
                  <Input
                    id={`player${i}`}
                    name={`player${i}`}
                    placeholder={`Player ${i + 1}`}
                    className="bg-zinc-800/50 border-zinc-700 text-amber-100 placeholder:text-amber-200/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                  />
                </div>
              ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("count")}
              className="w-full sm:w-auto bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-amber-200 hover:text-amber-100"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-amber-50"
            >
              Start Game
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
