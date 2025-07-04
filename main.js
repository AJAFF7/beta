// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1700,
    height: 1167,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      webviewTag: true,
    },
    autoHideMenuBar: true,
     backgroundColor: "#00000000",
  });

  // Load local index.html immediately
  mainWindow.loadFile(path.join(__dirname, "index.html")).catch((err) => {
    console.error("Failed to load local HTML:", err);
  });

  // After DOM is ready, inject background image and styling
  mainWindow.webContents.on("dom-ready", () => {
    const imagePath =
       "file:///C:/Users/jaff/Environments/Alfa/resources/icons/k8s-bg.png";

    mainWindow.webContents.insertCSS(`
      * {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      ::-webkit-scrollbar { display: none; }

      body {
        background-image: url("${imagePath}");
        background-size: cover;
        background-position: center;
        overflow: hidden !important;
        margin: 0;
        height: 100vh;
        width: 100vw;
        border-radius: 14px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        background-color: transparent;
        font-family: 'Courier New', Courier, monospace;
      }

      html {
        border-radius: 12px;
        overflow: hidden;
        background-color: transparent;
      }
    `);
  });

  setTimeout(() => {
    mainWindow.loadURL("http://localhost:3535");
  }, 3000); // Give server.js a moment to start

  mainWindow.webContents.on("did-fail-load", (event, code, description) => {
    console.error(`❌ Failed to load frontend: ${description} (code: ${code})`);
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("✅ Frontend loaded successfully");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // ✅ Use Electron's built-in Node.js to run the server script
  const serverPath = path.join(__dirname, "server.js");

  // Ensure it exists
  if (!fs.existsSync(serverPath)) {
    console.error("❌ server.js not found:", serverPath);
    return;
  }

  // Import and run the backend directly
  require(serverPath);

  // Start the window
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const { spawn } = require("child_process");

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1700,
//     height: 1167,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   });

//   // Load frontend from backend server
//   setTimeout(() => {
//     mainWindow.loadURL("http://localhost:3535");
//   }, 5000); // Wait for backend to start

//   mainWindow.webContents.on(
//     "did-fail-load",
//     (event, errorCode, errorDescription) => {
//       console.error(
//         `❌ Failed to load frontend: ${errorDescription} (code: ${errorCode})`,
//       );
//     },
//   );

//   mainWindow.webContents.on("did-finish-load", () => {
//     console.log("✅ Frontend loaded successfully");
//   });

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// app.whenReady().then(() => {
//   // ✅ Correct backend path
//   const serverFolder = "/Users/jaff/Environments/beta-copy/server";
//   const serverScript = path.join(serverFolder, "server.js");

//   console.log(`🚀 Starting backend: ${serverScript}`);

//   const serverProcess = spawn("node", [serverScript], {
//     cwd: serverFolder,
//     shell: true,
//   });

//   serverProcess.stdout.on("data", (data) => {
//     console.log(`[server] ${data.toString()}`);
//   });

//   serverProcess.stderr.on("data", (data) => {
//     console.error(`[server error] ${data.toString()}`);
//   });

//   serverProcess.on("exit", (code) => {
//     console.error(`❌ Server process exited with code ${code}`);
//   });

//   createWindow();
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });

// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const { spawn } = require("child_process");
// const net = require("net");

// let mainWindow;
// let serverProcess;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1700,
//     height: 1167,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   });

//   // Show window after server is ready
//   waitForServer(3535, () => {
//     mainWindow.loadURL("http://localhost:3535");
//   });

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// function waitForServer(port, callback) {
//   const retry = () => {
//     const client = net.createConnection({ port }, () => {
//       client.end();
//       callback();
//     });
//     client.on("error", () => {
//       setTimeout(retry, 300); // retry every 300ms
//     });
//   };
//   retry();
// }

// app.whenReady().then(() => {
//   // 👇 Start your backend server
//   const serverPath = path.join(__dirname, "server", "server.js");
//   serverProcess = spawn("node", [serverPath], {
//     cwd: path.join(__dirname, "server"),
//     shell: true,
//     stdio: "inherit",
//   });

//   createWindow();
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("before-quit", () => {
//   if (serverProcess) serverProcess.kill();
// });
