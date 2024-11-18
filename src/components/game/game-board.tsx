"use client";

import { useState, useEffect } from "react";
import { useGameStore, type Player } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Gamepad2,
  Skull,
  Target,
  RotateCcw,
  XCircle,
  Crown,
  Diamond,
  Spade,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "motion/react";

function PlayerCard({
  player,
  onFire,
  isSelected,
  onSelect,
}: {
  player: Player;
  onFire: () => void;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      className={cn(
        "p-6 bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-800/30 shadow-xl transition-all hover:shadow-purple-900/20 hover:border-purple-700/40",
        isSelected && !player.isEliminated && "ring-2 ring-amber-500",
        player.isEliminated && "opacity-70 grayscale"
      )}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              {player.isEliminated ? (
                <Skull className="w-6 h-6 text-red-200" />
              ) : (
                <Target className="w-6 h-6 text-indigo-100" />
              )}
            </div>
            {isSelected && !player.isEliminated && (
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <h3
              className={cn(
                "text-xl sm:text-2xl font-bold text-indigo-100",
                player.isEliminated && "line-through text-red-200"
              )}
            >
              {player.name}
            </h3>
            <p className="text-sm sm:text-base text-indigo-300/70">
              Chamber {player.currentChamberIndex + 1}/6
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onSelect}
            disabled={player.isEliminated}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            className={cn(
              "bg-indigo-600 hover:bg-indigo-700 text-indigo-100",
              isSelected && "bg-amber-600 hover:bg-amber-700"
            )}
          >
            <Target className="w-4 h-4 mr-2" />
            Select
          </Button>
          <Button
            onClick={onFire}
            disabled={!isSelected || player.isEliminated}
            variant="destructive"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-red-100"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Fire
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {player.chambers.map((chamber, index) => {
          const isFired = player.firedChambers[index];
          return (
            <div
              key={index}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                isFired ? "bg-purple-900/50" : "bg-indigo-900/50",
                player.currentChamberIndex === index &&
                  "ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20"
              )}
            >
              {isFired ? (
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-indigo-400/50" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RandomCardSelector() {
  const [selectedCard, setSelectedCard] = useState<
    "King" | "Queen" | "Ace" | null
  >(null);
  const [animationKey, setAnimationKey] = useState(0); // New state to force animation reset

  const selectRandomCard = () => {
    const cards: ("King" | "Queen" | "Ace")[] = ["King", "Queen", "Ace"];
    const randomCard = cards[Math.floor(Math.random() * cards.length)] as
      | "King"
      | "Queen"
      | "Ace";
    setSelectedCard(randomCard);

    // Force animation reset by incrementing the key
    setAnimationKey((prevKey) => prevKey + 1);
  };

  const cardColor =
    selectedCard === "King"
      ? "bg-red-600"
      : selectedCard === "Queen"
      ? "bg-green-600"
      : selectedCard === "Ace"
      ? "bg-yellow-600"
      : "";

  const CardIcon =
    selectedCard === "King"
      ? Crown
      : selectedCard === "Queen"
      ? Diamond
      : selectedCard === "Ace"
      ? Spade
      : null;

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={selectRandomCard}
        className="bg-indigo-600 hover:bg-indigo-700 text-indigo-100 px-6 py-3 rounded-md"
      >
        Select Random Card
      </Button>

      {selectedCard && (
        <motion.div
          key={animationKey} // Key forces animation reset every time the card changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }} // smooth fade transition
          className={`w-24 h-24 flex items-center justify-center rounded-full ${cardColor}`}
        >
          {CardIcon && <CardIcon className="w-10 h-10 text-white" />}
        </motion.div>
      )}

      {selectedCard && (
        <motion.p
          key={`${animationKey}-p`} // Key forces animation reset every time the card changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }} // Add delay for text fade-in
          className="text-lg font-bold text-indigo-100 mt-2"
        >
          {selectedCard}
        </motion.p>
      )}
    </div>
  );
}

export function GameBoard() {
  const { players, fireChamber, resetGame, restartGame } = useGameStore();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [lastPlayerState, setLastPlayerState] = useState<Player[]>([]);

  const handleFire = (playerId: number) => {
    setLastPlayerState([...players]); // Store the state before firing
    fireChamber(playerId);
    setSelectedPlayerId(null);
  };

  const handleSelectPlayer = (playerId: number) => {
    setSelectedPlayerId(playerId === selectedPlayerId ? null : playerId);
  };

  // Check for eliminated players and show toast
  useEffect(() => {
    if (lastPlayerState.length > 0) {
      const newlyEliminated = players.find(
        (player) =>
          player.isEliminated &&
          !lastPlayerState.find((p) => p.id === player.id)?.isEliminated
      );

      if (newlyEliminated) {
        toast.warning(
          `${newlyEliminated.name} has been eliminated from the game! 💀`
        );
      }
    }
  }, [players, lastPlayerState]);

  // Check for game over condition
  useEffect(() => {
    const remainingPlayers = players.filter((p) => !p.isEliminated);
    if (players.length > 0 && remainingPlayers.length === 1) {
      const winner = remainingPlayers[0];
      toast.success(`${winner.name} is the last player standing! 🏆`);
      setTimeout(resetGame, 2000);
    }
  }, [players, resetGame]);

  const remainingPlayers = players.filter((p) => !p.isEliminated).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-4 rounded-lg border border-purple-800/30">
        <div className="text-indigo-100 mb-4 sm:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Liar&apos;s Bar Gun
          </h2>
          <p className="text-indigo-300">
            {remainingPlayers} player{remainingPlayers !== 1 ? "s" : ""}{" "}
            remaining
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={resetGame}
            variant="outline"
            className="border-indigo-700 hover:bg-indigo-900/50 text-slate-800 hover:text-indigo-400"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={restartGame}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedPlayerId === player.id}
            onSelect={() => handleSelectPlayer(player.id)}
            onFire={() => handleFire(player.id)}
          />
        ))}
      </div>

      <RandomCardSelector />
    </div>
  );
}
