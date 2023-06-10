import { createSlice } from "@reduxjs/toolkit";
// import { UserType } from "../types/UserType";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';

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
              setTimeout(() => {
                auth.currentUser.reload().then(() => {
                    const user = auth.currentUser;
                    if (user.emailVerified) {
                      // updateProfile(user, {
                        // displayName: displayName,
                      // });
                      dispatch(login([displayName, user.uid]));
                      resolve(user);
                      alert('Email verification succeeded.');
                      navigate('/');
                    } else {
                      alert('Email verification failed.');
                      reject(new Error("Email verification failed."));
                    }
                });
              }, 10000); // Wait for 10 seconds (10000 milliseconds)
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