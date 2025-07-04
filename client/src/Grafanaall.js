import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const CleanMemory = () => {
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  const cleanMemory = async () => {
    try {
      await fetch('/api/clean-memory', { method: 'POST' });
      // No success message is shown here, just silently perform memory cleaning
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
    container.style.visibility = 'visible';

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
            }, 600);
          }, 1000);
        }
      }
    }, 1000);
  };

  const handleSwitchToggle = () => {
    if (!isAnimating) {
      animateDots(); // Trigger animation
      cleanMemory(); // Perform memory cleaning
    }
  };

  return (
    <div>
      {/* Handle button for cleaning memory and starting the dot animation */}
      <div className="custom-handle" onClick={handleSwitchToggle}>
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
  );
};

export default CleanMemory;

