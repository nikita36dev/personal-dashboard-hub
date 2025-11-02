import storage from './localStorage';

export const exportData = {
  // Export to JSON
  toJSON: () => {
    const data = storage.exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export to CSV
  toCSV: (type) => {
    let data = [];
    let headers = [];
    let filename = '';

    switch(type) {
      case 'tasks':
        data = storage.getTasks();
        headers = ['Title', 'Description', 'Category', 'Priority', 'Due Date', 'Completed', 'Created At'];
        filename = 'tasks';
        break;
      case 'habits':
        data = storage.getHabits();
        headers = ['Name', 'Frequency', 'Current Streak', 'Longest Streak', 'Total Completions'];
        filename = 'habits';
        break;
      case 'notes':
        data = storage.getNotes();
        headers = ['Title', 'Content', 'Category', 'Created At', 'Updated At'];
        filename = 'notes';
        break;
      default:
        return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        return headers.map(header => {
          const key = header.toLowerCase().replace(/ /g, '');
          return `"${item[key] || ''}"`;
        }).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Import from JSON
  fromJSON: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const success = storage.importAllData(data);
          if (success) {
            resolve('Data imported successfully');
          } else {
            reject('Failed to import data');
          }
        } catch (error) {
          reject('Invalid JSON file');
        }
      };
      
      reader.onerror = () => reject('Failed to read file');
      reader.readAsText(file);
    });
  }
};

export default exportData;
