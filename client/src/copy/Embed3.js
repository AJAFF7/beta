// components/Vault.js
import React from 'react';
import './App.css';

const Embed3 = () => {
  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden border shadow">
      <webview
        src="http://172.18.0.128"
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

export default Embed3;
