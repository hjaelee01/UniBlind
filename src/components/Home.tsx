import { Grid, GridItem } from '@chakra-ui/react'
import { Header } from "./Header";
import { Main } from "./Main";
import { Navigation } from './Navigation';
import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { login, logout } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { UserType } from '../types/UserType';
import { auth } from '../firebase';

export function Home() {
  const dispatch = useDispatch();
  const user = auth.currentUser;

  // Check if user is signed in when app loads
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(login({
          uid: user.uid,
          displayName: user.displayName,
        }));
      } else {
        // User is signed out
        logout();
      }
    });
  }, []);

  return (
      <Grid
        templateAreas={`"header header"
                        "nav main"`}
        gridTemplateRows={'1fr 10fr'}
        gridTemplateColumns={'25% 2fr'}
        h='100vh'
        color='blackAlpha.700'
        fontWeight='bold'
      >
        <GridItem pl='2' area={'header'}>
          <Header />
        </GridItem>
        <GridItem pl='2' bg="gray.100" area={'nav'} px={4} py={4}>
          <Navigation />
        </GridItem>
        <GridItem pl='2' bg="gray.100" area={'main'}>
          <Main />
        </GridItem>
      </Grid>
  )
}