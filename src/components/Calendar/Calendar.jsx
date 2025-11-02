import { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import YearView from './YearView';
import EventModal from './EventModal';
import EventDetailModal from './EventDetailModal';
import { Icons } from '../../assets/icons';
import '../../styles/Calendar.css';

const Calendar = () => {
  const { events, saveEvents, tasks, habits, goals } = useContext(DataContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'week', 'month', 'year'
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingDetail, setViewingDetail] = useState(null);

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (view === 'year') {
      newDate.setFullYear(currentDate.getFullYear() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now(),
      type: 'event',
      createdAt: new Date().toISOString()
    };
    saveEvents([...events, newEvent]);
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const updateEvent = (eventData) => {
    const updatedEvents = events.map(event =>
      event.id === eventData.id ? { ...eventData, updatedAt: new Date().toISOString() } : event
    );
    saveEvents(updatedEvents);
    setEditingEvent(null);
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const deleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      saveEvents(events.filter(event => event.id !== id));
      setShowEventModal(false);
      setEditingEvent(null);
      setViewingDetail(null);
    }
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(null);
    setShowEventModal(true);
  };

  const handleViewDetail = (item) => {
    setViewingDetail(item);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const getDateLabel = () => {
    if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      return currentDate.getFullYear();
    }
  };

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-nav">
          <button 
            className="calendar-nav-btn" 
            onClick={() => navigateDate(-1)}
            title={`Previous ${view}`}
          >
            <Icons.ChevronLeft />
          </button>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={goToToday}
          >
            Today
          </button>
          
          <div className="calendar-month-year">
            {getDateLabel()}
          </div>
          
          <button 
            className="calendar-nav-btn" 
            onClick={() => navigateDate(1)}
            title={`Next ${view}`}
          >
            <Icons.ChevronRight />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* View Switcher */}
          <div className="calendar-view-toggle">
            <button
              className={`view-toggle-btn ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              className={`view-toggle-btn ${view === 'month' ? 'active' : ''}`}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              className={`view-toggle-btn ${view === 'year' ? 'active' : ''}`}
              onClick={() => setView('year')}
            >
              Year
            </button>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingEvent(null);
              setSelectedDate(new Date());
              setShowEventModal(true);
            }}
          >
            <Icons.Plus />
            New Event
          </button>
        </div>
      </div>

      {/* Calendar Views */}
      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={events}
          tasks={tasks}
          habits={habits}
          goals={goals}
          onDayClick={handleDayClick}
          onItemClick={handleViewDetail}
        />
      )}

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          events={events}
          tasks={tasks}
          habits={habits}
          goals={goals}
          onDayClick={handleDayClick}
          onItemClick={handleViewDetail}
        />
      )}

      {view === 'year' && (
        <YearView
          currentDate={currentDate}
          events={events}
          tasks={tasks}
          habits={habits}
          onMonthClick={(month) => {
            const newDate = new Date(currentDate);
            newDate.setMonth(month);
            setCurrentDate(newDate);
            setView('month');
          }}
        />
      )}

      {/* Event Editor Modal */}
      {showEventModal && (
        <EventModal
          event={editingEvent}
          selectedDate={selectedDate}
          onSave={editingEvent ? updateEvent : addEvent}
          onDelete={deleteEvent}
          onClose={handleCloseModal}
        />
      )}

      {/* Detail View Modal */}
      {viewingDetail && (
        <EventDetailModal
          item={viewingDetail}
          onEdit={handleEditEvent}
          onDelete={deleteEvent}
          onClose={() => setViewingDetail(null)}
        />
      )}
    </div>
  );
};

export default Calendar;
