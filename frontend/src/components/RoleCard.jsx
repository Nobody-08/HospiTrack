import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RoleCard = ({ role, title, description }) => {
  const navigate = useNavigate();

  const handleRoleClick = () => {
    // Navigate to the auth page
    navigate('/auth');
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer"
      onClick={handleRoleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <h2 className="text-xl font-bold text-blue-600 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Login as {title}
      </button>
    </motion.div>
  );
};

export default RoleCard;
