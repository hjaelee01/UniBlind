import { Button, Divider } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { CSSProperties } from 'react';
import { NavButton } from './NavButton';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

export function Navigation() {
    const containerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
      };
    const navigate = useNavigate();
    const handleCreatePost = () => {
      navigate('/create-post');
    };
    
    return (
        <div style={containerStyle}>
            <Link to="/create-post">
                <Button leftIcon={<EditIcon />} colorScheme="teal" variant="solid" mt={4} onClick={handleCreatePost}>
                    Create post
                </Button>
            </Link>
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