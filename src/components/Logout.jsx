import React from 'react';
import logoutImage from '../assets/images/logout.png';

function Logout() {
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className='logout'>
            <img src={logoutImage} alt="Logout" onClick={logout} />
        </div>
    );
}

export default Logout;
