import React from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';

const CrossfadeBackground = ({ scrollYProgress }) => {
  // Use slightly smoother spring for sweeping imagery transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  // Image 1: Main Campus Intro (0% to 33%)
  const op1 = useTransform(smoothProgress, [0, 0.25, 0.33], [1, 1, 0]);
  const scale1 = useTransform(smoothProgress, [0, 0.33], [1, 1.1]);

  // Image 2: Desk setup (25% to 66%)
  const op2 = useTransform(smoothProgress, [0.25, 0.33, 0.58, 0.66], [0, 1, 1, 0]);
  const scale2 = useTransform(smoothProgress, [0.25, 0.66], [1, 1.15]);

  // Image 3: Students exchanging items (58% to 90%)
  const op3 = useTransform(smoothProgress, [0.58, 0.66, 0.85, 0.95], [0, 1, 1, 0]);
  const scale3 = useTransform(smoothProgress, [0.58, 0.95], [1, 1.15]);

  // Image 4: CTA Electronics Flatlay (85% to 100%)
  const op4 = useTransform(smoothProgress, [0.85, 0.95, 1], [0, 1, 1]);
  const scale4 = useTransform(smoothProgress, [0.85, 1], [1, 1.1]);

  const styleBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 0,
    willChange: 'opacity, transform'
  };

  return (
    <>
      <motion.img src="/bg/bg1.png" style={{ ...styleBase, opacity: op1, scale: scale1 }} alt="Campus" />
      <motion.img src="/bg/bg2.png" style={{ ...styleBase, opacity: op2, scale: scale2 }} alt="Desk setup" />
      <motion.img src="/bg/bg3.png" style={{ ...styleBase, opacity: op3, scale: scale3 }} alt="Students trading" />
      <motion.img src="/bg/bg4.png" style={{ ...styleBase, opacity: op4, scale: scale4 }} alt="Electronics flatlay" />
    </>
  );
};

export default CrossfadeBackground;
