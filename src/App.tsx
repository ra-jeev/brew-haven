import { ThemeProvider } from "@/components/theme-provider";

import CoffeeShopApp from "@/CoffeeShopApp";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="coffee-shop-ui-theme">
      <CoffeeShopApp />
    </ThemeProvider>
  );
}

export default App;
