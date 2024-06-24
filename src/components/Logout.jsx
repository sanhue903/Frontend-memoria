import React from 'react';
import logoutImage from '../assets/images/logout.png';

function Logout() {
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <style>{`
                img {
                    width: 40px;
                    height: 40px;
                    margin: 10px;
                    cursor: pointer;
                }
            `}</style>

            <img src={logoutImage} alt="Logout" onClick={logout} />
        </div>
    );
}

export default Logout;
