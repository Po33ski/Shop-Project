import styles from "./Product.module.css";
import { Link, useFetcher } from "react-router-dom";
import { Price } from "../Price/Price";
import { useState, useEffect } from "react";

const ENDPOINT_TO_PATH_MAPPING = {
  men: "mezczyzna",
  women: "kobieta",
  children: "dziecko",
};

export function Product({ product }) {
  const { Form } = useFetcher();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (product.photos && product.photos[0]) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(product.photos[0]);
        setImageLoaded(true);
      };
      img.src = product.photos[0];
    } else {
      // If no photos, show placeholder immediately
      setImageLoaded(true);
    }
  }, [product.photos]);

  return (
    <Link
      to={`/${ENDPOINT_TO_PATH_MAPPING[product.gender]}/${product.category}/${
        product.subcategory
      }/${product.id}`}
      className={styles.product}
    >
      {imageLoaded && imageSrc ? (
        <img src={imageSrc} alt={product.productName} />
      ) : (
        <div className={styles.imagePlaceholder}>
          {imageLoaded ? (
            <div className={styles.noImage}>📷</div>
          ) : (
            <div className={styles.loadingSpinner}>⏳</div>
          )}
        </div>
      )}
      <h3>{product.productName}</h3>
      <p>
        <Price product={product} />
      </p>
      <Form
        onClick={(e) => {
          e.stopPropagation();
        }}
        method="POST"
        action={`/add-to-favourites/${product.id}`}
      >
        <button>
          <div className={styles.heart}></div>
        </button>
      </Form>
    </Link>
  );
}
