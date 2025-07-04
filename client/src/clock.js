
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock flex justify-center items-center h-screen bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl border border-gray-400 text-center">
        <h4 className="text-5xl font-bold tracking-wider flex gap-2" style={{ color: "#555555", marginRight: "0px" }}>
          {time.toLocaleTimeString().split("").map((char, index) => (
            <motion.span
              key={index}
              style={{ color: "#727272" }} // Force color on each digit
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {char}
            </motion.span>
          ))}
        </h4>
      </div>
    </div>
  );
};

export default Clock;

