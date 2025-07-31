import React from 'react';
import { getTimeSlotColor, getNonEditableColor, getTimeSlotTextColor, getNonEditableTextColor } from '../utils/colorUtils';

const CourseCard = ({ course, duration, isDraggable, onDragStart, onDragEnd, onClick }) => {
  const getCardHeight = (duration) => {
    // 检查是否为移动端
    const isMobile = window.innerWidth <= 768;
    // 桌面端：107px格子，移动端：89px格子（9:16宽高比）
    const cellHeight = isMobile ? 89 : 107;
    // 计算总高度：格子高度 * 时长 - 4px边距
    const totalHeight = cellHeight * duration - 4;
    return `${totalHeight}px`;
  };

  const getCardStyle = () => {
    const baseStyle = {
      height: getCardHeight(duration),
    };

    // 如果是不可编辑的课程，使用灰色
    if (!course.editable) {
      return {
        ...baseStyle,
        backgroundColor: getNonEditableColor(),
        color: getNonEditableTextColor(),
      };
    }

    // 所有可编辑课程根据时间段设置颜色
    return {
      ...baseStyle,
      backgroundColor: getTimeSlotColor(course.timeSlot),
      color: getTimeSlotTextColor(course.timeSlot),
    };
  };

  const handleDragStart = (e) => {
    if (isDraggable && onDragStart) {
      onDragStart(e, course);
    }
  };

  const handleDragEnd = (e) => {
    if (isDraggable && onDragEnd) {
      onDragEnd(e);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (onClick) {
      onClick(course);
    }
  };

  // 获取地点信息，优先使用location，然后是classroom
  const getLocation = () => {
    return course.location || course.classroom || '';
  };

  return (
    <div
      className={`course-card ${course.type} ${isDraggable ? 'draggable' : 'non-editable'}`}
      style={getCardStyle()}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div className="course-content">
        <div className="course-name">{course.name}</div>
        <div className="course-location">{getLocation()}</div>
      </div>
      {isDraggable && <div className="drag-handle">⋮⋮</div>}
    </div>
  );
};

export default CourseCard;