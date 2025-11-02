import '../../styles/WidgetContainer.css';

const Widget = ({ title, icon, children }) => {
  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2 className="widget-title">
          {icon}
          {title}
        </h2>
      </div>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};

export default Widget;
