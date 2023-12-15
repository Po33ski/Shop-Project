import { CartProductsList } from "../../components/CartProductsList/CartProductsList";
import { CartSummary } from "../../components/CartSummary/CartSummary";
import { FlexContainer } from "../../components/FlexContainer/FlexContainer";
import { CartContext } from "../../contexts/CartContext";
import { useContext } from "react";

export function Cart() {
  const [cartItems] = useContext(CartContext);
  return (
    <FlexContainer>
      <CartProductsList products={cartItems} />
      <CartSummary products={cartItems} />
    </FlexContainer>
  );
}
