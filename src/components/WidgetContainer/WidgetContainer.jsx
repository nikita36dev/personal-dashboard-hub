import Widget from './Widget';

const WidgetContainer = ({ title, icon, children }) => {
  return <Widget title={title} icon={icon}>{children}</Widget>;
};

export default WidgetContainer;
