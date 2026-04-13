import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export type SubnavItem = { to: string; label: string };

export const ModuleSubnav = ({ items, ariaLabel }: { items: SubnavItem[]; ariaLabel: string }) => (
  <nav className="flex flex-wrap gap-2 mb-6" aria-label={ariaLabel}>
    {items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end
        className={({ isActive }) =>
          clsx(
            'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors min-h-[44px]',
            isActive
              ? 'bg-sky-500/20 text-sky-200 ring-1 ring-sky-500/40'
              : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
          )
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);
