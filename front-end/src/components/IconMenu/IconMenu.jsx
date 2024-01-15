import styles from "./IconMenu.module.css";
import BAG_ICON from "../../assets/bag.svg";
import HEART from "../../assets/heart.svg";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

export function IconMenu() {
  const [cartItems] = useContext(CartContext);
  const cartItemsNumber = cartItems.length;

  return (
    <ul className={styles.iconMenu}>
      <li>
        <Link to="/ulubione">
          <img src={HEART} />
        </Link>
      </li>
      <li>
        <Link to="/koszyk">
          <img src={BAG_ICON} />
          <div className={styles.numberOfProducts}>{cartItemsNumber}</div>
        </Link>
      </li>
    </ul>
  );
}
