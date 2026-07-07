import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import CrossfadeBackground from '../components/CrossfadeBackground';
import { LiquidMetalButton } from '../components/ui/liquid-metal-button';

const Home = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Apply spring physics for buttery smooth scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Section 1: Intro (Flies in from Left)
  const opacity1 = useTransform(smoothProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
  const x1 = useTransform(smoothProgress, [0, 0.1], [-200, 0]);

  // Section 2: Buy & Sell (Flies in from Right)
  const opacity2 = useTransform(smoothProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const x2 = useTransform(smoothProgress, [0.3, 0.4], [200, 0]);

  // Section 3: Connect (Flies in from Top - Upside down motion)
  const opacity3 = useTransform(smoothProgress, [0.6, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
  const y3 = useTransform(smoothProgress, [0.6, 0.7], [-200, 0]);

  // Section 4: Call to Action (Flies in from Bottom up)
  const opacity4 = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
  const y4 = useTransform(smoothProgress, [0.85, 0.95], [100, 0]);

  return (
    <div ref={containerRef} style={{ height: '800vh', position: 'relative', background: '#000' }}>
      
      {/* Sticky Container */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* Epic High Definition Crossfade Backgrounds */}
        <CrossfadeBackground scrollYProgress={scrollYProgress} />
        
        {/* Dynamic Vignette overlay for cinematic framing */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)', mixBlendMode: 'multiply', zIndex: 1, pointerEvents: 'none' }}></div>
        
        {/* Dark subtle overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 10, 20, 0.3)', zIndex: 1, pointerEvents: 'none' }}></div>

        {/* Text Overlays - Inside Premium Glassmorphic Cards */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Block 1 (Left) */}
          <motion.div 
            className="hover-scale"
            style={{ 
              opacity: opacity1, x: x1, position: 'absolute', left: '8%', maxWidth: '450px',
              padding: '3rem', borderRadius: '32px', 
              background: 'rgba(20, 20, 25, 0.45)', // True iOS dark glass
              backdropFilter: 'saturate(180%) blur(25px)', WebkitBackdropFilter: 'saturate(180%) blur(25px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
             <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1.1, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
               Campus Trade
             </h1>
             <p style={{ fontSize: '1.25rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 400 }}>
               The ultimate marketplace for college students. Swap, sell, and elevate your campus lifestyle.
             </p>
          </motion.div>

          {/* Block 2 (Right) */}
          <motion.div 
            style={{ 
              opacity: opacity2, x: x2, position: 'absolute', right: '8%', maxWidth: '450px', textAlign: 'left',
              padding: '3rem', borderRadius: '32px', 
              background: 'rgba(20, 20, 25, 0.45)',
              backdropFilter: 'saturate(180%) blur(25px)', WebkitBackdropFilter: 'saturate(180%) blur(25px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>♻️</span>
                 </div>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', margin: 0, letterSpacing: '-0.03em' }}>
                   Buy & Sell
                 </h2>
             </div>
             <p style={{ fontSize: '1.25rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 400 }}>
               Discover textbooks, bicycles, gadgets, and more—exclusively from authenticated peers within your own college network.
             </p>
          </motion.div>

          {/* Block 3 (Top / Upside Down logic) */}
          <motion.div 
            style={{ 
              opacity: opacity3, y: y3, position: 'absolute', textAlign: 'center', maxWidth: '550px',
              padding: '3rem', borderRadius: '32px', 
              background: 'rgba(20, 20, 25, 0.45)',
              backdropFilter: 'saturate(180%) blur(25px)', WebkitBackdropFilter: 'saturate(180%) blur(25px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
          >
             <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                 <span style={{ fontSize: '2rem' }}>🎓</span>
             </div>
             <h2 style={{ fontSize: '3rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.03em' }}>
               Connect Instantly
             </h2>
             <p style={{ fontSize: '1.25rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 400, marginTop: '1rem' }}>
               Chat with sellers in real-time, negotiate deals instantly, and coordinate safe on-campus meetings with confidence.
             </p>
          </motion.div>

          {/* Block 4: CTA (Bottom) */}
          <motion.div 
            style={{ 
              opacity: opacity4, y: y4, position: 'absolute', bottom: '10%', textAlign: 'center',
              padding: '4rem', borderRadius: '32px', width: '90%', maxWidth: '800px',
              background: 'rgba(20, 20, 25, 0.45)',
              backdropFilter: 'saturate(180%) blur(25px)', WebkitBackdropFilter: 'saturate(180%) blur(25px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
             <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
               Ready to Join Your Campus?
             </h2>
             <p style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '2.5rem', fontWeight: 400 }}>
               Join thousands of students trading safely within their university network today.
             </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <LiquidMetalButton 
                label="Sign Up Now" 
                onClick={() => navigate('/register')}
                className="text-lg px-8 py-3"
              />
              <LiquidMetalButton 
                label="Log In" 
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-3"
              />
            </div>
          </motion.div>

        </div>
      </div>
      
    </div>
  );
};

export default Home;
