import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import MyStaysPage from "./pages/MyStaysPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ManagerRoute from "./routes/ManagerRoute";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import AdminRoute from "./routes/AdminRoute";
import AdminHotelsPage from "./pages/AdminHotelsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <MainLayout>
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
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
