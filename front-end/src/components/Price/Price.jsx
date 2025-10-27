import { useContext } from "react";
import { CurrencyContext } from "../../contexts/CurrencyContext";
import { CURRENCIES, CURRENCY_SIGN } from "../../constants/currencies";

export function Price({ product }) {
  const [currency] = useContext(CurrencyContext);
  
  // Handle both old format (pricePLN/priceUSD) and new format (price)
  let price;
  if (currency === CURRENCIES.PLN) {
    price = product?.pricePLN || product?.price;
  } else {
    price = product?.priceUSD || (product?.price ? Math.round(product.price * 0.25 * 100) / 100 : null);
  }
  
  return (
    <>
      {price}
      {CURRENCY_SIGN[currency]}
    </>
  );
}
