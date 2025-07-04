// components/Vault.js
import React from 'react';
import './App.css';

const Embed8 = () => {
  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden border shadow">
      <webview
        src="https://crm.ajs-engineer.com/"
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

export default Embed8;
