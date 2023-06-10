import { Input, Button, Text } from '@chakra-ui/react'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useSelector } from 'react-redux';

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
    const user = auth.currentUser;
    const handleLogin = () => {
      navigate('/login');
    };
    const handleHome = () => {
        navigate('/')
    }
    return (
        <div className="topBar" style={topBarStyle}>
            <Text style={textStyle} onClick={handleHome}>uniBlind</Text>
            <div style={{ width: '30px' }}></div>
            <Input placeholder='Search' style={searchbarStyle}/>
            <div style={{ width: '30px' }}></div>
            {!user ?
            <Button colorScheme='teal' variant='outline' onClick={handleLogin}>
                Login
            </Button> : 
            <Button colorScheme='teal' variant='outline' onClick={() => alert('sdklfjwlkjkl')}>
                {user.displayName}
            </Button>}
        </div>
    )
}