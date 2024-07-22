import React from 'react'
import styles from '../css/NavBar.module.css';
import Logout from './Logout'

function NavBar() {

  return (
    <div>
        <div className={styles.NavBar}>
            <Logout />
        </div>
    </div>
  )
}

export default NavBar
