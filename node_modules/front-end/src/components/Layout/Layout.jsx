import { Outlet } from "react-router-dom";
import { CategoryMenu } from "../CategoryMenu/CategoryMenu";
import { CurrencySelector } from "../CurrencySelector/CurrencySelector";
import { Footer } from "../Footer/Footer";
import { IconMenu } from "../IconMenu/IconMenu";
import { Logo } from "../Logo/Logo";
import { MainContent } from "../MainContent/MainContent";
import { MainMenu } from "../MainMenu/MainMenu";
import { TopBar } from "../TopBar/TopBar";
import { CurrencyContext } from "../../contexts/CurrencyContext";
import { CURRENCIES } from "../../constants/currencies";
import { CartContext } from "../../contexts/CartContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export function Layout() {
  const [currency, setCurrency] = useLocalStorage(
    "selected_currency",
    CURRENCIES.PLN
  );

  const [cartItems, setCartItems] = useLocalStorage("cart_products", []);

  function addProductToCart(product) {
    const newState = [...cartItems, product];
    setCartItems(newState);
    //console.log(newState);
  }

  function deleteProductFromCart(product) {
    const index = cartItems.indexOf(product);
    //console.log(cartItems[index]);
    const newState = [...cartItems];
    newState.splice(index, 1);
    setCartItems(newState);
    //console.log(newState);
  }

  return (
    <>
      <CartContext.Provider
        value={[cartItems, addProductToCart, deleteProductFromCart]}
      >
        <CurrencyContext.Provider value={[currency, setCurrency]}>
          <MainContent>
            <TopBar>
              <MainMenu />
              <Logo />
              <div>
                <CurrencySelector />
                <IconMenu />
              </div>
            </TopBar>
            <CategoryMenu />
            <Outlet />
          </MainContent>
          <Footer />
        </CurrencyContext.Provider>
      </CartContext.Provider>
    </>
  );
}
