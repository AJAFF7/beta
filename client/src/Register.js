import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ICONS
const UserIcon = () => (
  <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
    <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
  </svg>
);

const LockIcon = () => (
  <svg width="23" height="23" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
    <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6zm6 12H9v-4h6v4z" />
  </svg>
);

const SubmitIcon = ({ onClick }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);



// ✅ Register Component
const Register = ({
  handlePlusClick,
  showAuthPrompt,
  setShowAuthPrompt,
  authCode,
  setAuthCode,
  countdown,
  authShake,
  handleAuthSubmit
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/personal1-regis", { username, password });

      setUsername("");
      setPassword("");

      setAlertMessage("Registration Completed");
      setAlertType("success");

      setTimeout(() => {
        setAlertMessage("");
        navigate("/");
      }, 1000);
    } catch (error) {
      setAlertMessage("Username Already Exists");
      setAlertType("error");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setAlertMessage(""), 1000);
    }
  };

  return (
    <div className="fullscreen-wrapper">
      <div className="login-container">
        <div className="login-box">
          <form onSubmit={onSubmit} className={shake ? "shake" : ""}>
            <h4 className="login-name">Register</h4>
            <div className="form-content">
              <div className="form-group">
                <UserIcon />
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      document.getElementById("password").focus();
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <LockIcon />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSubmit(e);
                    }
                  }}
                />
              </div>
              <div className="submit-container">
                <button
                  type="submit"
                  style={{ background: "none", border: "none", padding: 0 }}
                  aria-label="Submit Register"
                >
                  <SubmitIcon />
                </button>
              </div>
            </div>
          </form>

         

          {showAuthPrompt && (
            <div className="auth-prompt">
              <p
                className="close-auth"
                onClick={() => {
                  setShowAuthPrompt(false);
                  setAuthCode("");
                }}
              >
                {countdown > 0 ? countdown : "Closed"}
              </p>
              <h4 className="title">Authentication Code</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAuthSubmit();
                }}
              >
                <input
                  type="text"
                  placeholder="Code"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className={authShake ? "shake" : ""}
                />
                <div className="auth-buttons">
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          )}

          {/* ✅ Popup Message */}
          {alertMessage && (
            <div className={`popup-message ${alertType}`}>
              {alertMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;






// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// // ICONS
// const UserIcon = () => (
//   <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
//     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
//     <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="23" height="23" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
//     <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
//     <path d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6zm6 12H9v-4h6v4z" />
//   </svg>
// );

// const SubmitIcon = ({ onClick }) => (
//   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
//     <path d="M5 12h14" />
//     <path d="M12 5l7 7-7 7" />
//   </svg>
// );

// const ChangeIcon = () => (
//   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="12" cy="12" r="10" />
//     <line x1="12" y1="7" x2="12" y2="17" />
//     <line x1="7" y1="12" x2="17" y2="12" />
//     <path d="M12 2 A10 10 0 0 0 2 12" />
//   </svg>
// );

// // ✅ Register Component
// const Register = ({
//   handlePlusClick,
//   showAuthPrompt,
//   setShowAuthPrompt,
//   authCode,
//   setAuthCode,
//   countdown,
//   authShake,
//   handleAuthSubmit
// }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("");
//   const [shake, setShake] = useState(false);
//   const navigate = useNavigate();

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.post("/personal1-regis", { username, password });

//       setUsername("");
//       setPassword("");

//       setAlertMessage("Registration Completed");
//       setAlertType("success");
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     } catch (error) {
//       setAlertMessage("Username Already Exists");
//       setAlertType("error");
//       setShake(true);
//       setTimeout(() => setShake(false), 500);
//       console.error(error);
//     }
//   };

//   return (
//     <div className="fullscreen-wrapper">
//       <div className="login-container">
//         <div className="login-box">
//           <form onSubmit={onSubmit} className={shake ? "shake" : ""}>
//             <h4 className="login-name">Register</h4>
//             <div className="form-content">
//               <div className="form-group">
//                 <UserIcon />
//                 <input
//                   type="text"
//                   id="username"
//                   placeholder="Username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       document.getElementById("password").focus();
//                     }
//                   }}
//                 />
//               </div>
//               <div className="form-group">
//                 <LockIcon />
//                 <input
//                   type="password"
//                   id="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       onSubmit(e);
//                     }
//                   }}
//                 />
//               </div>
//               <div className="submit-container">
//                 <button
//                   type="submit"
//                   style={{ background: "none", border: "none", padding: 0 }}
//                   aria-label="Submit Register"
//                 >
//                   <SubmitIcon />
//                 </button>
//               </div>
//             </div>
//           </form>

//           <button className="change" onClick={handlePlusClick} aria-label="Open Auth Prompt">
//             <ChangeIcon />
//           </button>

//           {showAuthPrompt && (
//             <div className="auth-prompt">
//               <p
//                 className="close-auth"
//                 onClick={() => {
//                   setShowAuthPrompt(false);
//                   setAuthCode("");
//                 }}
//               >
//                 {countdown > 0 ? countdown : "Closed"}
//               </p>
//               <h4 className="title">Authentication Code</h4>
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAuthSubmit();
//                 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Code"
//                   value={authCode}
//                   onChange={(e) => setAuthCode(e.target.value)}
//                   className={authShake ? "shake" : ""}
//                 />
//                 <div className="auth-buttons">
//                   <button type="submit">Submit</button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;


