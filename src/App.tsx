
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Compiler from "./pages/Compiler";
import Practice from "./pages/Practice";
import Interview from "./pages/Interview";
import Resources from "./pages/Resources";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compiler" element={<Compiler />} />
              <Route path="/practice" element={
                <AuthGuard>
                  <Practice />
                </AuthGuard>
              } />
              <Route path="/interview" element={
                <AuthGuard>
                  <Interview />
                </AuthGuard>
              } />
              <Route path="/resources" element={
                <AuthGuard>
                  <Resources />
                </AuthGuard>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
