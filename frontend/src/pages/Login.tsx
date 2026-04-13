import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, setStoredAuth } from "../lib/api";
import { getHealthCheckUrl } from "../lib/apiOrigin";
import { ClinicBrandLockup } from "../components/brand/ClinicBrandLockup";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAs, setLoginAs] = useState<"staff" | "patient">("staff");
  const [apiHealth, setApiHealth] = useState<"checking" | "ok" | "degraded" | "down">("checking");
  
  // OTP state
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [credentials, setCredentials] = useState<{email: string; password: string} | null>(null);

  useEffect(() => {
    const url = getHealthCheckUrl();
    fetch(url, { method: "GET" })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as {
          success?: boolean;
          database?: string;
        };
        if (!res.ok) {
          setApiHealth("down");
          return;
        }
        if (body.database === "ok") setApiHealth("ok");
        else setApiHealth("degraded");
      })
      .catch(() => setApiHealth("down"));
  }, []);

  useEffect(() => {
    const verifyToken = searchParams.get("verifyToken") || searchParams.get("token");
    if (!verifyToken) return;

    api
      .get(`/auth/verify-email?token=${encodeURIComponent(verifyToken)}`)
      .then(() => {
        setError("Email verified successfully. You can now login.");
      })
      .catch((e: any) => {
        const msg = e?.response?.data?.error ?? "Email verification failed";
        setError(msg);
      });
  }, [searchParams]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const endpoint = "/auth/login";
      const payload = requiresOTP ? { ...values, otp } : values;
      const resp = await api.post(endpoint, payload);
      
      // Backend returns {success: true, data: {user, token}}
      const { data } = resp.data as any;
      const { user, token } = data;

      console.log('=== LOGIN SUCCESS ===');
      console.log('User:', user);
      console.log('Token received:', token?.substring(0, 20) + '...');
      
      const authData = { user, accessToken: token, refreshToken: token };
      console.log('Storing auth data:', authData);
      setStoredAuth(authData);
      
      // Verify storage immediately
      const stored = localStorage.getItem('ruhama_auth');
      console.log('Verification - stored in localStorage:', !!stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Verification - has accessToken:', !!parsed.accessToken);
        console.log('Verification - has user:', !!parsed.user);
      }

      const role = user.role?.toLowerCase() || "";

      switch (role) {
        case "receptionist":
          navigate("/receptionist-dashboard");
          break;
        case "doctor":
          navigate("/doctor-dashboard");
          break;
        case "nurse":
          navigate("/nurse-dashboard");
          break;
        case "pharmacist":
          navigate("/pharmacist-dashboard");
          break;
        case "lab_tech":
        case "lab-tech":
        case "lab_technician":
        case "lab-technician":
          navigate("/lab-dashboard");
          break;
        case "finance":
        case "accountant":
          navigate("/finance-dashboard");
          break;
        case "emergency":
          navigate("/emergency-dashboard");
          break;
        case "injection_room":
          navigate("/injection-dashboard");
          break;
        case "patient":
          navigate("/patient-dashboard");
          break;
        case "admin":
        case "super_admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/admin-dashboard");
      }
    } catch (e: any) {
      // Check if OTP is required
      if (e?.response?.data?.requiresOTP) {
        setRequiresOTP(true);
        setCredentials(values);
        setError('This is your first login. Please check your email for the OTP code.');
        return;
      }

      const apiErr = e?.response?.data?.error;
      const msg =
        (typeof apiErr === "string" ? apiErr : undefined) ??
        e?.response?.data?.message ??
        (e?.message?.toLowerCase().includes("network")
          ? "Cannot reach server. Check that the API is running and VITE_API_URL is correct."
          : "Invalid email or password");
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/1662222-hospital-1802680_1920.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/90 via-blue-600/85 to-emerald-600/90" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <ClinicBrandLockup
              href="/"
              size="xl"
              theme="dark"
              darkSurface="glass"
              subtitleOn="always"
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-lg text-white/90">
                Sign in to access your clinic dashboard and manage patient care efficiently.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">30K+</div>
                <div className="text-sm text-white/80 mt-1">Patients Served</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">18+</div>
                <div className="text-sm text-white/80 mt-1">Specialties</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/80 mt-1">Support</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/70">
            © {new Date().getFullYear()} Ruhama Metekiya Medium Clinic. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <ClinicBrandLockup href="/" size="lg" theme="dark" subtitleOn="always" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-50 mb-2">Sign In</h2>
            <p className="text-slate-400 mb-6">
              Enter your credentials to access the dashboard
            </p>

            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                apiHealth === "ok"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : apiHealth === "degraded"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
                  : apiHealth === "checking"
                  ? "border-slate-600 bg-slate-800/50 text-slate-300"
                  : "border-red-500/30 bg-red-500/10 text-red-200"
              }`}
            >
              {apiHealth === "checking" && "Checking API and database…"}
              {apiHealth === "ok" && "API and database are reachable. You can sign in."}
              {apiHealth === "degraded" &&
                "API is up but the database check failed. Sign-in may not work until the database is fixed."}
              {apiHealth === "down" &&
                "Cannot reach the API health endpoint. Confirm the backend is running and VITE_API_URL is correct."}
            </div>

            {/* Login Type Selector */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setLoginAs("staff")}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  loginAs === "staff"
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                    : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300"
                }`}
              >
                Staff / Doctor
              </button>
              <button
                type="button"
                onClick={() => setLoginAs("patient")}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  loginAs === "patient"
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                    : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300"
                }`}
              >
                Patient
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex items-start gap-3">
                <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-200">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    placeholder="doctor@ruhama.clinic"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
                    onClick={() => window.location.href = "/forgot-password"}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-10 pr-12 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {requiresOTP && (
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    First Login OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="block w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-500 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-center text-2xl font-mono tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <p className="mt-2 text-sm text-emerald-400">
                    Check your email for the 6-digit OTP code sent after approval
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                  />
                  <span className="text-sm text-slate-300">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-900/50 hover:from-sky-400 hover:to-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
              <p className="text-center text-sm text-slate-400">
                Staff account?{" "}
                <a href="/register" className="font-semibold text-sky-400 hover:text-sky-300">
                  Register here
                </a>
              </p>
              <p className="text-center text-sm text-slate-400">
                Have a clinic card?{" "}
                <a href="/register-patient" className="font-semibold text-emerald-400 hover:text-emerald-300">
                  Patient portal signup
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
