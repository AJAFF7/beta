// components/Vault.js
import React from 'react';
import './App.css';

const Embed12 = () => {
  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden border shadow">
      <webview
        src="http://192.168.0.1"
        style={{
          width: '1635px',
          height: '100vh',
          borderRadius: '12px', // ✅ Add this line
          overflow: 'hidden',
          marginLeft: '30px', // ✅ Added margin-left

        }}
      />
    </div>
  );
};

export default Embed12;
