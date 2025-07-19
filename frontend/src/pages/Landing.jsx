import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Landing = () => (
  <>
    <Header />
    <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold">Welcome to HospiTrack</h1>
      <p className="text-xl mt-4">Smart hospital monitoring in real time</p>
      <Link to="/auth">
        <button className="mt-8 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors">
          Login
        </button>
      </Link>
    </section>
    <main className="max-w-6xl mx-auto py-10 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Key Features</h2>
        <p className="text-lg text-gray-700">
          HospiTrack provides a comprehensive solution for hospital management,
          including real-time patient monitoring, bed management, and emergency
          alerts. Our platform is designed to streamline hospital operations,
          improve patient care, and enhance communication between staff.
        </p>
      </div>
    </main>
    <Footer />
  </>
);

export default Landing;
