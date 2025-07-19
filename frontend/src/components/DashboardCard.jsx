import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = "blue", 
  subtitle, 
  trend, 
  linkTo, 
  linkText = "View Details",
  onClick 
}) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      green: "bg-green-50 border-green-200 text-green-800",
      red: "bg-red-50 border-red-200 text-red-800",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      gray: "bg-gray-50 border-gray-200 text-gray-800"
    };
    return colors[color] || colors.blue;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const CardContent = () => (
    <div className={`p-6 rounded-lg border-2 shadow-md hover:shadow-lg transition-all ${getColorClasses(color)} ${onClick || linkTo ? 'cursor-pointer hover:scale-105' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-75 mb-1">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm opacity-75 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-4xl opacity-75">
            {icon}
          </div>
        )}
      </div>
      
      {(linkTo || onClick) && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
          <span className="text-sm font-medium hover:underline">
            {linkText} →
          </span>
        </div>
      )}
    </div>
  );

  if (linkTo && !onClick) {
    return (
      <Link to={linkTo}>
        <CardContent />
      </Link>
    );
  }

  if (onClick && !linkTo) {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyPress={e => { if (e.key === 'Enter') onClick(); }}
      >
        <CardContent />
      </div>
    );
  }

  return <CardContent />;
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  subtitle: PropTypes.string,
  trend: PropTypes.number,
  linkTo: PropTypes.string,
  linkText: PropTypes.string,
  onClick: PropTypes.func,
};

export default DashboardCard;
