import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import VendorLayout from './components/VendorLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseProducts from './pages/BrowseProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyRentals from './pages/MyRentals';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminRentals from './pages/AdminRentals';
import AdminMaintenance from './pages/AdminMaintenance';
import AdminUsers from './pages/AdminUsers';
import VendorDashboard from './pages/VendorDashboard';
import VendorProducts from './pages/VendorProducts';
import VendorRentals from './pages/VendorRentals';
import VendorMaintenance from './pages/VendorMaintenance';
import './App.css';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100" style={{ width: '100%' }}>
          <Navbar />

          <main style={{ width: '100%', minHeight: '100vh', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<BrowseProducts />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path='/forgotpassword' element={<ForgotPassword />} />
              <Route path="/cart" element={<ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}><Checkout /></ProtectedRoute>} />
              <Route path="/my-rentals" element={<ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}><MyRentals /></ProtectedRoute>} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="rentals" element={<AdminRentals />} />
                <Route path="maintenance" element={<AdminMaintenance />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              <Route path="/vendor" element={<ProtectedRoute allowedRoles={['vendor']}><VendorLayout /></ProtectedRoute>}>
                <Route index element={<VendorDashboard />} />
                <Route path="products" element={<VendorProducts />} />
                <Route path="rentals" element={<VendorRentals />} />
                <Route path="maintenance" element={<VendorMaintenance />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;