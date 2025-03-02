
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import TaskDetails from "./pages/TaskDetails";
import TaskSuccessPage from "./pages/TaskSuccessPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ReportIssuePage from "./pages/ReportIssuePage";
import SnoozePage from "./pages/SnoozePage";

const PageNumber = () => {
  const location = useLocation();
  
  const getPageNumber = () => {
    const routes = {
      "/": 1,
      "/order-history": 2,
      "/profile": 3,
      "/settings": 4,
      "/task": 5,
      "/task-success": 6,
      "/order-details": 7,
      "/report-issue": 8,
    };
    
    const baseRoute = "/" + location.pathname.split("/")[1];
    return routes[baseRoute] || 0;
  };
  
  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: 5, 
        right: 5, 
        opacity: 0.05, 
        fontSize: '10px',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      {getPageNumber()}
    </div>
  );
};

const AppRoutes = () => (
  <>
    <PageNumber />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/task/:taskId/:orderId" element={<TaskDetails />} />
        <Route path="/task-success/:taskId/:orderId" element={<TaskSuccessPage />} />
        <Route path="/order-details/:taskId/:orderId" element={<OrderDetailsPage />} />
        <Route path="/report-issue/:taskId/:orderId" element={<ReportIssuePage />} />
        <Route path="/snooze/:taskId/:orderId" element={<SnoozePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
