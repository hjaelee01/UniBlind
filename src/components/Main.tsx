import { Feed } from './Feed';
import React from 'react';

export function Main() {
    const tabStyle = {
        margin: 'auto',
        width: '50%',
        padding: '10px'
    }
    const filterOptionBarStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    // Fetch data of posts(list of objects), so that I can pull the object in the return method below.
    return (
        <div style={tabStyle}>
            <div style={filterOptionBarStyle}>
              {<Feed />}
            </div>
        </div>
    )
}