import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import ContentPage from "./pages/ContentPage";
import ContentDetail from "./pages/ContentDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/articles" element={<ContentPage type="article" />} />
            <Route path="/articles/:slug" element={<ContentDetail type="article" />} />
            <Route path="/tips" element={<ContentPage type="tip" />} />
            <Route path="/tips/:slug" element={<ContentDetail type="tip" />} />
            <Route path="/dashboards" element={<ContentPage type="dashboard" />} />
            <Route path="/dashboards/:slug" element={<ContentDetail type="dashboard" />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;