import { Text } from '@chakra-ui/react'
import React from 'react';
import { CSSProperties } from 'react';

export function NavButton(props: { name: string }) {
    const navButtonStyle: CSSProperties = {
        fontSize: '24px',
        cursor: 'pointer'
      };
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        console.log(event.currentTarget.textContent);
    };
    return (
        <Text style={navButtonStyle} onClick={handleClick}>{props.name}</Text>
    )
}