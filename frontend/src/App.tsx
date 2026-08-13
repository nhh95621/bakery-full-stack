import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/AdminPanel";
import Account from "./pages/Account";
import { useCart } from "./contexts/CartContext";

function Router() {
  const { items } = useCart();
  const [, setLocation] = useLocation();

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/about"} component={About} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/account"} component={Account} />
      <Route path={"/checkout"}>
        {() => (
          <Checkout
            items={items}
            onBack={() => {
              setLocation("/");
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
