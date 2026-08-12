"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { FlashIcon, CheckmarkCircle02Icon, HourglassIcon } from "@hugeicons/core-free-icons";

const STEPS = [
  { id: 1, text: "Uploading document" },
  { id: 2, text: "Detecting document information" },
  { id: 3, text: "Extracting medical information" },
  { id: 4, text: "Verifying data quality" },
  { id: 5, text: "Ready for review" },
];

type StepStatus = "pending" | "in-progress" | "done";

export default function ProcessingPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = React.use(params);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const duration = 8000; // 8 seconds total
    const interval = 100;
    const stepsCount = duration / interval;
    let currentStepCount = 0;

    const progressTimer = setInterval(() => {
      currentStepCount++;
      setProgress(Math.min((currentStepCount / stepsCount) * 100, 100));
      
      if (currentStepCount >= stepsCount) {
        clearInterval(progressTimer);
      }
    }, interval);

    // Step state machine timeouts
    const t1 = setTimeout(() => setCurrentStep(1), 500); // 1: Detecting
    const t2 = setTimeout(() => setCurrentStep(2), 2500); // 2: Extracting
    const t3 = setTimeout(() => setCurrentStep(3), 5000); // 3: Verifying
    const t4 = setTimeout(() => setCurrentStep(4), 7000); // 4: Ready
    const t5 = setTimeout(() => setCurrentStep(5), 8000); // 5: Done
    
    const t6 = setTimeout(() => {
      // Navigate to the review page under the current [type] route
      router.push(window.location.pathname.replace('/processing', '/review'));
    }, 8500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [code, router]);

  const getStepStatus = (index: number): StepStatus => {
    if (currentStep > index) return "done";
    if (currentStep === index) return "in-progress";
    return "pending";
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* Top Lightning Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-16 h-16 bg-[#A7F3D0] rounded-full flex items-center justify-center mb-8 shadow-sm"
        >
          <HugeiconsIcon icon={FlashIcon} className="w-8 h-8 text-emerald-950" />
        </motion.div>

        {/* Text */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-950 mb-3 font-heading">
            AI is reading your document
          </h1>
          <p className="text-lg text-slate-500">
            this usually takes 10-20 seconds
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full h-3 bg-slate-300 rounded-full overflow-hidden mb-12"
        >
          <motion.div 
            className="h-full bg-emerald-900 rounded-full"
            style={{ width: `${progress}%` }}
            layout
          />
        </motion.div>

        {/* Steps List */}
        <div className="w-full sm:w-4/5 flex flex-col gap-6">
          {STEPS.map((step, index) => {
            const status = getStepStatus(index);
            
            return (
              <motion.div 
                key={step.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className={`flex items-center gap-4 ${
                  status === "in-progress" ? "bg-orange-50/80 px-4 py-3 -mx-4 rounded-xl shadow-sm border border-orange-100/50" : "px-0 py-3"
                } transition-all duration-300`}
              >
                <div className="shrink-0 w-8 h-8 flex items-center justify-center relative">
                  <AnimatePresence mode="wait">
                    {status === "done" && (
                      <motion.div
                        key="done"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-emerald-700 rounded-full flex items-center justify-center"
                      >
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                    {status === "in-progress" && (
                      <motion.div
                        key="in-progress"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute inset-0 rounded-full border-2 border-orange-200 bg-orange-100 flex items-center justify-center"
                      >
                        <motion.div
                           animate={{ rotate: 360 }}
                           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        >
                          <HugeiconsIcon icon={HourglassIcon} className="w-5 h-5 text-orange-500" />
                        </motion.div>
                      </motion.div>
                    )}
                    {status === "pending" && (
                      <motion.div
                        key="pending"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-slate-300 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </div>
                
                <span className={`font-semibold transition-colors duration-300 ${
                  status === "done" ? "text-emerald-950" : 
                  status === "in-progress" ? "text-emerald-950" : "text-emerald-950/70"
                }`}>
                  {step.text}
                </span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
