/**
 * The RH Console sign-in window: a terminal-style window on a dark grid, always dark whatever the site theme.
 */
export function LoginShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#050505] px-4 py-10 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="relative w-full max-w-[420px]">
        <section className="overflow-hidden rounded-xl border border-white/12 bg-[#0c0c0c] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="ml-2 truncate font-mono text-[11.5px] text-white/45">admin.ratulhasan.dev — rh-console</span>
          </div>
          <div className="px-6 pb-7 pt-6 sm:px-7">{children}</div>
        </section>
        <p className="mt-4 text-center font-mono text-[11px] text-white/30">
          Not the owner? <a href="https://ratulhasan.dev" className="underline-offset-2 hover:text-white/60 hover:underline">Back to ratulhasan.dev</a>
        </p>
      </div>
    </main>
  );
}

export const loginField = "flex items-center rounded-lg border bg-black transition-colors focus-within:border-white";
export const loginInput = "h-12 min-w-0 flex-1 bg-transparent px-3.5 font-mono text-[16px] text-white outline-none placeholder:text-white/20";
export const loginLabel = "mb-1.5 block font-mono text-[11.5px] text-white/50";
export const loginLink = "font-mono text-[12px] text-white/50 underline-offset-4 transition hover:text-white hover:underline";
export const loginButton =
  "mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-[15px] font-semibold text-black transition hover:bg-white/85 active:scale-[0.99] disabled:opacity-40";
