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

  // Handle case where product might be null/undefined
  if (!product) {
    return (
      <div className={styles.favouriteProduct}>
        <div className={styles.errorMessage}>
          ❌ Produkt nie został znaleziony
        </div>
      </div>
    );
  }

  const price = <Price product={product} />;

  const [, addProductToCart] = useContext(CartContext);

  return (
    <div className={styles.favouriteProduct}>
      <img 
        src={product.photos?.[0] || '/placeholder-image.jpg'} 
        alt={product.productName || 'Produkt'}
        onError={(e) => {
          e.target.src = '/placeholder-image.jpg';
        }}
      />
      <div className={styles.favouriteProductInfo}>
        <div className={styles.topRow}>
          <h3>
            {product.brand || 'Brak marki'} {product.productName || 'Brak nazwy'}
          </h3>
          <p>{price}</p>
        </div>
        <p className={styles.priceRow}>
          <span>Cena: </span>
          {price}
        </p>
        <div className={styles.buttonRow}>
          <Form
            action={`/delete-from-favourites/${favourite._id}`}
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
