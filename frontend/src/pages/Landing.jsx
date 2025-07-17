import Header from "../components/Header";
import Footer from "../components/Footer";
import RoleCard from "../components/RoleCard";

const Landing = () => (
  <>
    <Header />
    <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold">Welcome to HospiTrack</h1>
      <p className="text-xl mt-4">Smart hospital monitoring in real time</p>
    </section>
    <main className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <RoleCard role="admin" title="Admin" description="Access full system control" />
      <RoleCard role="doctor" title="Doctor" description="Review and treat patients" />
      <RoleCard role="nurse" title="Nurse" description="Manage bed flow and assist alerts" />
    </main>
    <Footer />
  </>
);

export default Landing;
