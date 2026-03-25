"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TestimonialItem {
    /** Unique identifier for the card */
    id: string | number;
    /** Title/reviewer name displayed for the card */
    title: string;
    /** Optional headline quote */
    headline?: string;
    /** Description text for the card */
    description: string;
    /** Image URL/path for the card */
    image: string;
}

interface TestimonialsCardProps {
    /** Array of testimonial items to display */
    items: TestimonialItem[];
    /** Additional CSS classes for the container */
    className?: string;
    /** Whether to show navigation arrows (default: true) */
    showNavigation?: boolean;
    /** Whether to show the counter (default: true) */
    showCounter?: boolean;
    /** Whether to enable auto-play (default: false) */
    autoPlay?: boolean;
    /** Auto-play interval in ms (default: 3000) */
    autoPlayInterval?: number;
}

export function TestimonialsCard({
    items,
    className,
    showNavigation = true,
    showCounter = true,
    autoPlay = false,
    autoPlayInterval = 3000,
}: TestimonialsCardProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const activeItem = items[activeIndex];

    // Auto-play effect
    React.useEffect(() => {
        if (!autoPlay || items.length <= 1) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, items.length]);

    const handleNext = () => {
        if (activeIndex < items.length - 1) {
            setDirection(1);
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setDirection(-1);
            setActiveIndex(activeIndex - 1);
        }
    };

    // Pre-calculate rotations for visual variety
    const rotations = useMemo(() => [4, -2, -9, 7], []);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className={cn("flex items-center justify-center p-8", className)}>
            <div
                className="relative flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-4xl mx-auto"
                style={{ perspective: "1400px" }}
            >
                {/* Image Card Stack */}
                <div className="relative w-full md:w-auto shrink-0">
                    <div className="w-75 h-75 relative">
                        <AnimatePresence custom={direction}>
                            {items.map((item, index) => {
                                const isActive = index === activeIndex;
                                const offset = index - activeIndex;

                                return (
                                    <motion.div
                                        key={item.id}
                                        className="absolute inset-0 w-full h-full overflow-hidden border-[6px] bg-neutral-200 dark:bg-neutral-800 border-white dark:border-neutral-700 shadow-2xl rounded-lg"
                                        initial={{
                                            x: offset * 15,
                                            y: Math.abs(offset) * 6,
                                            z: -150 * Math.abs(offset),
                                            scale: 0.85 - Math.abs(offset) * 0.04,
                                            rotateZ: rotations[index % 4],
                                            opacity: isActive ? 1 : 0.5,
                                            zIndex: 10 - Math.abs(offset),
                                        }}
                                        animate={
                                            isActive
                                                ? {
                                                    x: [offset * 15, direction === 1 ? -200 : 200, 0],
                                                    y: [Math.abs(offset) * 6, 0, 0],
                                                    z: [-200, 150, 250],
                                                    scale: [0.85, 1.05, 1],
                                                    rotateZ: [rotations[index % 4], -5, 0],
                                                    opacity: 1,
                                                    zIndex: 100,
                                                }
                                                : {
                                                    x: offset * 15,
                                                    y: Math.abs(offset) * 6,
                                                    z: -150 * Math.abs(offset),
                                                    rotateZ: rotations[index % 4],
                                                    scale: 0.85 - Math.abs(offset) * 0.04,
                                                    opacity: 0.55,
                                                    zIndex: 10 - Math.abs(offset),
                                                }
                                        }
                                        exit={{
                                            x: direction === 1 ? -250 : 250,
                                            z: -260,
                                            scale: 0.75,
                                            rotateZ: direction === 1 ? -10 : 10,
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.75,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Counter */}
                    {showCounter && (
                        <div className="text-center font-mono text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                            {activeIndex + 1} / {items.length}
                        </div>
                    )}
                </div>

                {/* Text Area */}
                <div className="flex-1 w-full min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem.id}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -25 }}
                            transition={{ duration: 0.35 }}
                            className="flex flex-col gap-4"
                        >
                            {activeItem.headline && (
                                <p className="text-lg md:text-xl font-semibold text-primary italic leading-snug">
                                    &quot;{activeItem.headline}&quot;
                                </p>
                            )}
                            <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                                {activeItem.title}
                            </h3>
                            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {activeItem.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    {showNavigation && items.length > 1 && (
                        <div className="flex gap-3 mt-6">
                            <button
                                disabled={activeIndex === 0}
                                onClick={handlePrev}
                                className={cn(
                                    "flex items-center justify-center w-12 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-all",
                                    activeIndex === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-105"
                                )}
                                aria-label="Previous card"
                            >
                                <ArrowLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                            </button>
                            <button
                                disabled={activeIndex === items.length - 1}
                                onClick={handleNext}
                                className={cn(
                                    "flex items-center justify-center w-12 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-all",
                                    activeIndex === items.length - 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-105"
                                )}
                                aria-label="Next card"
                            >
                                <ArrowRight className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TestimonialsCard;
