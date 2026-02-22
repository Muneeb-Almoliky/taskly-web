import React, {useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import styles from './Sidebar.module.css';
import Profile from '../Profile/Profile';

const Sidebar = ({isAuthenticating}) => {
  const [isOpen, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;


  const sidebarData = [
    { to: '/dashboard', title: 'Dashboard' },
    { to: '/tasks/all', title: 'All Tasks' },
    { to: '/tasks/completed', title: 'Completed Tasks' },
    { to: '/tasks/pending', title: 'Pending Tasks' },
    { to: '/tasks/starred', title: 'Starred Tasks' },
    { to: '/tasks/archived', title: 'Archived Tasks' }
  ];

  const handleClick = () => {
    if (window.innerWidth <= 1000) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Hamburger lives OUTSIDE sidebar so it's not trapped in stacking contexts */}
      <div className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}>
        <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
      </div>

      <div className={`${isOpen ? styles.sidebarActive : ''} ${styles.sidebar}`}>
        <Profile isAuthenticating={isAuthenticating} isOpen={isOpen} setOpen={setOpen}/>
        <nav>
          <ul>
            {sidebarData.map((item, index) => (
              <li key={index} onClick={handleClick} className={isActive(item.to) ? styles.active : ''}>
                <Link to={item.to}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isOpen && window.innerWidth <= 1000 && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;