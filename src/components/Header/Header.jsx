import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import SearchBar from "../SearchBar/SearchBar";
import styles from './Header.module.css';
import ConfirmBox from "../../utils/ConfirmBox/ConfirmBox";

const ListHeader = () => {
  const [cookies, , removeCookie] = useCookies(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const signOut = async () => {
    try {
      await axios.get(`/auth/logout`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setAuth(null);
      removeCookie('email');
      navigate('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };


  return (
    <div className={styles.listHeader}>
      <h1>Taskly</h1>
     
      <div className={styles.buttonContainer}>
        <SearchBar />
        <div>
          <button className={styles.signoutBtn}  onClick={() => {setShowConfirm(true)}} title="Sign out"><FontAwesomeIcon icon={faSignOut}/> <span>SIGN OUT</span></button>
          
          <ThemeSwitcher />
        </div>
      </div>
      <ConfirmBox 
            isVisible={showConfirm}
            message={"Are you sure you want to sign out!"}
            onConfirm={signOut}
            onCancel={() => {setShowConfirm(false)}}
            />
    </div>
  );
};



export default ListHeader;

