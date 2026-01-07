
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users, Tractor, Store, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const loginRoles = [
  {
    name: 'Owner',
    path: '/admin-login',
    icon: Building2,
    description: 'Login as Owner',
    color: 'bg-blue-100/50 text-blue-600'
  },
  {
    name: 'Samiti',
    path: '/samiti-login',
    icon: Users,
    description: 'Login as Samiti',
    color: 'bg-indigo-100/50 text-indigo-600'
  },
  {
    name: 'Farmer',
    path: '/farmer-login',
    icon: Tractor,
    description: 'Portal Access',
    color: 'bg-green-100/50 text-green-600'
  },
  {
    name: 'Distributor',
    path: '/distributor-login',
    icon: Store,
    description: 'Portal Access',
    color: 'bg-orange-100/50 text-orange-600'
  },
  {
    name: 'Logistics',
    path: '/logistics-login',
    icon: Truck,
    description: 'Track & Manage',
    color: 'bg-purple-100/50 text-purple-600'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.3, ease: 'easeInOut' as const }
  },
};

const LoginSelectionCard = ({ role }: { role: typeof loginRoles[0] }) => {
  const navigate = useNavigate();
  const Icon = role.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      onClick={() => navigate(role.path)}
      className="group relative bg-white rounded-[2rem] p-6 md:p-8 flex flex-col items-center text-center cursor-pointer border border-gray-100 shadow-lg hover:border-blue-200 transition-colors"
    >
      <div className={`w-16 h-16 rounded-2xl ${role.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
      <p className="text-sm text-gray-500 mb-6">{role.description}</p>

      <div className="mt-auto w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </motion.div>
  );
};

const Login = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/login-bg-v2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Glass overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-[1400px] grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Left Side - Text */}
        <div className="space-y-8 text-center lg:text-left pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm mb-4"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-bold text-gray-900 tracking-wide">NAND DAIRY</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] uppercase tracking-wide">
              THE FUTURE OF  <br />
              <span className="text-blue-600">DAIRY DIGITAL</span>
            </h1>
          </motion.div>
        </div>

        {/* Right Side - Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Top Row */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-6 justify-center">
            <div className="w-full md:w-[calc(50%-12px)]">
              <LoginSelectionCard role={loginRoles[0]} />
            </div>
            <div className="w-full md:w-[calc(50%-12px)]">
              <LoginSelectionCard role={loginRoles[1]} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {loginRoles.slice(2).map((role) => (
              <LoginSelectionCard key={role.name} role={role} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quote - Bottom Left Corner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 max-w-lg hidden lg:block"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
          NAND  <span className="text-blue-600">DAIRY</span>
        </h2>
        <p className="text-lg text-gray-800 font-medium leading-relaxed border-l-4 border-blue-600 pl-4 mb-4">
          Smarter milk collection, instant pricing, seamless distribution, and real-time logistics — all in one place.
        </p>
        <p className="text-sm text-gray-600 pl-4 font-semibold">
          © 2024 Nand Dairy. All Rights Reserved.
        </p>
      </motion.div>

      {/* Mobile visible text (replaces the corner text on small screens) */}
      <div className="lg:hidden text-center mt-8 pb-8 relative z-10 px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
          THE FUTURE OF DAIRY, <span className="text-blue-600">DIGITAL.</span>
        </h2>
        <p className="text-base text-gray-800 font-medium leading-relaxed mb-4">
          Smarter milk collection, instant pricing, seamless distribution, and real-time logistics — all in one place.
        </p>
        <p className="text-sm text-gray-600 font-semibold">
          © 2024 Nand Dairy. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
