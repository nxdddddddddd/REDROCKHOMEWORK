import React from 'react';
import Header from './Header';
import WeekView from './WeekView';
import SemesterView from './SemesterView';
import './SchedulePage.css';

const SchedulePage = ({
  className,
  style,
  currentWeek,
  currentDate,
  viewMode,
  onViewModeChange,
  onGoToCurrentWeek,
  onAddActivity,
  onWeekSelect,
  courses,
  activities,
  onCourseClick,
  onDragStart,
  onDrop,
  onSlideInModalTrigger,
  contentOpacity = 1, // 内容透明度，由父组件控制
  holidayTextOpacity = 1, // 假期文字透明度
  timeOpacity = 1 // 时间显示透明度
}) => {

  return (
    <div className={`schedule-page ${className || ''}`} style={style}>
      {/* 拖拽指示器 - 完全独立，不受任何透明度影响 */}
      <div
        className="drag-indicator"
        style={{
          position: 'fixed', // 改为fixed定位，完全脱离父容器影响
          top: style?.transform ? '8px' : `${window.innerHeight - 60 - 60 + 8}px`, // 根据课表页位置动态调整
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '4px',
          backgroundColor: 'rgba(128, 128, 128, 0.8)', // 灰色指示器
          borderRadius: '2px',
          zIndex: 9999, // 设置极高的层级
          opacity: 1, // 强制设置为完全不透明
          pointerEvents: 'none',
          display: 'block', // 强制显示
          visibility: 'visible' // 强制可见
        }}
      />

      {/* "享受假期吧~"文字 - 位于拖拽指示器下方 */}
      <div
        className="holiday-text-in-schedule"
        style={{
          position: 'fixed',
          top: style?.transform ? '20px' : `${window.innerHeight - 60 - 60 + 20}px`, // 在拖拽指示器下方
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9998,
          opacity: holidayTextOpacity,
          pointerEvents: 'none',
          fontSize: '14px',
          color: '#666',
          whiteSpace: 'nowrap'
        }}
      >
        享受假期吧~
      </div>

      {/* 背景层 - 始终保持100%不透明的白色背景 */}
      <div className="schedule-page-background"></div>

      {/* 内容容器 - 只对内容元素应用透明度，不影响背景 */}
      <div className="schedule-page-content" style={{ opacity: contentOpacity }}>
        {/* 课表页头部 */}
        <Header
          currentWeek={currentWeek}
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onGoToCurrentWeek={onGoToCurrentWeek}
          onAddActivity={onAddActivity}
          timeOpacity={timeOpacity}
        />

        {/* 课表内容 */}
        <div className="schedule-content">
          {viewMode === 'week' ? (
            <WeekView
              currentWeek={currentWeek}
              currentDate={currentDate}
              courses={courses}
              activities={activities}
              onCourseClick={onCourseClick}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onAddActivity={onAddActivity}
              onSlideInModalTrigger={onSlideInModalTrigger}
            />
          ) : (
            <SemesterView
              currentWeek={currentWeek}
              onWeekSelect={onWeekSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;