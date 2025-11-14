import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[hsl(42,45%,94%)] via-[hsl(40,35%,88%)] to-[hsl(42,45%,90%)]">
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-white/20 blur-3xl animate-float" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[hsl(42,78%,60%)]/10 blur-3xl" 
             style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-white/15 blur-3xl animate-float"
             style={{ animationDelay: "2s" }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg mb-4">
              <span className="text-2xl font-bold text-foreground">NAND</span>
            </div>
          </div>

          {/* Glass card */}
          <div className="glass-card rounded-3xl p-8 md:p-10 hover-lift">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Admin Portal
                </h1>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/60 border-white/40 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/60"
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
                      className="h-12 pr-12 bg-white/60 border-white/40 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/60"
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
                    className="text-sm text-foreground hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Forgot Password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[hsl(42,78%,60%)] to-[hsl(38,72%,55%)] hover:from-[hsl(42,78%,55%)] hover:to-[hsl(38,72%,50%)] text-white font-medium text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Log In
                </Button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-foreground/70 mt-8 animate-fade-in">
            © 2024 Nand Dairy. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
