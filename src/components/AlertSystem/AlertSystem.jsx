import { useContext } from 'react';
import { AlertContext } from '../../contexts/AlertContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import '../../styles/AlertSystem.css';

const AlertSystem = () => {
  const { alerts, removeAlert } = useContext(AlertContext);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  return (
    <div className="alert-container">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert ${getAlertStyle(alert.type)} animate-slide-in`}>
          <div className="alert-icon">
            {getAlertIcon(alert.type)}
          </div>
          <div className="alert-message">
            {alert.message}
          </div>
          <button
            className="alert-close"
            onClick={() => removeAlert(alert.id)}
          >
            <X size={16} />
          </button>
          <div className="alert-progress"></div>
        </div>
      ))}
    </div>
  );
};

export default AlertSystem;
