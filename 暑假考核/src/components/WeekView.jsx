import React, { useState } from 'react'
import { weekDays, timeSlots, getTimeSlotColor } from '../data/mockData'
import CourseCard from './CourseCard'
import SlideInModal from './SlideInModal'
import './WeekView.css'

const WeekView = ({
  currentWeek,
  currentDate,
  courses = [],
  activities = [],
  onCourseClick = () => { },
  onDragStart = () => { },
  onDrop = () => { },
  onAddActivity = () => { },
  onSlideInModalTrigger
}) => {
  const [dragOverCell, setDragOverCell] = useState(null)
  const [selectedCell, setSelectedCell] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // 获取当前周的课程和活动
  const getCurrentWeekItems = () => {
    const weekCourses = courses.filter(course => course.week === currentWeek)
    const weekActivities = activities.filter(activity => activity.week === currentWeek)
    return [...weekCourses, ...weekActivities]
  }

  // 生成课程网格数据，相同课程连续显示为一个大盒子
  const generateScheduleGrid = () => {
    const grid = {}
    const items = getCurrentWeekItems()

    // 初始化网格
    weekDays.forEach(day => {
      grid[day.id] = {}
      timeSlots.forEach(slot => {
        grid[day.id][slot.id] = {
          items: [],
          isOccupied: false,
          occupiedBy: null
        }
      })
    })

    // 填充课程数据 - 相同课程连续显示
    items.forEach(item => {
      const startSlot = item.timeSlot
      const endSlot = item.timeSlot + item.duration - 1

      // 只在起始时间段放置课程卡片
      if (grid[item.day] && grid[item.day][startSlot]) {
        grid[item.day][startSlot].items.push({
          ...item,
          displayDuration: item.duration, // 显示完整的时长
          originalDuration: item.duration,
          isFirstSlot: true,
          isLastSlot: false,
          currentSlot: startSlot
        })

        // 标记所有占用的时间段
        for (let slot = startSlot; slot <= endSlot; slot++) {
          if (grid[item.day] && grid[item.day][slot]) {
            grid[item.day][slot].isOccupied = true
            grid[item.day][slot].occupiedBy = item.id
          }
        }
      }
    })

    return grid
  }

  // 处理拖拽放置
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragEnter = (day, timeSlot) => {
    setDragOverCell(`${day}-${timeSlot}`)
  }

  const handleDragLeave = () => {
    setDragOverCell(null)
  }

  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault()
    setDragOverCell(null)
    onDrop(day, timeSlot)
  }

  // 处理空白格子点击
  const handleCellClick = (day, timeSlot, isOccupied) => {
    if (isOccupied) return

    const cellKey = `${day}-${timeSlot}`
    if (selectedCell === cellKey) {
      // 再次点击同一格子，触发SlideInModal
      if (onSlideInModalTrigger) {
        onSlideInModalTrigger(day, timeSlot);
      } else {
        // 回退到原来的modal
        setShowAddModal(true);
      }
      setSelectedCell(null)
    } else {
      // 选中格子
      setSelectedCell(cellKey)
    }
  }

  // 添加课程
  const handleAddCourse = (courseData) => {
    if (onSlideInModalTrigger) {
      // 使用新的SlideInModal
      onSlideInModalTrigger(courseData.day, courseData.timeSlot)
    } else {
      // 回退到原来的modal
      onAddActivity(courseData)
      setSelectedCell(null)
    }
  }

  // 获取当前月份
  const getCurrentMonth = () => {
    const date = new Date(currentDate)
    return date.getMonth() + 1 // getMonth()返回0-11，所以要+1
  }

  // 获取日期显示
  const getDateForDay = (dayIndex) => {
    const date = new Date(currentDate)
    const currentDay = date.getDay() || 7 // 将周日从0改为7
    const diff = dayIndex - currentDay
    date.setDate(date.getDate() + diff)
    return date.getDate()
  }

  const scheduleGrid = generateScheduleGrid()

  return (
    <div className="week-view">
      <div className="schedule-container">
        {/* 时间轴 */}
        <div className="time-column">
          <div className="time-header">
            <div className="month-display">{getCurrentMonth()}月</div>
          </div>
          {timeSlots.map(slot => (
            <div key={slot.id} className="time-slot">
              <div className="time-label">{slot.label}</div>
              <div className="time-start">{slot.startTime}</div>
              <div className="time-end">{slot.endTime}</div>
            </div>
          ))}
        </div>

        {/* 课程表格 */}
        <div className="schedule-grid">
          {/* 星期标题 */}
          <div className="week-header">
            {weekDays.map(day => (
              <div key={day.id} className="day-header">
                <div className="day-name">{day.short}</div>
                <div className="day-date">{getDateForDay(day.id)}日</div>
              </div>
            ))}
          </div>

          {/* 课程网格 */}
          <div className="schedule-body">
            {timeSlots.map(timeSlot => (
              <div key={timeSlot.id} className="time-row">
                {weekDays.map(day => {
                  const cellData = scheduleGrid[day.id][timeSlot.id]
                  const cellKey = `${day.id}-${timeSlot.id}`
                  const isDragOver = dragOverCell === cellKey
                  const isSelected = selectedCell === cellKey

                  return (
                    <div
                      key={cellKey}
                      className={`schedule-cell ${isDragOver ? 'drag-over' : ''} ${cellData.isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                      onDragOver={handleDragOver}
                      onDragEnter={() => handleDragEnter(day.id, timeSlot.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, day.id, timeSlot.id)}
                      onClick={() => handleCellClick(day.id, timeSlot.id, cellData.isOccupied)}
                    >
                      {cellData.items.map(item => (
                        <CourseCard
                          key={item.id}
                          course={item}
                          onClick={onCourseClick}
                          onDragStart={() => onDragStart(item)}
                          isDraggable={item.editable}
                          duration={item.displayDuration}
                        />
                      ))}
                      {isSelected && !cellData.isOccupied && (
                        <div className="add-course-indicator">
                          <span className="plus-icon">+</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <SlideInModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCourse}
        defaultDay={selectedCell ? parseInt(selectedCell.split('-')[0]) : 1}
        defaultTimeSlot={selectedCell ? parseInt(selectedCell.split('-')[1]) : 1}
      />
    </div>
  )
}

export default WeekView