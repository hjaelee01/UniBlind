import { Button, Divider } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { CSSProperties, useEffect, useState } from 'react';
import { NavButton } from './NavButton';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { auth } from '../firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

export function Navigation() {
    const containerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
      };
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    // Check auth status in every refresh
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
    
    const handleCreatePost = () => {
      navigate('/create-post');
    };
    
    return (
        <div style={containerStyle}>
            {user ?
            <Button borderRadius={'20px'} leftIcon={<EditIcon />} colorScheme="teal" variant="solid" mt={4} onClick={handleCreatePost}>
                Create post
            </Button>
            : <Button borderRadius={'20px'} leftIcon={<EditIcon />} colorScheme="teal" variant="solid" mt={4} onClick={() => alert('Sign in to write post!')}>
                Create post
            </Button>}
            <Divider borderWidth='1px' borderColor='gray' my='5' />
            <div>
                <NavButton name="General" />
                <NavButton name="Courses" />
                <NavButton name="Announcements" />
                <NavButton name="Tools" />
                <NavButton name="Career" />
            </div>
            {/* TODO: Vertical divider not rendered!!! */}
            <Divider borderWidth='1px' borderColor='red' my='5' orientation="vertical" />
        </div>
    )
}