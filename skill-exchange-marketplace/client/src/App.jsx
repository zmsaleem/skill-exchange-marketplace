import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/Login/ForgotPassword'
import ResetPassword from './pages/Login/ResetPassword'
import Register from './pages/Register/Register';
import BrowseSkills from './pages/BrowseSkills/BrowseSkills';
import SkillDetails from './pages/SkillDetails/SkillDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateSkill from './pages/CreateSkill/CreateSkill';
import EditSkill from './pages/EditSkill/EditSkill';
import Profile from './pages/Profile/Profile';
import Bookings from './pages/Bookings/Bookings';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> 
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<BrowseSkills />} />
              <Route path="/skills/:id" element={<SkillDetails />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-skill"
                element={
                  <ProtectedRoute>
                    <CreateSkill />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditSkill />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
