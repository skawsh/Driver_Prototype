
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import Layout from './components/layout/Layout';
import Index from './pages/Index';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import OrderHistory from './pages/OrderHistory';
import NotFound from './pages/NotFound';
import TaskDetails from './pages/TaskDetails';

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="history" element={<OrderHistory />} />
          <Route path="task/:taskId" element={<TaskDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
