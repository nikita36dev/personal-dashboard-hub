import { Plus } from 'lucide-react';
import '../../styles/Dashboard.css';

const DashboardCard = ({ title, icon, onAddClick, children, color }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-title-section">
          <div className="card-icon" style={{ color: color }}>
            {icon}
          </div>
          <h3 className="card-title">{title}</h3>
        </div>
        <button 
          className="card-add-btn"
          onClick={onAddClick}
          title="Add new"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
