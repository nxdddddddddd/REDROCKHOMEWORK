import React from 'react';
import './HomePage.css';

const HomePage = ({ dragProgress = 0, className = '', style = {} }) => {
  return (
    <div className={`home-page ${className}`} style={style}>
      {/* 主要内容区域 */}
      <div className="content-area">
        <h1>欢迎使用课表应用</h1>
        <p>向上拖拽查看您的课程安排</p>
      </div>
    </div>
  );
};

export default HomePage;