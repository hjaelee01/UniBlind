import { createSlice } from "@reduxjs/toolkit";
// import { UserType } from "../types/UserType";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
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
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    updateProfile(auth.currentUser, {
                      displayName: displayName,
                    });
                    sendEmailVerification(auth.currentUser);
                    alert("Verification email sent. Check your mailbox!")
                } else {
                    alert("User doesn't exist")
                }
            })
        })
        .then(() => {
            return new Promise((resolve, reject) => {
              // setInterval(() => {setTimeOut(() => {...,5000})}, 180000)
              // During 3 minutes, check every 5 seconds if the user has verified his email
              setTimeout(() => {
                auth.currentUser.reload().then(async () => {
                    const user = auth.currentUser;
                    if (user.emailVerified) {
                      // updateProfile(user, {
                        // displayName: displayName,
                      // });
                      dispatch(login([displayName, user.uid]));
                      resolve(user);
                      alert('Email verification succeeded.');
                      await setDoc(doc(db, "users", displayName), {
                        upvotedPosts: [],
                        downvotedPosts: [],
                      });
                      navigate('/');
                    } else {
                      alert('Email verification failed.');
                      reject(new Error("Email verification failed."));
                    }
                });
              }, 30000); // Wait for 30 seconds (30000 milliseconds)
            });
          })
          .catch((error) => {
            alert(error.message);
          });
    } catch (error) {
        console.log(error)
        alert(error.message)
    }
}


export default userSlice.reducer;