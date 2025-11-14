import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
    // Redirect to dashboard on successful login
    navigate('/admin/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-50 text-foreground overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 bottom-0 left-0 right-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_200px,#C9E2FF,transparent)]"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-card">
              <span className="text-2xl font-bold text-foreground">NAND</span>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Admin Portal
                </h1>
                <p className="text-muted-foreground">Welcome back, please login to your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@nanddairy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/60 border-white/40 focus:border-blue-500 transition-all duration-300 placeholder:text-muted-foreground/60"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-12 bg-white/60 border-white/40 focus:border-blue-500 transition-all duration-300 placeholder:text-muted-foreground/60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Log In
                </Button>
              </form>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center text-sm text-foreground/80 hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to role selection
            </Link>
          </div>

          <p className="text-center text-sm text-foreground/70 mt-8">
            © 2024 Nand Dairy. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
