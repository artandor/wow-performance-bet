import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AlertCircle, Crown, Coins, Users, Trophy, Swords, Brain } from "lucide-react";

/* ── Discord SVG helper (Bootstrap Icons — eyes drawn as positive shapes) ── */
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
    </svg>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session) {
    redirect(params.callbackUrl || "/");
  }

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: "Please use the same Discord account you signed in with before.",
    AccessDenied: "Access denied. Please try again.",
  };

  const features = [
    {
      icon: Coins,
      title: "Gold Pool Bets",
      desc: "Stake in-game gold on which group will top the DPS charts.",
    },
    {
      icon: Brain,
      title: "Prediction Bets",
      desc: "Guess exact numbers — closest-number, over/under, binary, multiple choice.",
    },
    {
      icon: Swords,
      title: "Head-to-Head",
      desc: "Pick a side, back your champion and watch the gold flow your way.",
    }
  ];

  return (
    <div className="min-h-screen bg-night text-bright">

      {/* ──────────────── Sticky mini-nav ──────────────── */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold" />
            <span className="font-bold font-display tracking-wide">
              <span className="text-gold">Midas</span>
              <span className="text-bright/60">&apos;</span>
              <span className="text-bright"> Cartel</span>
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: params.callbackUrl || "/" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <DiscordIcon className="w-4 h-4" />
              Sign in
            </button>
          </form>
        </div>
      </header>

      {/* ──────────────── Hero ──────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[480px] w-full">
          {/* plain img — most reliable for local public assets */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hero.png"
            alt="WoW raid scene"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark gradient overlay so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/50 to-night" />
        </div>

        {/* Hero copy */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs font-semibold tracking-[0.25em] text-gold/60 uppercase mb-4">
            World of Warcraft · Guild Betting
          </p>
          <h1 className="font-display text-5xl sm:text-7xl font-black leading-none max-w-3xl mb-3">
            <span className="text-gold">Midas&apos;</span>
            <span className="text-bright"> Cartel</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed">
            Back your raiders with real gold, settle every argument with logs.
          </p>

          <div className="mt-10">
            <form
              action={async () => {
                "use server";
                await signIn("discord", { redirectTo: params.callbackUrl || "/" });
              }}
            >
              {params.error && (
                <div className="flex items-center gap-2 bg-table/20 border border-table/30 text-orange-300 text-sm px-4 py-2.5 rounded-lg mb-4 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMessages[params.error] ?? "An error occurred. Please try again."}
                </div>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-base px-8 py-4 rounded-2xl transition-colors shadow-2xl"
              >
                <DiscordIcon className="w-5 h-5" />
                Sign in with Discord
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ──────────────── Features ──────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-display text-2xl font-bold text-bright text-center mb-2">
          How it works
        </h2>
        <p className="text-muted text-center text-sm mb-10">
          Simple rules. Real stakes. Your guild, your gold.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-surface rounded-xl border border-white/10 p-5 flex flex-col gap-3 hover:border-gold/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <h3 className="font-semibold text-bright text-sm">{title}</h3>
              <p className="text-xs text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── Bottom CTA ──────────────── */}
      <section className="border-t border-white/8 bg-surface py-16 text-center px-4">
        <Crown className="w-8 h-8 text-gold mx-auto mb-4 opacity-80" />
        <h2 className="font-display text-xl font-bold text-bright mb-2">Ready to join the Cartel?</h2>
        <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
          Connect your Discord account and start betting on your guild&apos;s best performers.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: params.callbackUrl || "/" });
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/80 text-night font-bold px-7 py-3 rounded-xl transition-colors"
          >
            Get started
          </button>
        </form>
      </section>

    </div>
  );
}
