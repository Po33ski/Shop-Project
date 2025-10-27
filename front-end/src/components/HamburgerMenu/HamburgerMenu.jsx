import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GENDERS } from "../../constants/categories";
import styles from "./HamburgerMenu.module.css";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}

      <nav className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
        <div className={styles.menuHeader}>
          <h2>Menu</h2>
          <button
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className={styles.genderList}>
          {GENDERS.map((gender) => (
            <li key={gender.path}>
              <NavLink
                to={gender.path}
                className={({ isActive }) => isActive ? styles.active : ""}
                onClick={closeMenu}
              >
                {gender.categoryName}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

