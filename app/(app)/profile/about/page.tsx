import { Target, TrendingUp, Brain, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AboutAppPage() {
  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* Back Button */}
      <Link 
        href="/profile"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -inset-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-20" />
        <div className="relative">
          <p className="text-2xl font-black leading-tight mb-2 bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            About This App
          </p>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <span className="w-8 h-0.5 bg-linear-to-r from-indigo-500 to-transparent rounded-full" />
            Built for discipline, not motivation
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative rounded-3xl bg-white shadow-md p-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent" />
        <div className="relative">
          <p className="text-slate-700 leading-relaxed font-medium">
            This app is designed to help you build discipline through
            small, repeatable actions — not motivation. Discipline is
            what remains when motivation fades.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-4">
        <PrincipleCard
          icon={Target}
          title="How it works"
          description="You create habits. Every day you show up, the system records it. No streak pressure, no guilt — only data. Your actions speak louder than any counter."
          color="blue"
        />

        <PrincipleCard
          icon={TrendingUp}
          title="Level system"
          description="Your level is calculated using a rolling 4-week average. Levels can go up or down. This keeps progress honest and reflects your current commitment, not past glory."
          color="indigo"
        />

        <PrincipleCard
          icon={Brain}
          title="Why this is different"
          description="Most apps reward streaks. This app rewards consistency over time. A missed day doesn't destroy your progress — it's just data. What matters is showing up more often than not."
          color="purple"
        />

        <PrincipleCard
          icon={Shield}
          title="Your responsibility"
          description="The system does not judge you. It only reflects your actions. You are the architect of your discipline. This app is just the mirror that shows you the truth."
          color="slate"
        />
      </div>

      {/* Philosophy */}
      <div className="rounded-2xl bg-white shadow-sm p-6 border-l-4 border-blue-600">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">
          Our Philosophy
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          Discipline is not about being perfect. It&apos;s about being consistent.
          Small actions, repeated daily, compound into extraordinary results.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          This app will not lie to you. It will not inflate your ego. It will
          show you exactly where you stand. That honesty is what creates real change.
        </p>
      </div>

      {/* Version Info */}
      <div className="rounded-2xl bg-slate-50 p-5 text-center">
        <p className="text-xs text-slate-400 font-medium">
          Version 1.0 · Built for those who show up
        </p>
      </div>
    </div>
  );
}

function PrincipleCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  description: string;
  color: "blue" | "indigo" | "purple" | "slate";
}) {
  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
    purple: "bg-purple-500/10 text-purple-600",
    slate: "bg-slate-500/10 text-slate-600",
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-black text-slate-800 mb-2">{title}</p>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}