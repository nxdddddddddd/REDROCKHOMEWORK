import React, { useState, useCallback, useEffect } from 'react';
import './DragContainer.css';
import HomePage from './HomePage';
import SchedulePage from './SchedulePage';

const DragContainer = ({
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
  onSlideInModalTrigger
}) => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'schedule'
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  // 拖拽开始
  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    e.preventDefault();
  }, []);

  // 拖拽过程
  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    handleDrag(deltaY);
  }, [isDragging, startY]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();

    const deltaY = e.clientY - startY;
    handleDrag(deltaY);
  }, [isDragging, startY]);

  const handleDrag = useCallback((deltaY) => {
    // 移除拖拽限制，让拖拽更平滑
    if (currentPage === 'home' && deltaY < 0) {
      // 首页向上拖拽时，课表页向上移动
      setTranslateY(deltaY); // 课表页向上移动
    } else if (currentPage === 'schedule' && deltaY > 0) {
      // 课表页向下拖拽
      setTranslateY(deltaY);
    }
  }, [currentPage]);

  // 拖拽结束
  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, []);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    const threshold = window.innerHeight * 0.2; // 降低阈值，更容易切换

    if (currentPage === 'home' && translateY < -threshold) {
      // 课表页向上移动超过阈值，切换到课表页
      setCurrentPage('schedule');
      setTranslateY(0);
    } else if (currentPage === 'schedule' && translateY > threshold) {
      // 切换到首页
      setCurrentPage('home');
      setTranslateY(0);
    } else {
      // 回到原位置
      setTranslateY(0);
    }
  }, [currentPage, translateY]);

  // 添加全局事件监听
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        const deltaY = e.clientY - startY;
        handleDrag(deltaY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startY, handleDrag, handleDragEnd]);

  // 计算拖拽进度 (0-1)
  const getDragProgress = useCallback(() => {
    const screenHeight = window.innerHeight;
    if (currentPage === 'home' && translateY < 0) {
      // 首页状态下，translateY < 0 表示课表页向上移动
      // 使用屏幕高度作为最大拖拽距离
      return Math.min(1, Math.abs(translateY) / screenHeight);
    } else if (currentPage === 'schedule' && translateY > 0) {
      return Math.min(1, translateY / screenHeight);
    }
    return 0;
  }, [currentPage, translateY]);

  // 获取课表内容的透明度
  const getScheduleContentOpacity = useCallback(() => {
    const progress = getDragProgress();
    if (currentPage === 'home') {
      // 首页状态下，刚开始拖拽时内容就开始显示
      return Math.min(1, progress);
    } else {
      // 课表页状态下，刚开始拖拽时内容就开始变透明（与首页相反）
      return Math.max(0, 1 - progress);
    }
  }, [currentPage, getDragProgress]);

  // 计算底部按钮的样式（随拖拽移动和透明度变化）
  const getBottomButtonsStyle = useCallback(() => {
    if (currentPage === 'home') {
      // 首页状态下，根据拖拽进度计算按钮位置和透明度
      const progress = getDragProgress();
      const maxMoveDistance = 100; // 最大向下移动距离
      const moveDistance = progress * maxMoveDistance;
      const opacity = Math.max(0, 1 - progress); // 随拖拽变透明

      return {
        transform: `translateY(${moveDistance}px)`,
        opacity: opacity,
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      };
    } else {
      // 课表页状态下，根据向下拖拽进度计算按钮从下方向上逐渐显示
      const progress = getDragProgress();
      const maxMoveDistance = 100; // 最大移动距离

      // 向下拖拽时，按钮从底部向上移动并逐渐显示
      const moveDistance = maxMoveDistance * (1 - progress); // progress越大，moveDistance越小
      const opacity = progress; // 拖拽越多，按钮越不透明

      return {
        transform: `translateY(${moveDistance}px)`,
        opacity: opacity,
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      };
    }
  }, [currentPage, getDragProgress, isDragging]);
  const getContentOpacity = useCallback(() => {
    if (currentPage === 'home') {
      // 首页状态下，根据课表页露出的程度计算透明度
      const bottomButtonHeight = 80; // 更新为新的按钮高度
      const visibleHeight = 60;
      const hiddenHeight = window.innerHeight - bottomButtonHeight - visibleHeight;
      const currentTranslate = hiddenHeight + translateY;

      // 计算课表页露出的比例（0-1）
      const exposedRatio = Math.max(0, Math.min(1, (hiddenHeight - currentTranslate) / hiddenHeight));

      // 从透明（0）到不透明（1）
      return exposedRatio;
    } else {
      // 课表页状态下，内容完全不透明
      return 1;
    }
  }, [currentPage, translateY]);

  // 获取课表页样式
  const getScheduleStyle = useCallback(() => {
    if (currentPage === 'home') {
      // 首页状态：课表大部分隐藏在底部，只露出一小部分在按钮上方
      const bottomButtonHeight = 60; // 更新为新的按钮高度
      const visibleHeight = 60; // 课表可见部分高度
      const hiddenHeight = window.innerHeight - bottomButtonHeight - visibleHeight;

      // 在拖拽时，课表页会向上移动
      // translateY为负值时表示向上拖拽，课表页向上移动
      const currentTranslate = hiddenHeight + translateY; // translateY为负值时向上移动

      // 限制课表页不能超过顶部（最小值为0）
      const finalTranslate = Math.max(0, currentTranslate);

      return {
        transform: `translateY(${finalTranslate}px)`,
        opacity: 1, // div容器本身始终保持不透明，确保背景色正常显示
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: 'auto',
        zIndex: 100 // 确保课表页在首页之上但在底部按钮之下
      };
    } else {
      // 课表页状态：课表在顶部，向下拖拽时下移
      // 计算初始位置（首页状态下课表页的初始位置）
      const bottomButtonHeight = 60; // 更新为新的按钮高度
      const visibleHeight = 60;
      const initialHiddenHeight = window.innerHeight - bottomButtonHeight - visibleHeight;

      // 限制课表页向下拖拽时不能超过初始位置
      // translateY > 0 表示向下拖拽，但不能超过initialHiddenHeight
      const maxDownwardTranslate = initialHiddenHeight;
      const translateValue = Math.max(0, Math.min(translateY, maxDownwardTranslate));

      return {
        transform: `translateY(${translateValue}px)`,
        opacity: 1, // div容器本身始终保持不透明
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: 'auto',
        zIndex: 100
      };
    }
  }, [currentPage, translateY, isDragging]);

  // 计算假期文字在课表页中的透明度
  const getScheduleHolidayTextOpacity = useCallback(() => {
    const progress = 1 - getDragProgress();
    if (currentPage === 'home') {
      // 首页状态下，当假期文字完全透明时（progress >= 0.5），时间开始显示
      // progress 0-0.5: 时间透明度保持0
      // progress 0.5-1: 时间透明度从0变为1
      return Math.max(0, 2 * (progress - 0.5))
    } else {
      // 课表页状态下，向下拖拽时时间在拖到一半时完全透明（与向上拖拽相反）
      // progress 0-0.5: 透明度从1变为0
      // progress 0.5-1: 透明度保持0
      return Math.max(0, 1 - (progress * 2)); // 0-0.5映射到1-0
    }
  }, [currentPage, getDragProgress]);

  // 计算首页内容的透明度（h1、p元素）- 与时间显示逻辑完全一致
  const getHomeContentOpacity = useCallback(() => {
    const progress = getDragProgress();
    if (currentPage === 'home') {
      // 首页状态下，当假期文字完全透明时（progress >= 0.5），时间开始显示
      // progress 0-0.5: 时间透明度保持0
      // progress 0.5-1: 时间透明度从0变为1
      if (progress <= 0.5) {
        return 0;
      } else {
        return (progress - 0.5) * 2; // 将0.5-1的范围映射到0-1
      }
    } else {
      // 课表页状态下，向下拖拽时时间在拖到一半时完全透明（与向上拖拽相反）
      // progress 0-0.5: 透明度从1变为0
      // progress 0.5-1: 透明度从0变为1
      if (progress <= 0.5) {
        return Math.max(0, 1 - (progress * 2)); // 0-0.5映射到1-0
      } else {
        return (progress - 0.5) * 2; // 0.5-1映射到0-1
      }
    }
  }, [currentPage, getDragProgress]);

  // 计算时间显示的透明度
  const getTimeOpacity = useCallback(() => {
    const progress = getDragProgress();
    if (currentPage === 'home') {
      // 首页状态下，当假期文字完全透明时（progress >= 0.5），时间开始显示
      // progress 0-0.5: 时间透明度保持0
      // progress 0.5-1: 时间透明度从0变为1
      return Math.max(0, 2 * (progress - 0.5))
    } else {
      // 课表页状态下，向下拖拽时时间在拖到一半时完全透明（与向上拖拽相反）
      // progress 0-0.5: 透明度从1变为0
      // progress 0.5-1: 透明度保持0
      return Math.max(0, 1 - (progress * 2)); // 0-0.5映射到1-0
    }
  }, [currentPage, getDragProgress]);

  // 获取首页样式
  const getHomeStyle = useCallback(() => {
    if (currentPage === 'home') {
      // 首页状态：保持静止，不移动
      return {
        pointerEvents: 'auto'
      };
    } else {
      // 课表页状态下，首页始终保持被覆盖状态，不管是否在拖拽
      // 即使向下拖拽课表页，首页也不应该从下面跳出来
      return {
        pointerEvents: 'none', // 在课表页状态下不可交互
        zIndex: 1 // 确保在课表页下方
      };
    }
  }, [currentPage, isDragging]);

  return (
    <div
      className="drag-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* 首页 - 直接作为顶层元素 */}
      <HomePage
        className="page-content home-content"
        style={getHomeStyle()}
        dragProgress={getDragProgress()}
        contentOpacity={getHomeContentOpacity()}
      />

      {/* 课表页 - 直接作为顶层元素，让课表能够"露头" */}
      <SchedulePage
        className="page-content schedule-content"
        style={getScheduleStyle()}
        currentWeek={currentWeek}
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onGoToCurrentWeek={onGoToCurrentWeek}
        onAddActivity={onAddActivity}
        onWeekSelect={onWeekSelect}
        courses={courses}
        activities={activities}
        onCourseClick={onCourseClick}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onSlideInModalTrigger={onSlideInModalTrigger}
        contentOpacity={getScheduleContentOpacity()} // 使用新的透明度逻辑
        holidayTextOpacity={getScheduleHolidayTextOpacity()} // 假期文字透明度
        timeOpacity={getTimeOpacity()} // 时间透明度
      />

      {/* 独立的底部按钮 - 最高层级，随拖拽动态变化 */}
      <div className="bottom-buttons" style={getBottomButtonsStyle()}>
        <button className="bottom-btn">发现</button>
        <button className="bottom-btn">邮乐园</button>
        <button className="bottom-btn">我的</button>
      </div>
    </div>
  );
};

export default DragContainer;