export const handleDragStart = (e, index) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', index.toString());
};

export const handleDragOver = (e) => {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
};

export const handleDrop = (e, dropIndex, items, setItems) => {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  const dragIndex = parseInt(e.dataTransfer.getData('text/html'));

  if (dragIndex !== dropIndex && !isNaN(dragIndex)) {
    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    
    newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
  }

  return false;
};
