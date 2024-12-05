import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useFeatureFlags } from "@/stores/featureFlags";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Checkout from "@/pages/checkout";
import Orders from "@/pages/orders";
import Admin from "@/pages/admin";

function App() {
  const { enableDarkMode } = useFeatureFlags();

  return (
    <ThemeProvider
      defaultTheme={enableDarkMode ? "dark" : "light"}
      storageKey="coffee-shop-ui-theme"
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
