import React from 'react';

const Agent = () => {
    return (
        <div className='agent'>
            <h2>Agent Dashboard</h2>
            <p>Track your flight sales, and link customers to flights.</p>
            <ul>
                {
                    // CHANGE BELOW TO USE DYNAMIC CONTEXT OF DATABASE TABLES
                }
                <li>Customer 1 - Flight to 'place'</li> 
                <li>Customer 2 - Flight to 'place'</li>
            </ul>
        </div>
    )
}

export default Agent;