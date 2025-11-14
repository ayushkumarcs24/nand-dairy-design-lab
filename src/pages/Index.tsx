import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[hsl(42,45%,94%)] via-[hsl(40,35%,88%)] to-[hsl(42,45%,90%)]">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-white/20 blur-3xl animate-float" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[hsl(42,78%,60%)]/10 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-xl mb-4">
            <span className="text-3xl font-bold text-foreground">NAND</span>
          </div>
          
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Nand Dairy Management
            </h1>
            <p className="text-xl text-foreground/70">
              Premium dairy management system for modern operations
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <Link to="/admin-login">
              <Button className="h-12 px-8 bg-gradient-to-r from-[hsl(42,78%,60%)] to-[hsl(38,72%,55%)] hover:from-[hsl(42,78%,55%)] hover:to-[hsl(38,72%,50%)] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Admin Portal
              </Button>
            </Link>
            <Link to="/samiti-login">
              <Button className="h-12 px-8 bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 text-foreground font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Samiti Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
