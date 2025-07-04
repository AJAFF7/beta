
// components/Vault.js
import React from 'react';

const Vault = () => {
  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden border shadow">
      <webview
        src="http://localhost:3535/ui/vault/"
        style={{
          width: '1650px',
          height: '1200px',
          border: 'none',
        }}
      />
    </div>
  );
};

export default Vault;

