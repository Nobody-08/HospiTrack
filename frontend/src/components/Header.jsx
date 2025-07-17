import { Link } from "react-router-dom";

const Header = () => (
  <header className="w-full bg-white border-b shadow-md py-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
      <Link to="/" className="text-2xl font-bold text-blue-600 font-inter">
        HospiTrack
      </Link>
      <nav className="space-x-6 text-sm font-medium text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/help" className="hover:text-blue-600">Help</Link>
      </nav>
    </div>
  </header>
);

export default Header;