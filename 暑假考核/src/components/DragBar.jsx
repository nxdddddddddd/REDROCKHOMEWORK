import React from 'react';
import './DragBar.css';

const DragBar = ({
  isVisible = true,
  showText = false,
  text = "向下拖拽返回首页",
  textOpacity = 1, // 文字的透明度
  showIndicator = true, // 是否显示指示器
  indicatorOpacity = 1 // 指示器透明度
}) => {
  if (!isVisible) return null;

  return (
    <div className="drag-bar">
      {/* 拖拽指示器 */}
      {showIndicator && (
        <div
          className="drag-indicator-in-bar"
          style={{
            opacity: indicatorOpacity,
            width: '40px',
            height: '4px',
            backgroundColor: '#999999',
            borderRadius: '2px',
            margin: '8px auto',
            transition: 'opacity 0.2s ease'
          }}
        />
      )}
      {showText && (
        <p className="drag-text" style={{ opacity: textOpacity }}>{text}</p>
      )}
    </div>
  );
};

export default DragBar;