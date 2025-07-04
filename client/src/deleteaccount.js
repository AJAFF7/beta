import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteIcon = () => (
  <svg
    width="28"
    height="28"
    fill="red"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: "5px" }}
  >
    <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.7a1 1 0 1 0-1.41 1.42L10.59 12l-4.88 4.88a1 1 0 0 0 1.41 1.41L12 13.41l4.88 4.88a1 1 0 0 0 1.42-1.41L13.41 12l4.88-4.88a1 1 0 0 0 .01-1.41z" />
  </svg>
);

const DeleteAccount = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userID");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleDeleteUser = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`/p1-auths/${userId}`);
      if (response.data.message) {
        setMessage("Account deleted successfully.");
        setShowPopup(true);

        localStorage.removeItem("userID");

        setTimeout(() => {
          setShowPopup(false);
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div>
      <button className="button-delete" onClick={handleDeleteUser}>
        <DeleteIcon />
      </button>

      {showPopup && (
        <div className="popup-message">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";




// const DeleteIcon = () => (
//   <svg
//     width="28"
//     height="28"
//     fill="#fff"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//     style={{ marginRight: "5px" }}
//   >
//     <path d="M6 7h12v2H6zm2 3h8v10H8z" />
//     <path d="M9 4h6l1 2H8z" />
//   </svg>
// );

// const DeleteAccount = () => {
//   const [userId, setUserId] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userID");
//     if (storedUserId) setUserId(storedUserId);
//   }, []);

//   const handleDeleteUser = async () => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete your account?"
//     );

//     if (!confirmed) return;

//     try {
//       const response = await axios.delete(`/p1-auths/${userId}`);
//       if (response.data.message) {
//         setMessage("Account deleted successfully.");

//         // Clean up
//         localStorage.removeItem("userID");

//         // Redirect after a short delay (optional)
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//       }
//     } catch (error) {
//       setMessage(
//         `Error: ${
//           error.response ? error.response.data.message : error.message
//         }`
//       );
//     }
//   };

//   return (
//     <div>
//       <button className="button-delete" onClick={handleDeleteUser}>
//         <DeleteIcon />
//       </button>
//       {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
//     </div>
//   );
// };

// export default DeleteAccount;