import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AdminLoginProps {
  onNavigateToHome: () => void;
  onLoginSuccess: () => void;
}

export function AdminLogin({ onNavigateToHome, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login for demo
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, accept any credentials
      if (email && password) {
        onLoginSuccess();
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onNavigateToHome}
          className="mb-8 gap-2 text-gray-700 hover:text-[#0067B1] hover:bg-[#0067B1]/10 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {/* Icon Circle */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0067B1] to-[#005A9C] rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600">Sign in to manage the art collection</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fgcu.edu"
                  className="pl-12 h-14 bg-[#EDF3FF] border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0067B1]"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-12 pr-12 h-14 bg-[#EDF3FF] border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0067B1]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#0067B1] hover:bg-[#005A9C] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-8 p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <p className="text-sm font-medium text-amber-900 mb-2">Demo Credentials</p>
            <p className="text-xs text-amber-800">
              <strong>Email:</strong> Any valid email format<br />
              <strong>Password:</strong> Any password
            </p>
            <p className="text-xs text-amber-700 mt-2 italic">
              For demonstration purposes only
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; 2025 Florida Gulf Coast University
        </p>
      </div>
    </div>
  );
}
