import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import MyProfile from "./Pages/MyProfile/MyProfile";
import UserProfile from "./Pages/UserProfile/UserProfile";
// import router
import { BrowserRouter, Routes, Route } from "react-router-dom";
// firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { logIn, logOut } from "./features/userSlice";
import { useDispatch } from "react-redux";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import ProjectPage from "./Pages/ProjectPage/ProjectPage";
import Account from "./Pages/Account/Account";
import PrivacyPolicy from "./Pages/Text/PrivacyPolicy";
import TermsOfService from "./Pages/Text/TermsOfService";
import SignUp from "./Pages/Home/SignUp/SignUp";
import SignIn from "./Pages/Home/SignIn/SignIn";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthState = () =>
      onAuthStateChanged(auth, (userAuth) => {
        if (userAuth) {
          const q = query(
            collection(db, "users"),
            where("user_id", "==", userAuth.uid),
            limit(1)
          );
          getDocs(q).then((querySnapshot) => {
            dispatch(
              logIn({
                uid: userAuth.uid,
                email: userAuth.email,
                name: userAuth.displayName,
                dob: querySnapshot.docs[0].data().dob,
              })
            );
          });
        } else {
          dispatch(logOut());
        }
      });

    checkAuthState();
    return () => console.log("");
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route path="/register" element={<SignUp />} />

          <Route path="/profile" element={<MyProfile />} />

          <Route path="/account" element={<Account />} />

          <Route path="/user/:id" element={<UserProfile />} />

          <Route path="/project/:id" element={<ProjectPage />} />

          <Route path="/policy" element={<PrivacyPolicy />} />

          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
