import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import MainLayout from "./layouts/MainLayout";
import PageTransition from "./components/PageTransition";

// HomePage is eager — it's the first thing users see, no benefit to lazy-loading it
import HomePage from "./pages/HomePage";

// All other pages are lazy-loaded — each splits into its own chunk,
// reducing initial bundle from ~900KB to ~180KB
const LoginPage            = lazy(() => import("./pages/LoginPage"));
const RegisterPage         = lazy(() => import("./pages/RegisterPage"));
const NotFoundPage         = lazy(() => import("./pages/NotFoundPage"));
const HotelDetailPage      = lazy(() => import("./pages/HotelDetailPage"));
const BookingSuccessPage   = lazy(() => import("./pages/BookingSuccessPage"));
const MyStaysPage          = lazy(() => import("./pages/MyStaysPage"));
const ManagerDashboardPage = lazy(() => import("./pages/ManagerDashboardPage"));
const AdminHotelsPage      = lazy(() => import("./pages/AdminHotelsPage"));

import ProtectedRoute from "./routes/ProtectedRoute";
import ManagerRoute   from "./routes/ManagerRoute";
import AdminRoute     from "./routes/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <MainLayout>
        {/* Suspense fallback is null — PageTransition handles the visual entrance */}
        <Suspense fallback={null}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/hotels/:id" element={<HotelDetailPage />} />
              <Route path="/booking-success" element={<BookingSuccessPage />} />
              <Route
                path="/my-stays"
                element={
                  <ProtectedRoute>
                    <MyStaysPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ManagerRoute>
                    <ManagerDashboardPage />
                  </ManagerRoute>
                }
              />
              <Route
                path="/admin/hotels"
                element={
                  <AdminRoute>
                    <AdminHotelsPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
