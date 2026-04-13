import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { api, getStoredAuth, setStoredAuth } from '../../lib/api';
import { formatRoleLabel, getHomePathForRole } from '../../lib/dashboardHome';
import { toast } from '../../lib/toast';
import { Button } from '../ui/Button';
import { ProfileAvatar } from '../ui/ProfileAvatar';
import { ClinicBrandLockup } from '../brand/ClinicBrandLockup';
import clsx from 'clsx';

type AuthUser = {
  role?: string;
  canSwitchToClinical?: boolean;
  canSwitchToAdmin?: boolean;
  fullName?: string;
  profilePhoto?: string | null;
};

const STAFF_CHAT_ROLES = new Set([
  'SUPER_ADMIN',
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'PHARMACIST',
  'LAB_TECH',
  'FINANCE',
  'EMERGENCY',
  'INJECTION_ROOM',
]);

export const AppHeader = () => {
  const navigate = useNavigate();
  const auth = getStoredAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [switching, setSwitching] = useState(false);

  const user = auth?.user as AuthUser | undefined;
  const role = user?.role as string | undefined;
  const home = getHomePathForRole(role);
  const showStaffChat = role && STAFF_CHAT_ROLES.has(role.toUpperCase().replace(/-/g, '_'));

  const logout = async () => {
    setLoggingOut(true);
    try {
      await api.post('/auth/logout').catch(() => undefined);
    } finally {
      setStoredAuth(null);
      setLoggingOut(false);
      setMenuOpen(false);
      toast.info('Signed out.');
      navigate('/login', { replace: true });
    }
  };

  const switchToDoctorMode = async () => {
    setSwitching(true);
    try {
      const resp = await api.post('/auth/switch-clinical');
      const payload = resp.data?.data as { user: AuthUser; token: string };
      if (!payload?.token || !payload.user) {
        throw new Error('Invalid switch response');
      }
      setStoredAuth({
        user: payload.user,
        accessToken: payload.token,
        refreshToken: payload.token,
      });
      toast.success('Switched to doctor account.');
      navigate(getHomePathForRole(payload.user.role));
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Could not switch to doctor mode.');
    } finally {
      setSwitching(false);
    }
  };

  const switchToAdminMode = async () => {
    setSwitching(true);
    try {
      const resp = await api.post('/auth/switch-admin');
      const payload = resp.data?.data as { user: AuthUser; token: string };
      if (!payload?.token || !payload.user) {
        throw new Error('Invalid switch response');
      }
      setStoredAuth({
        user: payload.user,
        accessToken: payload.token,
        refreshToken: payload.token,
      });
      toast.success('Switched to super admin account.');
      navigate(getHomePathForRole(payload.user.role));
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Could not switch to admin mode.');
    } finally {
      setSwitching(false);
    }
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'rounded-lg px-3 py-2 text-sm font-medium min-h-[44px] inline-flex items-center transition-colors',
      isActive ? 'bg-sky-500/20 text-sky-100' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <ClinicBrandLockup
            href={home}
            size="sm"
            theme="dark"
            className="max-w-[min(100%,14rem)] sm:max-w-[min(100%,20rem)] lg:max-w-xs"
            showSubtitle={false}
          />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Quick links">
            <NavLink to={home} className={navClass} end>
              Home
            </NavLink>
            {showStaffChat && (
              <NavLink to="/staff-chat" className={navClass}>
                Staff chat
              </NavLink>
            )}
            {role && role !== 'PATIENT' && (
              <NavLink to="/settings" className={navClass}>
                Settings
              </NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 min-h-[44px]"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Menu
          </button>
          <div className="hidden items-center gap-3 sm:flex">
            <ProfileAvatar
              photoUrl={user?.profilePhoto}
              fullName={user?.fullName}
              size="sm"
            />
            <div className="text-right">
              <p className="truncate text-sm font-medium text-slate-100 max-w-[10rem] lg:max-w-xs">
                {user?.fullName || 'Account'}
              </p>
              <p className="text-xs text-slate-500">{formatRoleLabel(role)}</p>
            </div>
          </div>
          {user?.canSwitchToClinical && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={switching}
              onClick={() => void switchToDoctorMode()}
              title="Use your linked doctor account for patient care"
            >
              Doctor mode
            </Button>
          )}
          {user?.canSwitchToAdmin && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={switching}
              onClick={() => void switchToAdminMode()}
              title="Return to super admin dashboard"
            >
              Admin mode
            </Button>
          )}
          <Button variant="outline" size="sm" isLoading={loggingOut} onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-nav-menu" className="border-t border-slate-800 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile quick links">
            <NavLink to={home} className={navClass} end onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            {showStaffChat && (
              <NavLink to="/staff-chat" className={navClass} onClick={() => setMenuOpen(false)}>
                Staff chat
              </NavLink>
            )}
            {role && role !== 'PATIENT' && (
              <NavLink to="/settings" className={navClass} onClick={() => setMenuOpen(false)}>
                Settings
              </NavLink>
            )}
            {user?.canSwitchToClinical && (
              <button
                type="button"
                className={navClass({ isActive: false })}
                onClick={() => {
                  setMenuOpen(false);
                  void switchToDoctorMode();
                }}
              >
                Doctor mode
              </button>
            )}
            {user?.canSwitchToAdmin && (
              <button
                type="button"
                className={navClass({ isActive: false })}
                onClick={() => {
                  setMenuOpen(false);
                  void switchToAdminMode();
                }}
              >
                Admin mode
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
