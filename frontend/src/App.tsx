import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import GraphPage from './pages/GraphPage';
import ChatPage from './pages/ChatPage';
import DiscoverPage from './pages/DiscoverPage';
import SimulationPage from './pages/SimulationPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="graph" element={<GraphPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="simulation" element={<SimulationPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
