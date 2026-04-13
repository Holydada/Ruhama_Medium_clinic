import { ClinicBrandLockup } from '../components/brand/ClinicBrandLockup';

export function Success() {
  const auth = localStorage.getItem('ruhama_auth');
  const user = auth ? JSON.parse(auth).user : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <ClinicBrandLockup href="/" size="sm" theme="light" showSubtitle={false} />
          </div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h1>
          <p className="text-gray-600 mb-6">Welcome to Ruhama Clinic Management System</p>
          
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
              <p className="text-sm text-gray-600 mb-1">Logged in as:</p>
              <p className="font-semibold text-gray-900">{user.full_name || user.email}</p>
              <p className="text-sm text-gray-600 mt-2">Role: {user.role}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Dashboard pages are being set up. The authentication system is working correctly!
          </p>
        </div>
      </div>
    </div>
  );
}
