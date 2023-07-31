import { createSlice } from "@reduxjs/toolkit";
// import { UserType } from "../types/UserType";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const initialState = {
    displayName: '',
    uid: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.displayName = action.payload[0];
            state.uid = action.payload[1];
        },
        logout: (state) => {
            state.uid = '';
            state.displayName = '';
        }
    }
})

export const { login, logout } = userSlice.actions;

export const signUp = (email, displayName, password, navigate) => async (dispatch) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: displayName,
    });

    await sendEmailVerification(user);

    alert("Verification email sent. Check your mailbox!");

    return new Promise((resolve, reject) => {
      let intervalId;
      let startTime = new Date().getTime();

      const handleInterval = async () => {
        await user.reload();

        if (user.emailVerified) {
          clearInterval(intervalId);
          dispatch(login([displayName, user.uid]));
          alert("Email verification succeeded.");
          await setDoc(doc(db, "users", displayName), {
            upvotedPosts: [],
            downvotedPosts: [],
          });
          navigate('/');
          resolve(user);
        } else if (new Date().getTime() - startTime >= 180000) {
          clearInterval(intervalId);
          reject(new Error("Email verification timed out."));
          await deleteUser(user);
          alert("Email verification timed out. Please try again.");
        }
      };

      intervalId = setInterval(handleInterval, 5000);
    });
  } catch (error) {
    alert(error.message);
  }
};



export default userSlice.reducer;