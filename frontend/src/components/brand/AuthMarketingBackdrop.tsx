import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Slightly lighter panel on the left on large screens */
  showSidePanel?: boolean;
  sidePanel?: ReactNode;
};

/**
 * Full-viewport layered background aligned with login (photo + gradients + grid).
 */
export function AuthMarketingBackdrop({ children, showSidePanel, sidePanel }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: 'url(/1662222-hospital-1802680_1920.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-950/90 via-slate-950/85 to-emerald-950/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(56,189,248,0.35),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_45%,black,transparent)]" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {showSidePanel && sidePanel && (
          <aside className="relative hidden border-b border-white/10 bg-gradient-to-b from-sky-600/25 via-slate-950/40 to-emerald-950/30 px-8 py-10 backdrop-blur-md lg:flex lg:w-[38%] lg:flex-col lg:justify-between lg:border-b-0 lg:border-r xl:px-12">
            {sidePanel}
          </aside>
        )}
        <div
          className={
            showSidePanel && sidePanel
              ? 'flex flex-1 flex-col justify-center px-4 py-10 sm:px-8'
              : 'flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8'
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
