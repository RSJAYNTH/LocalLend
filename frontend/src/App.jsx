import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import CreateItem from './pages/CreateItem';
import ItemDetail from './pages/ItemDetail';
import Requests from './pages/Requests';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen  text-zinc-100 font-sans">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:requestId" element={<Chat />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
