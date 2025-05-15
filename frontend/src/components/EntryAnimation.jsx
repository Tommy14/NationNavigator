import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';

export default function EntryAnimation({ onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 5 }}
      onAnimationComplete={onComplete}
    >

      <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full top-10 left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-purple-500 opacity-20 blur-3xl rounded-full bottom-10 right-10 animate-pulse" />

      <motion.div
        className="bg-black bg-opacity-60 backdrop-blur-md px-8 py-10 rounded-2xl shadow-2xl text-white max-w-xl text-center border border-gray-700 animate-float"
        initial={{ scale: 0.85, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Floating emoji */}
        <motion.div
          className="text-5xl mb-4"
          initial={{ y: -10 }}
          animate={{ y: [ -10, 10, -10 ] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🌍
        </motion.div>

        {/* Typewriter text */}
        <div className="text-2xl font-mono leading-relaxed text-white">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString("Welcome to <strong>NationNavigator</strong>")
                .pauseFor(1000)
                .typeString("<br/>Your global journey begins here.")
                .pauseFor(1500)
                .callFunction(() => {
                  if (onComplete) onComplete();
                })
                .start();
            }}
            options={{
              delay: 35,
              cursor: '▌',
              wrapperClassName: 'inline-block',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
