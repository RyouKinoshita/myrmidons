// OAuth.js
import React, { useState } from "react";
import { GoogleAuthProvider,FacebookAuthProvider, getAuth, signInWithPopup, signInWithFacebook } from "firebase/auth";
import app from "../../firebase";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { authenticateGoogle, authenticateFacebook } from "../../utils/helpers";
import GoogleIcon from '@mui/icons-material/Google';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function OAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  let location = useLocation();
  const redirect = location.search
    ? new URLSearchParams(location.search).get("redirect")
    : "";

  const signInWithGoogle = async (email, password) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:4001/api/v1/google`,
        {
          email: user.email,
          name: user.displayName || user.email,
          avatar: user.photoURL,
        },
        config
      );
      
      setUser(user);
      authenticateGoogle(data, () => {
        if (data.newUser) {
          navigate(`/login`);
        } else {
          navigate(`/${redirect}`);
        }
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } catch (error) {
      console.error(error.message);
    }
  };
  const signInWithFacebook = async () => {
    const facebookProvider  = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:4001/api/v1/facebook`,
        {
          email: user.email,
          name: user.displayName || user.email,
          avatar: user.photoURL,
        },
        config
      );
      
      setUser(user);
      authenticateFacebook(data, () => {
        if (data.newUser) {
          navigate(`/login`);
        } else {
          navigate(`/${redirect}`);
        }
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleFacebookLogin = async () => {
    try {
      const user = await signInWithFacebook();
      console.log(user); // Access user information
    } catch (error) {
      console.error('Facebook Login Failed:', error);
    }
  };
  return (
    <>
    <button
      onClick={signInWithGoogle}
      type="button"
      className="buttonforLogin"
      id="login-with-google-btn"
      style={{fontWeight: "bold"}}
    >
       CONTINUE WITH <b style={{color: "#4285F4"}}>G</b><b style={{color: "#EA4335"}}>O</b><b style={{color: "#FBBC05"}}>O</b><b style={{color: "#4285F4"}}>G</b><b style={{color: "#34A853"}}>L</b><b style={{color: "#EA4335"}}>E</b>
    </button>
    <button onClick={handleFacebookLogin} type="button"
      className="buttonforLogin"
      id="login-with-facebook-btn">Login with Facebook</button></>
    
  );
  
}

export default OAuth;