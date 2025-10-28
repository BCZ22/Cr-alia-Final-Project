"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

const suggestions = [
  "Créer un Reel tendance pour Instagram",
  "Analyser les performances de mes vidéos",
  "Générer des idées de contenu viral",
  "Optimiser mes hashtags",
  "Créer une story engageante",
  "Adapter mon contenu pour TikTok",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export function ChatSuggestions() {
  return (
    <motion.div 
      className="text-center"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-2">Nouvelle Conversation</motion.h1>
      <motion.p variants={itemVariants} className="text-muted-foreground mb-8">Commencez par un message ou utilisez l'une de ces suggestions.</motion.p>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {suggestions.map((text, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Button variant="outline" className="h-auto w-full text-left whitespace-normal p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              {text}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
