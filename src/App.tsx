import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { withDevCycleProvider } from "@devcycle/react-client-sdk";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Checkout from "@/pages/checkout";
import Orders from "@/pages/orders";
import Admin from "@/pages/admin";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/protected-route";
import Layout from "@/components/layout";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="coffee-shop-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default withDevCycleProvider({
  sdkKey: import.meta.env.VITE_DEVCYCLE_CLIENT_SDK_KEY,
  options: {
    logLevel: "debug",
  },
})(App);
