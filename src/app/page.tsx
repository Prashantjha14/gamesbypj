import GameCard from "@/components/game-card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-indigo-300 mb-12 leading-tight tracking-tight">
          Games By PJ
        </h1>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <GameCard
            href="/liars-bar-gun"
            title="Liar's Bar Gun"
            description="Test your luck in this thrilling game of chance where one wrong move could be your last."
          />
          <GameCard
            disabled
            title="More Games Coming Soon"
            description="Stay tuned for additional exciting games..."
          />
        </div>
      </div>
    </main>
  );
}
