import React, { useState, useEffect } from 'react'
import DragContainer from './components/DragContainer'
import CourseModal from './components/CourseModal'
import SlideInModal from './components/SlideInModal'
import AddActivityModal from './components/AddActivityModal'
import { mockData } from './data/mockData'
import './App.css'

function App() {
  const [currentWeek, setCurrentWeek] = useState(6) // 当前第6周
  const [currentDate, setCurrentDate] = useState(new Date('2024-03-31')) // 当前日期
  const [viewMode, setViewMode] = useState('week') // 'week' 或 'semester'
  const [courses, setCourses] = useState([])
  const [activities, setActivities] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [defaultModalData, setDefaultModalData] = useState({ day: 1, timeSlot: 1 })
  const [draggedActivity, setDraggedActivity] = useState(null)

  useEffect(() => {
    // 模拟网络请求获取数据
    setTimeout(() => {
      setCourses(mockData.courses)
      setActivities(mockData.activities)
    }, 500)
  }, [])

  // 回到本周
  const goToCurrentWeek = () => {
    const today = new Date()
    const currentWeekNum = getCurrentWeekNumber(today)

    if (currentWeekNum > 21) {
      setViewMode('semester')
    } else {
      setCurrentWeek(currentWeekNum)
      setCurrentDate(today)
      setViewMode('week')
    }
  }

  // 计算当前周数
  const getCurrentWeekNumber = (date) => {
    const semesterStart = new Date('2024-02-26') // 学期开始日期
    const diffTime = date.getTime() - semesterStart.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.ceil(diffDays / 7)
  }

  // 处理编辑活动
  const handleEditActivity = (course) => {
    setEditingCourse(course)
    setShowSlideModal(true)
    setSelectedCourse(null) // 关闭CourseModal
  }

  // 处理SlideInModal触发
  const handleSlideInModalTrigger = (day, timeSlot) => {
    setEditingCourse(null) // 清空编辑状态，表示是新增
    setDefaultModalData({ day, timeSlot })
    setShowSlideModal(true)
  }

  // 添加活动
  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now(),
      type: 'activity'
    }
    setActivities([...activities, newActivity])
  }

  // 修改活动
  const updateActivity = (activityId, updatedActivity) => {
    setActivities(activities.map(activity =>
      activity.id === activityId ? { ...activity, ...updatedActivity } : activity
    ))
  }

  // 删除活动
  const deleteActivity = (activityId) => {
    setActivities(activities.filter(activity => activity.id !== activityId))
  }

  // 处理拖拽
  const handleDragStart = (activity) => {
    setDraggedActivity(activity)
  }

  const handleDrop = (day, timeSlot) => {
    if (draggedActivity && draggedActivity.type === 'activity') {
      const updatedActivity = {
        ...draggedActivity,
        day,
        timeSlot
      }
      updateActivity(draggedActivity.id, updatedActivity)
      setDraggedActivity(null)
    }
  }

  return (
    <div className="app">
      <DragContainer
        currentWeek={currentWeek}
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onGoToCurrentWeek={goToCurrentWeek}
        courses={courses}
        activities={activities}
        onCourseClick={setSelectedCourse}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onWeekSelect={setCurrentWeek}
        onSlideInModalTrigger={handleSlideInModalTrigger}
      />

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onUpdate={selectedCourse.type === 'activity' ? updateActivity : null}
          onDelete={selectedCourse.type === 'activity' ? deleteActivity : null}
          onEdit={selectedCourse.type === 'activity' ? handleEditActivity : null}
        />
      )}

      {showAddModal && (
        <AddActivityModal
          onClose={() => setShowAddModal(false)}
          onAdd={addActivity}
          existingActivities={activities}
          currentWeek={currentWeek}
        />
      )}

      <SlideInModal
        isOpen={showSlideModal}
        onClose={() => {
          setShowSlideModal(false)
          setEditingCourse(null)
        }}
        onAdd={addActivity}
        onUpdate={updateActivity}
        editingCourse={editingCourse}
        defaultDay={defaultModalData.day}
        defaultTimeSlot={defaultModalData.timeSlot}
      />
    </div>
  )
}

export default App