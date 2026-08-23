import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>© {new Date().getFullYear()} PlaceRo. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="/privacy" className="hover:text-ink">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-ink">Terms of Service</Link>
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/contact" className="hover:text-ink">Contact</Link>
        </div>
      </div>
    </footer>
  );
}