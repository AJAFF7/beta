import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
//import Clock from './clock.js';

const GrafanaLinkButton = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  const goTo = (route) => {
    navigate(route);
  };

  const cleanMemory = async () => {
    try {
      await fetch('/api/clean-memory', { method: 'POST' });
    } catch (error) {
      alert('Failed to clean memory');
    }
  };

  const animateDots = async () => {
    setIsAnimating(true);
    let step = 0;
    const dots = document.querySelectorAll('.custom-dot'); // Select all dot elements
    const container = document.querySelector('.custom-dots-container');
    const handle = document.querySelector('.custom-handle'); // Select the handle button

    // Make the dots container visible and animate
    container.style.opacity = 1;
    container.style.visibility = 'visible'; // Make dots container visible

    // Start the interval to animate dots one by one
    const interval = setInterval(() => {
      if (step < dots.length) {
        const currentDot = dots[step];

        // Activate the current dot and apply the color change
        currentDot.classList.add('active');
        currentDot.classList.add(`step-${step + 1}`);

        step++;

        if (step === dots.length) {
          clearInterval(interval);

          setTimeout(() => {
            // After all dots finish, trigger the scale-up animation on the button
            handle.classList.add('scale-up');
            
            // Reset dots back to their initial state after the animation
            dots.forEach(dot => {
              dot.classList.remove('active');
              dot.classList.remove('step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6');
            });
            container.style.opacity = 0; // Hide dots again after animation
            container.style.visibility = 'hidden';
            setIsAnimating(false); // Animation finished

            // Remove the scale-up class to reset the button state
            setTimeout(() => {
              handle.classList.remove('scale-up');
            }, 600); // Ensure that the scale-up effect is done before removing it
          }, 1000); // Wait 1 second after the dots finish before scaling the button
        }
      }
    }, 1000); // Update every 1 second for the animation effect
  };

  const handleSwitchToggle = () => {
    if (!isAnimating) { // Only trigger the animation if it's not already running
      animateDots(); // Trigger animation
      cleanMemory(); // Perform memory cleaning
    }
  };

  return (
    <div>
      {/* Start of sections with arrow buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '40px' , marginBottom: '10px'}}>
      
      
        {/* New Button Section with Arrow buttons aligned */}
        <div className="custom-handl" onClick={handleSwitchToggle}>
          {/* Handle of the switch is now clickable, triggering animation */}
          <div className="custom-dots-container">
            <div className="custom-dot"></div>
            <div className="custom-dot"></div>
            <div className="custom-dot"></div>
            <div className="custom-dot"></div>
            <div className="custom-dot"></div>
            <div className="custom-dot"></div>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default GrafanaLinkButton;

