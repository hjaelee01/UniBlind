import { Input, Button, Text, MenuButton, Menu, IconButton, MenuList, MenuItem } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useSelector } from 'react-redux';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { BiLogOut } from 'react-icons/bi';

export function Header() {
    const topBarStyle = {
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
    const searchbarStyle = {
        padding: '10px',
        borderRadius: '50px'
    }
    const textStyle = {
        fontFamily: "'Inter', sans-serif",
        fontSize: "40px"
      };
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    
    const handleLoginClick = () => {
      navigate('/login');
    };
    const handleHome = () => {
        navigate('/')
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          setUser(user);
        } else {
          // User is signed out
          setUser(null);
        }
      });

      return () => {
        // Unsubscribe the listener when the component unmounts
        unsubscribe();
      };
    }, []);
    
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        alert('Signed out successfully!');
        navigate('/');
      })
      .catch((error) => {
        alert('Sign out failed!');
      });
  };

    return (
        <div className="topBar" style={topBarStyle}>
            <Text style={textStyle} onClick={handleHome}>Un(i)Veil</Text>
            <div style={{ width: '30px' }}></div>
            <Input placeholder='Search' style={searchbarStyle}/>
            <div style={{ width: '30px' }}></div>
            {!user ?
            <Button colorScheme='teal' variant='outline' onClick={handleLoginClick}>
                Login
            </Button> : 
            <Menu>
              <MenuButton
              as={Button}
              aria-label='Options'
              variant='outline'
              display='flex'
              justifyContent='center'
              alignItems='center'
              >
                {user.displayName}
              </MenuButton>
              <MenuList>
                <MenuItem 
                command='⌘T'
                onClick={handleSignOut}
                >
                  Sign Out
                </MenuItem>
                <MenuItem command='⌘N'>
                  Settings
                </MenuItem>
              </MenuList>
            </Menu>
            }
        </div>
    )
}
{/* <Button colorScheme='teal' variant='outline' onClick={handleDisplayNameClick}> */}
                {/* {user.displayName} */}
            {/* </Button> */}