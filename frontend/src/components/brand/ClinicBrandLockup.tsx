import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ClinicLogo } from './ClinicLogo';
import { CLINIC_SHORT_NAME, CLINIC_SYSTEM_TAGLINE } from '../../lib/clinicBrand';

const sizes = {
  sm: { frame: 'h-9 w-9 rounded-xl', img: 'h-7 w-7', title: 'text-base', sub: 'text-xs' },
  md: { frame: 'h-11 w-11 rounded-2xl', img: 'h-8 w-8', title: 'text-lg', sub: 'text-xs' },
  lg: { frame: 'h-14 w-14 rounded-2xl', img: 'h-10 w-10', title: 'text-xl', sub: 'text-sm' },
  xl: { frame: 'h-20 w-20 rounded-3xl', img: 'h-16 w-16', title: 'text-3xl', sub: 'text-base' },
} as const;

type Props = {
  size?: keyof typeof sizes;
  theme?: 'light' | 'dark';
  /** Dark theme only: frosted panel on photo backgrounds (e.g. login hero) */
  darkSurface?: 'default' | 'glass';
  href?: string;
  className?: string;
  showSubtitle?: boolean;
  subtitleOn?: 'always' | 'sm+';
};

export function ClinicBrandLockup({
  size = 'md',
  theme = 'light',
  href,
  className,
  showSubtitle = true,
  subtitleOn = 'sm+',
  darkSurface = 'default',
}: Props) {
  const s = sizes[size];
  const titleCls = theme === 'dark' ? 'text-slate-50' : 'text-gray-900';
  const subCls = theme === 'dark' ? 'text-slate-400' : 'text-gray-600';
  const frameCls =
    theme === 'dark'
      ? darkSurface === 'glass'
        ? 'border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm'
        : 'border-sky-500/40 bg-slate-900 shadow-[0_0_28px_rgba(56,189,248,0.25)]'
      : 'border-blue-100 bg-white shadow-md';

  const subVisibility = subtitleOn === 'always' ? '' : 'hidden sm:block';

  const inner = (
    <>
      <div
        className={clsx(
          'flex shrink-0 items-center justify-center border',
          s.frame,
          frameCls
        )}
      >
        <ClinicLogo imgClassName={clsx(s.img, 'object-contain')} />
      </div>
      <div className="min-w-0 text-left">
        <div className={clsx('truncate font-bold leading-tight tracking-tight', s.title, titleCls)}>
          {CLINIC_SHORT_NAME}
        </div>
        {showSubtitle && (
          <div className={clsx('mt-0.5 font-medium', s.sub, subCls, subVisibility)}>
            {CLINIC_SYSTEM_TAGLINE}
          </div>
        )}
      </div>
    </>
  );

  const row = (
    <div className={clsx('inline-flex min-w-0 items-center gap-3', className)}>{inner}</div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="inline-flex min-w-0 max-w-full rounded-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {row}
      </Link>
    );
  }

  return row;
}
