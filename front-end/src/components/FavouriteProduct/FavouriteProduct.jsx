import styles from "./FavouriteProduct.module.css";
import REMOVE_ICON from "../../assets/remove.svg";
import BAG_ICON from "../../assets/bag.svg";
import { useFetcher } from "react-router-dom";
import { Price } from "../Price/Price";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

export function FavouriteProduct({ favourite }) {
  const product = favourite.product;
  const { Form } = useFetcher();

  // Safety check - if product is not loaded, don't render
  if (!product) {
    return null;
  }

  const price = <Price product={product} />;

  const [, addProductToCart] = useContext(CartContext);

  // Get first photo or use placeholder
  const photoUrl = product.photos && product.photos.length > 0 
    ? product.photos[0] 
    : 'https://via.placeholder.com/300x400?text=No+Image';

  return (
    <div className={styles.favouriteProduct}>
      <img src={photoUrl} />
      <div className={styles.favouriteProductInfo}>
        <div className={styles.topRow}>
          <h3>
            {product.brand} {product.productName}
          </h3>
          <p>{price}</p>
        </div>
        <p className={styles.priceRow}>
          <span>Cena: </span>
          {price}
        </p>
        <div className={styles.buttonRow}>
          <Form
            action={`/delete-from-favourites/${favourite.id}`}
            method="DELETE"
          >
            <button>
              <img src={REMOVE_ICON} />
              Usuń
            </button>
          </Form>
          <button
            onClick={() => {
              addProductToCart(product);
            }}
          >
            <img src={BAG_ICON} />
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </div>
  );
}
