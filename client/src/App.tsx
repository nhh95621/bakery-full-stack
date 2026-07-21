import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/AdminPanel";
import { useState } from "react";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

function Router() {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/checkout"}>
        {() => (
          <Checkout
            items={cart}
            onBack={() => {
              window.history.back();
            }}
          />
        )}
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
