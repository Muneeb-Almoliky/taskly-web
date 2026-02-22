import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import '../../index.css';
import styles from './SearchBar.module.css';
import useTasks from "../../hooks/useTasks";

const SearchBar = () => {
    const {searchQuery, setSearchQuery} = useTasks();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);
  
    useEffect(() => {
      if (isSearchOpen) {
        document.body.classList.add("search-active");
      } else {
        document.body.classList.remove("search-active");
      }
      return () => document.body.classList.remove("search-active");
    }, [isSearchOpen]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setIsSearchOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    return (
      <div className={`${styles.searchContainer} ${isSearchOpen? styles.searchContainerActive:''}`} ref={searchRef} title="Search a task">
        <input
          className={`${styles.searchInput} ${isSearchOpen? styles.searchInputActive:''}`}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            }}
          placeholder="Search a task..."
        />
        <div onClick={() => setIsSearchOpen((prev) => !prev)}>
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>
    );
  };
  


export default SearchBar;
