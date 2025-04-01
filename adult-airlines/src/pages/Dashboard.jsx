import React from 'react';
import Booking from '../components/Booking';
import Agent from '../components/Agent';

const Dashboard = () => {
    // Un-comment when ready for useState hook
    //const [userRole, setUserRole] = useState('customer'); // 'customer' or 'agent'

    const userRole = 'customer'

    // display Booking page for customers, Agent page for agents
    return (
        <div className='dashboard'>
            {userRole  === 'customer' ? <Booking/> : <Agent/>}
        </div>
    )
}

export default Dashboard;