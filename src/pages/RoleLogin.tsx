import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { loginApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Mail, Lock, Eye, EyeOff, Droplets, TrendingUp, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

interface RoleLoginProps {
    role: "OWNER" | "SAMITI" | "FARMER" | "DISTRIBUTOR" | "LOGISTICS";
    title: string;
}

export default function RoleLogin({ role, title }: RoleLoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = await loginApi({ email, password, expectedRole: role });
            login("dummy-token", user as any);

            toast({
                title: "Login successful",
                description: `Welcome back, ${user.name}!`,
            });
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message || "Invalid credentials",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#FFFCF8]">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center relative">
                <Button
                    variant="ghost"
                    className="absolute top-8 left-8 hover:bg-[#F5E6D3] text-[#8B7355]"
                    onClick={() => navigate("/login")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <div className="max-w-md w-full mx-auto space-y-8">
                    <div className="space-y-2">
                        <div className="h-12 w-12 bg-[#F5E6D3] rounded-xl flex items-center justify-center mb-6">
                            <span className="text-[#8B7355] font-bold text-xl">N</span>
                        </div>
                        <h1 className="text-4xl font-serif text-[#4A4A4A] tracking-tight">Welcome Back</h1>
                        <p className="text-[#8B8B8B]">
                            Please enter your credentials to access the <span className="font-semibold text-[#8B7355]">{title}</span> portal.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#6B6B6B]">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0A0A0]" />
                                    <Input
                                        type="email"
                                        placeholder="name@nanddairy.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 bg-white border-[#E5E5E5] focus-visible:ring-[#D4C3B3] rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#6B6B6B]">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0A0A0]" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-12 bg-white border-[#E5E5E5] focus-visible:ring-[#D4C3B3] rounded-xl"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#6B6B6B]"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="border-[#D4C3B3] data-[state=checked]:bg-[#D4C3B3] data-[state=checked]:text-white" />
                                <label htmlFor="remember" className="text-sm font-medium text-[#6B6B6B] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Remember me
                                </label>
                            </div>
                            <button type="button" className="text-sm font-medium text-[#D4C3B3] hover:text-[#C3B2A2]">
                                Forgot Password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#D4C3B3] hover:bg-[#C3B2A2] text-white text-lg font-medium rounded-xl shadow-[0_4px_14px_0_rgba(212,195,179,0.39)] transition-all transform hover:-translate-y-0.5"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Sign In
                                </>
                            ) : (
                                "Sign In"
                            )}
                            {!isLoading && <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-[#8B8B8B]">
                        Don't have an account? <span className="font-semibold text-[#D4C3B3] cursor-pointer hover:underline">Contact Support</span>
                    </p>
                </div>
            </div>

            {/* Right Side - Visual Panel */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#Fdf6ed]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#Fdf6ed_0%,_#F5E6D3_100%)]"></div>

                {/* Decorative Swirls/Patterns resembling cream */}
                <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[conic-gradient(from_0deg_at_50%_50%,_#fffcf8_0deg,_#f5e6d3_360deg)] opacity-40 blur-[100px] animate-slow-spin"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550583724-b2692b85b150')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="relative w-full max-w-lg aspect-[4/5]">
                        {/* Glassmorphism Stats Cards */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-1/4 -left-4 right-4 h-64 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl p-6 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#F5E6D3] rounded-full">
                                        <Droplets className="w-6 h-6 text-[#8B7355]" />
                                    </div>
                                    <div>
                                        <p className="text-[#5D4037] font-bold">Daily Production</p>
                                        <p className="text-[#8B7355] text-xs">Updated 2m ago</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-[#D1FADF] text-[#027A48] text-xs font-bold rounded-full">
                                    +12%
                                </div>
                            </div>

                            {/* Fake Chart Bars */}
                            <div className="flex items-end justify-between h-24 gap-2 mt-4">
                                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-[#F5E6D3] rounded-t-lg transition-all hover:bg-[#E5D6C3]"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute bottom-1/4 -right-4 left-1/4 h-24 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-4 flex items-center gap-4"
                        >
                            <div className="h-12 w-12 rounded-full bg-[#8B7355] flex items-center justify-center">
                                <IndianRupee className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-[#5D4037] text-2xl font-bold">1.2M</p>
                                <p className="text-[#8B7355] text-xs font-medium">Total Revenue (WTD)</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-0 right-0 text-center space-y-2">
                    <h2 className="text-3xl font-serif text-[#4A4A4A] drop-shadow-sm">Pure Goodness,</h2>
                    <h2 className="text-3xl font-serif text-[#4A4A4A] drop-shadow-sm">Managed Intelligently.</h2>
                </div>
            </div>
        </div>
    );
}
