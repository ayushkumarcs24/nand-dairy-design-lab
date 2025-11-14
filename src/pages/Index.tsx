import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Header from '../components/ui/header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/cow-farm.jpg)'}}></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            {/* Placeholder for 3D milk splash */}
            <div className="w-64 h-64 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-5xl">🥛</span>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            Nand Dairy Management System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
          >
            From Farm to Your Family: A Journey of Purity.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-white">
            <p className="mb-2">Start the Journey</p>
            <ArrowDown className="w-8 h-8" />
          </div>
        </motion.div>
      </section>

      {/* Storytelling Scroll Page */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {storyScenes.map((scene, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col md:flex-row items-center gap-16 even:md:flex-row-reverse"
            >
              <div className="w-full md:w-1/2">
                <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                  {/* Placeholder for 3D model/animation */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">{scene.icon}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl font-bold mb-4 text-blue-600">{scene.title}</h2>
                <p className="text-lg text-gray-600">{scene.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2024 Nand Dairy Management System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const storyScenes = [
  {
    icon: '🐄',
    title: 'Scene 1: The Farmer\'s Dedication',
    description: 'Our journey begins with dedicated farmers who ensure the highest quality of milk, collected fresh every morning and evening.',
  },
  {
    icon: '🔬',
    title: 'Scene 2: Quality Check at Samiti',
    description: 'At the Samiti, every batch of milk undergoes rigorous FAT/SNF testing to guarantee its purity and nutritional value before it proceeds.',
  },
  {
    icon: '🏭',
    title: 'Scene 3: State-of-the-Art Production',
    description: 'The milk arrives at Nand Dairy\'s advanced factory, where it flows through a pristine 3D production line for processing.',
  },
  {
    icon: '📦',
    title: 'Scene 4: Perfect Packaging',
    description: 'Our dairy products are carefully packaged to seal in their freshness and quality, ready for their journey to you.',
  },
  {
    icon: '🚚',
    title: 'Scene 5: Swift Distribution',
    description: 'A dedicated fleet of distributors ensures that our products reach stores and shelves promptly, maintaining the cold chain throughout.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Scene 6: In Your Hands',
    description: 'Finally, our wholesome dairy products are enjoyed by families, bringing health and happiness to every home.',
  },
];

export default Index;
