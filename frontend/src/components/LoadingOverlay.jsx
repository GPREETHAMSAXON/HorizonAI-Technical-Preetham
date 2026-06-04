import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = () => {
    const phrases = [
        "Ingesting behavioral topography...",
        "Normalizing focus/distraction variables...",
        "Executing Monte Carlo probability tree...",
        "Simulating 5,000 future timelines...",
        "Rendering Digital Twin..."
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev < phrases.length - 1 ? prev + 1 : prev));
        }, 800);
        return () => clearInterval(interval);
    }, [phrases.length]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            /* THE FIX: Removed solid bg-[#0a0a0c], added a transparent dark wash so the 3D canvas shines through */
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] overflow-hidden"
        >
            <div className="relative z-10 w-full max-w-5xl px-6 text-center">
                <div className="absolute top-[-20vh] left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50">
                    <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-sky-400"></div>
                    <span className="text-sky-400 font-mono text-xs tracking-widest uppercase mt-4">
                        System Processing
                    </span>
                </div>

                <div className="h-40 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                        >
                            {phrases[currentIndex]}
                        </motion.h2>
                    </AnimatePresence>
                </div>
            </div>

            {/* Edge-to-Edge Progress Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                    className="h-full bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </div>
        </motion.div>
    );
};

export default LoadingOverlay;