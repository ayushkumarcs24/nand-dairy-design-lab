
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const loginRoles = [
  { name: 'Owner', path: '/admin-login' },
  { name: 'Samiti', path: '/samiti-login' },
  { name: 'Farmer', path: '/farmer-login' },
  { name: 'Distributor', path: '/distributor-login' },
  { name: 'Logistics', path: '/logistics-login' },
];

const LoginSelectionCard = ({ role, index }: { role: { name: string; path: string }, index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="glass-card rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      onClick={() => navigate(role.path)}
    >
      <h3 className="text-2xl font-semibold text-foreground">{role.name}</h3>
      <p className="text-muted-foreground">Login as {role.name}</p>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors duration-300">
        <ArrowRight className="w-6 h-6 text-foreground" />
      </div>
    </motion.div>
  );
};

const Login = () => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-50 text-foreground overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 bottom-0 left-0 right-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-xl mb-4"
          >
            <span className="text-3xl font-bold text-foreground">NAND</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-bold text-foreground"
          >
            Select Your Role
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="text-xl text-foreground/70"
          >
            Choose your portal to access the Nand Dairy ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {loginRoles.map((role, index) => (
            <LoginSelectionCard key={role.name} role={role} index={index} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center text-sm text-foreground/70 mt-16"
        >
          © 2024 Nand Dairy. All Rights Reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
