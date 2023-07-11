import { Input, Button, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useSelector } from 'react-redux';
import { User, onAuthStateChanged } from 'firebase/auth';

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
    const handleDisplayNameClick = () => {
        // TODO: add a dropdown menu for user to (view profile / logout / change password)
        alert('sdklfjwlkjkl')
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
            <Button colorScheme='teal' variant='outline' onClick={handleDisplayNameClick}>
                {user.displayName}
            </Button>}
        </div>
    )
}