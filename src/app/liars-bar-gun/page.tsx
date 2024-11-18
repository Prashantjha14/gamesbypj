"use client";

import { useGameStore } from "@/lib/store";
import { PlayerSetup } from "@/components/game/player-setup";
import { GameBoard } from "@/components/game/game-board";

export default function LiarsBarGun() {
  const { gameStarted } = useGameStore();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Liar&apos;s Bar Gun
        </h1>
        {!gameStarted ? <PlayerSetup /> : <GameBoard />}
      </div>
    </main>
  );
}
