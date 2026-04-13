import { User } from 'lucide-react';
import clsx from 'clsx';

interface ProfileAvatarProps {
  photoUrl?: string | null;
  fullName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

const iconSizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export const ProfileAvatar = ({ 
  photoUrl, 
  fullName, 
  size = 'md',
  className 
}: ProfileAvatarProps) => {
  const getPhotoUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Get the API base URL and extract just the server part (without /api/v1)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    // Remove /api/v1 suffix if present to get the server base URL
    const serverUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
    
    // Construct the full URL
    const path = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = `${serverUrl}${path}`;
    
    console.log('[ProfileAvatar] Photo URL:', fullUrl);
    return fullUrl;
  };

  const fullPhotoUrl = getPhotoUrl(photoUrl);
  const initials = fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  console.log('[ProfileAvatar] Rendering:', { photoUrl, fullPhotoUrl, fullName, initials });

  if (fullPhotoUrl) {
    return (
      <img
        src={fullPhotoUrl}
        alt={fullName || 'Profile'}
        className={clsx(
          sizeClasses[size],
          'rounded-full object-cover',
          className
        )}
        onError={(e) => {
          // Fallback to initials if image fails to load
          console.error('[ProfileAvatar] Failed to load photo:', fullPhotoUrl);
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="${clsx(
                sizeClasses[size],
                'flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-white font-semibold',
                className
              )}">
                ${initials}
              </div>
            `;
          }
        }}
        onLoad={() => {
          console.log('[ProfileAvatar] ✅ Photo loaded successfully:', fullPhotoUrl);
        }}
      />
    );
  }

  // Fallback to initials
  return (
    <div
      className={clsx(
        sizeClasses[size],
        'flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-white font-semibold',
        className
      )}
    >
      {fullName ? initials : <User className={iconSizeClasses[size]} />}
    </div>
  );
};
