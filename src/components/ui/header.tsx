import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './button';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="mt-4 mx-auto max-w-7xl px-6 py-3 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">ND</span>
          </div>
          <span className="text-xl font-bold text-foreground">Nand Dairy</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About Us</Link>
          <Link to="/products" className="text-foreground/80 hover:text-foreground transition-colors">Products</Link>
          <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
        </div>
        <div>
          <Link to="/">
            <Button className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg">
              Login
            </Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
