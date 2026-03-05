import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import ScrollToHashElement from "@/components/ScrollToHashElement";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Opportunities from "./pages/Opportunities";
import BlogPost from "./pages/BlogPost";
import News from "./pages/News";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import WeLeadProject from "./pages/programs/WeLeadProject";
import RoboticsCoding from "./pages/programs/RoboticsCoding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LazyMotion features={domAnimation} strict>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHashElement />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/news" element={<News />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/programs/we-lead" element={<WeLeadProject />} />
            <Route path="/programs/robotics-coding" element={<RoboticsCoding />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LazyMotion>
  </QueryClientProvider>
);

export default App;
