import React from 'react'
import './SemesterView.css'

const SemesterView = ({ courses, activities, onCourseClick, onWeekSelect }) => {
  // 生成21周的数据
  const generateSemesterData = () => {
    const weeks = []
    for (let week = 1; week <= 21; week++) {
      const weekCourses = courses.filter(course => course.week === week)
      const weekActivities = activities.filter(activity => activity.week === week)
      weeks.push({
        week,
        courses: weekCourses,
        activities: weekActivities,
        totalItems: weekCourses.length + weekActivities.length
      })
    }
    return weeks
  }

  const semesterData = generateSemesterData()

  const getWeekStatus = (week) => {
    const currentWeek = 6 // 当前周
    if (week < currentWeek) return 'past'
    if (week === currentWeek) return 'current'
    return 'future'
  }

  const getWeekColor = (totalItems) => {
    if (totalItems === 0) return '#f5f5f5'
    if (totalItems <= 3) return '#e8f5e8'
    if (totalItems <= 6) return '#fff3cd'
    return '#f8d7da'
  }

  return (
    <div className="semester-view">
      <div className="semester-header">
        <h2>整学期课表</h2>
        <p>点击任意周查看详细课表</p>
      </div>

      <div className="semester-grid">
        {semesterData.map(({ week, courses, activities, totalItems }) => (
          <div 
            key={week}
            className={`week-card ${getWeekStatus(week)}`}
            style={{ backgroundColor: getWeekColor(totalItems) }}
            onClick={() => onWeekSelect(week)}
          >
            <div className="week-number">第{week}周</div>
            <div className="week-stats">
              <div className="stat-item">
                <span className="stat-label">课程</span>
                <span className="stat-value">{courses.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">活动</span>
                <span className="stat-value">{activities.length}</span>
              </div>
            </div>
            
            {totalItems > 0 && (
              <div className="week-preview">
                {[...courses, ...activities].slice(0, 3).map(item => (
                  <div 
                    key={item.id}
                    className="preview-item"
                    style={{ backgroundColor: item.color }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCourseClick(item)
                    }}
                  >
                    {item.name}
                  </div>
                ))}
                {totalItems > 3 && (
                  <div className="more-items">+{totalItems - 3}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SemesterView