import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ContentProvider } from './context/ContentContext';
import AppNavbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import ModuleViewer from './pages/ModuleViewer';
import type { ReactNode } from 'react';

function RequireAuth({ children, role }: { children: ReactNode; role?: 'student' | 'lecturer' }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'lecturer' ? '/lecturer' : '/student'} replace />;
  }
  return <>{children}</>;
}

/**
 * Only show the standalone AppNavbar on the login page.
 * Landing page has its own Navbar built-in.
 * Dashboard + module viewer use DashboardLayout's own topbar.
 */
function ConditionalNavbar() {
  const { pathname } = useLocation();
  if (pathname === '/login') return <AppNavbar />;
  return null;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;

  return (
    <>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            user
              ? <Navigate to={user.role === 'lecturer' ? '/lecturer' : '/student'} replace />
              : <LoginPage />
          }
        />

        <Route
          path="/student"
          element={
            <RequireAuth role="student">
              <StudentDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/module/:moduleId"
          element={
            <RequireAuth role="student">
              <ModuleViewer />
            </RequireAuth>
          }
        />

        <Route
          path="/lecturer"
          element={
            <RequireAuth role="lecturer">
              <LecturerDashboard />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <ContentProvider>
            <AppRoutes />
          </ContentProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
