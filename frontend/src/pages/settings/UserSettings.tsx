import { useState, useEffect, useRef } from 'react';
import { api, getStoredAuth, setStoredAuth } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Button } from '../../components/ui/Button';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { Camera, Lock, Mail, User, Phone, Briefcase } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  department: string | null;
  profilePhoto: string | null;
}

export const UserSettings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Email form
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const data = response.data.data;
      console.log('[UserSettings] Profile loaded:', data);
      setProfile(data);
      setFullName(data.fullName);
      setPhone(data.phone || '');
      setDepartment(data.department || '');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.patch('/users/profile', {
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        department: department.trim() || null,
      });
      setProfile(response.data.data);
      
      // Update stored auth
      const auth = getStoredAuth();
      if (auth) {
        setStoredAuth({
          ...auth,
          user: { ...auth.user, fullName: response.data.data.fullName },
        });
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setChangingPassword(true);
    try {
      await api.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail.trim() || !emailPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setChangingEmail(true);
    try {
      console.log('[UserSettings] Requesting email change to:', newEmail);
      console.log('[UserSettings] Auth token exists:', !!getStoredAuth()?.accessToken);
      
      const response = await api.post('/users/request-email-change', {
        newEmail: newEmail.trim(),
        password: emailPassword,
      });
      
      console.log('[UserSettings] Email change request successful:', response.data);
      toast.success('OTP sent to your new email address!');
      setOtpSent(true);
      setEmailPassword('');
    } catch (error: any) {
      console.error('[UserSettings] Email change request failed:', error);
      console.error('[UserSettings] Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to request email change');
    } finally {
      setChangingEmail(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setVerifyingOtp(true);
    try {
      console.log('[UserSettings] Verifying OTP:', otp);
      console.log('[UserSettings] Auth token exists:', !!getStoredAuth()?.accessToken);
      
      const response = await api.post('/users/confirm-email-change', { otp: otp.trim() });
      
      console.log('[UserSettings] OTP verification successful:', response.data);
      
      // Set success state
      setEmailChangeSuccess(true);
      
      // Show success message with longer duration
      toast.success('✅ Email changed successfully! Redirecting to login...', 4000);
      
      // Logout and redirect to login after showing message
      setTimeout(() => {
        console.log('[UserSettings] Logging out and redirecting...');
        setStoredAuth(null);
        window.location.href = '/login';
      }, 3500);
    } catch (error: any) {
      console.error('[UserSettings] OTP verification failed:', error);
      console.error('[UserSettings] Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to verify OTP');
      setVerifyingOtp(false);
    }
  };

  const handleCancelEmailChange = () => {
    setOtpSent(false);
    setNewEmail('');
    setOtp('');
    setEmailPassword('');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post('/users/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const photoUrl = response.data.data.photoUrl;
      setProfile((prev) => prev ? { ...prev, profilePhoto: photoUrl } : null);
      
      // Update stored auth to show photo in header immediately
      const auth = getStoredAuth();
      if (auth) {
        setStoredAuth({
          ...auth,
          user: { ...auth.user, profilePhoto: photoUrl },
        });
      }
      
      toast.success('Profile photo updated successfully');
      
      // Force a small delay to ensure the image is accessible
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('Are you sure you want to delete your profile photo?')) return;
    
    setUploadingPhoto(true);
    try {
      await api.delete('/users/profile-photo');
      setProfile((prev) => prev ? { ...prev, profilePhoto: null } : null);
      toast.success('Profile photo deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-white">Account Settings</h1>
        
        {/* Profile Photo Section */}
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <ProfileAvatar
                photoUrl={profile?.profilePhoto}
                fullName={profile?.fullName}
                size="xl"
              />
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                <Camera className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              {profile?.profilePhoto && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeletePhoto}
                  disabled={uploadingPhoto}
                >
                  Delete Photo
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Recommended: Square image, at least 200x200px, max 5MB
          </p>
        </div>

        {/* Profile Information */}
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <User className="mr-2 inline h-4 w-4" />
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <Phone className="mr-2 inline h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <Briefcase className="mr-2 inline h-4 w-4" />
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-slate-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Role</label>
                <input
                  type="text"
                  value={profile?.role || ''}
                  disabled
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-slate-400"
                />
              </div>
            </div>
            
            <Button type="submit" isLoading={saving} className="w-full">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Lock className="mr-2 inline h-5 w-5" />
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-slate-400">Minimum 6 characters</p>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" isLoading={changingPassword} className="w-full">
              Change Password
            </Button>
          </form>
        </div>

        {/* Change Email */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            <Mail className="mr-2 inline h-5 w-5" />
            Change Email Address
          </h2>
          
          {emailChangeSuccess ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-500 bg-green-900/30 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-300">
                  Email Changed Successfully!
                </h3>
                <p className="text-green-200">
                  Your email has been updated. Redirecting to login page...
                </p>
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-green-900">
                    <div className="h-full animate-pulse bg-green-500" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleRequestEmailChange} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              
              <Button type="submit" isLoading={changingEmail} className="w-full">
                Send OTP
              </Button>
              <p className="text-xs text-slate-400">
                A 6-digit OTP will be sent to your new email address
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="rounded-lg border border-green-800 bg-green-900/20 p-4">
                <p className="text-sm text-green-300">
                  ✓ OTP sent to <strong>{newEmail}</strong>
                </p>
                <p className="mt-1 text-xs text-green-400">
                  Check your email inbox and enter the 6-digit code below
                </p>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-center text-2xl font-mono tracking-widest text-white focus:border-sky-500 focus:outline-none"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="mt-1 text-xs text-slate-400">
                  Code expires in 15 minutes
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" isLoading={verifyingOtp} className="flex-1">
                  Verify OTP
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEmailChange}
                  disabled={verifyingOtp}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              
              <button
                type="button"
                onClick={handleRequestEmailChange}
                disabled={changingEmail}
                className="w-full text-sm text-sky-400 hover:text-sky-300 disabled:opacity-50"
              >
                Didn't receive the code? Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
