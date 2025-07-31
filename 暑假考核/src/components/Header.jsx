import React from 'react';
import './Header.css';

const Header = ({
  currentWeek,
  currentDate,
  viewMode,
  onViewModeChange,
  onGoToCurrentWeek,
  onAddActivity,
  timeOpacity = 1 // 时间显示的透明度
}) => {
  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('zh-CN', options);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="header">
      <div className="header-top" style={{ opacity: timeOpacity }}>
        <div className="week-info" >
          <h2>第 {currentWeek} 周</h2>
          <p className="date-info">{formatDate(currentDate)}</p>
        </div>
        <div className="time-info">
          <span className="current-time">{getCurrentTime()}</span>
        </div>
      </div>

      <div className="header-controls">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => onViewModeChange('week')}
          >
            周视图
          </button>
          <button
            className={`toggle-btn ${viewMode === 'semester' ? 'active' : ''}`}
            onClick={() => onViewModeChange('semester')}
          >
            学期视图
          </button>
        </div>

        <div className="header-actions">
          <div className="user-icon">
            <span>👤</span>
          </div>
          <button className="action-btn" onClick={onGoToCurrentWeek}>
            回到本周
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;