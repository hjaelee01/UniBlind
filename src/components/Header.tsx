import { Input, Button, Text, MenuButton, Menu, IconButton, MenuList, MenuItem, InputGroup, InputLeftElement, FormControl, Stack, Icon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useSelector } from 'react-redux';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { BiCog, BiLogOut, BiSearch, BiSolidUser } from 'react-icons/bi';
import { ChevronDownIcon } from '@chakra-ui/icons';

export function Header() {
    const topBarStyle = {
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
    const searchbarStyle = {
      borderRadius: '20px',
    };    
    const textStyle = {
        fontFamily: "'Inter', sans-serif",
        fontSize: "30px"
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
            <div style={{ width: '200px' }}></div>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<BiSearch />}
                marginLeft="0.5rem"
              />
              <Input type='text' placeholder='Search' style={searchbarStyle}/>
            </InputGroup>
            <div style={{ width: '300px' }}></div>
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
              w="300px"
              rightIcon={<ChevronDownIcon />}
              >
                <Icon as={BiSolidUser} mr={2} />
                {user.displayName}
              </MenuButton>
              <MenuList>
                <MenuItem 
                icon={<BiLogOut />}
                onClick={handleSignOut}
                >
                  Sign Out
                </MenuItem>
                <MenuItem
                icon={<BiCog />}>
                  Settings
                </MenuItem>
              </MenuList>
            </Menu>
            }
            <div style={{ width: '100px' }}></div>
        </div>
    )
}