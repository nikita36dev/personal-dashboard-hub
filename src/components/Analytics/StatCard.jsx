const StatCard = ({ title, value, change, positive, icon: Icon }) => {
  return (
    <div className="stat-card animate-scale-in">
      <div className="stat-card-header">
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-icon">
          <Icon />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {change && (
        <div className={`stat-card-change ${positive ? 'positive' : 'negative'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            {positive ? (
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            ) : (
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            )}
          </svg>
          {change} from last week
        </div>
      )}
    </div>
  );
};

export default StatCard;
