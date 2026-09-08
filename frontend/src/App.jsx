import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import WhatsAppPopup from "./components/layout/WhatsAppPopup";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Internships from "./pages/Internships";
import Freshers from "./pages/Freshers";
import JobDetail from "./pages/JobDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

// Admin is never crawled/indexed and never needed by a visitor landing on a
// public page, so it's lazy-loaded into its own chunk — public (indexable)
// pages ship a smaller initial bundle, which helps Core Web Vitals / page
// speed, a direct Google ranking factor.
import ProtectedRoute from "./admin/components/ProtectedRoute";

const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminJobNew = lazy(() => import("./admin/pages/AdminJobNew"));
const AdminJobEdit = lazy(() => import("./admin/pages/AdminJobEdit"));

export default function App() {
  return (
    <Routes>
      {/* Admin routes render standalone, without the public shell/ads */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={null}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={null}>
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin/jobs/new"
        element={
          <Suspense fallback={null}>
            <ProtectedRoute><AdminJobNew /></ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin/jobs/:id/edit"
        element={
          <Suspense fallback={null}>
            <ProtectedRoute><AdminJobEdit /></ProtectedRoute>
          </Suspense>
        }
      />

      {/* Public site */}
      <Route
        path="/*"
        element={
          <div className="app flex flex-col min-h-screen">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/internships" element={<Internships />} />
                <Route path="/freshers" element={<Freshers />} />
                <Route path="/jobs/:slug" element={<JobDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Legal title="Privacy Policy" />} />
                <Route path="/terms" element={<Legal title="Terms of Service" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppPopup />
          </div>
        }
      />
    </Routes>
  );
}