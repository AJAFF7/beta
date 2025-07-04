import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalPopup = ({ isOpen, onClose }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);

    useEffect(() => {
        if (isOpen && terminalRef.current) {
            const term = new Terminal({
                rows: 10,
                cols: 50,
                theme: { background: "#1e1e1e", foreground: "#ffffff" }
            });

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.open(terminalRef.current);
            fitAddon.fit();
            term.write("Welcome to the React Terminal!\r\n");

            xtermRef.current = term;
        }

        return () => xtermRef.current?.dispose();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            backgroundColor: "#000", padding: "10px", borderRadius: "5px", zIndex: 1000
        }}>
            <div ref={terminalRef} style={{ width: "400px", height: "200px" }}></div>
            <button onClick={onClose} style={{ marginTop: "10px", color: "white", background: "red", border: "none", padding: "5px" }}>
                Close
            </button>
        </div>
    );
};

export default TerminalPopup;
