import Link from "next/link";
import { Gamepad } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GameCardProps {
  href?: string;
  title: string;
  description: string;
  disabled?: boolean;
}

export default function GameCard({
  href,
  title,
  description,
  disabled,
}: GameCardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (disabled) {
      return (
        <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 border-neutral-700 opacity-50 cursor-not-allowed rounded-xl shadow-lg">
          {children}
        </Card>
      );
    }

    if (href) {
      return (
        <Link href={href} className="block">
          <Card className="p-6 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 hover:bg-gradient-to-br hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 transition-all border-neutral-700 cursor-pointer group rounded-xl shadow-xl hover:shadow-2xl">
            {children}
          </Card>
        </Link>
      );
    }

    return (
      <Card className="p-6 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 border-neutral-700 rounded-xl shadow-lg">
        {children}
      </Card>
    );
  };

  return (
    <CardWrapper>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-600 transition-colors">
          {disabled ? (
            <span className="block w-8 h-8" />
          ) : (
            <Gamepad className="w-8 h-8 text-indigo-300 group-hover:text-indigo-400 transition-all" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-indigo-100 group-hover:text-indigo-300 transition-all">
            {title}
          </h2>
          <p className="text-neutral-400 group-hover:text-neutral-300 transition-all">
            {description}
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}
