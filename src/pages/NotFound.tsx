import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen font-montserrat" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="opp-hero" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="opp-hero-title" style={{ fontSize: 'clamp(80px, 15vw, 200px)' }}>
          <span className="t-fg">40</span><span className="t-or">4</span>
        </h1>
        <p className="opp-hero-sub" style={{ textAlign: 'center', margin: '0 auto 32px' }}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-fill">
          Return to Home
        </Link>
      </div>
      <Footer />
    </main>
  );
};

export default NotFound;
