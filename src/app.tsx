import { BrowserRouter, Route, Routes } from "react-router";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import AppLayout from "./pages/_layouts/app";
import AuthLayout from "./pages/_layouts/auth";
import { SignIn } from "./pages/auth/sign-in";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from 'sonner'
import { SignUp } from "./pages/auth/sign-up";
import { ThemeProvider } from "./components/theme/theme-provider";
import Orders from "./pages/app/orders/orders";
import NotFound from "./pages/404";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

export function App() {

  return (
    <>
    <HelmetProvider>
      <ThemeProvider storageKey="pizzashop-theme" defaultTheme="dark">
      <Helmet titleTemplate="%s | pizza.shop"></Helmet>
      <Toaster richColors/>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignIn />} />
            </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="/sign-up" element={<SignUp />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
    </>
  )
}

