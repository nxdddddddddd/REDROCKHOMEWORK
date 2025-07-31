import React, { useState } from 'react'
import './CourseModal.css'

const CourseModal = ({ course, onClose, onUpdate, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: course.name,
    teacher: course.teacher || '',
    classroom: course.classroom || '',
    location: course.location || '',
    description: course.description || ''
  })

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false) // 重置状态
      onClose()
    }, 300) // 等待动画完成
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(course)
      handleClose()
    } else {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(course.id, editForm)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      name: course.name,
      teacher: course.teacher || '',
      classroom: course.classroom || '',
      location: course.location || '',
      description: course.description || ''
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('确定要删除这个活动吗？')) {
      onDelete(course.id)
      handleClose()
    }
  }

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatTimeSlot = (timeSlot, duration) => {
    // 从mockData.js中的timeSlots获取准确的时间段
    const timeSlots = [
      { startTime: '8:00', endTime: '8:45' },    // 1
      { startTime: '8:55', endTime: '9:40' },    // 2
      { startTime: '10:00', endTime: '10:45' },  // 3
      { startTime: '10:55', endTime: '11:40' },  // 4
      { startTime: '14:00', endTime: '14:45' },  // 5
      { startTime: '14:55', endTime: '15:40' },  // 6
      { startTime: '16:00', endTime: '16:45' },  // 7
      { startTime: '16:55', endTime: '17:40' },  // 8
      { startTime: '19:00', endTime: '19:45' },  // 9
      { startTime: '19:55', endTime: '20:40' },  // 10
      { startTime: '21:00', endTime: '21:45' },  // 11
      { startTime: '21:55', endTime: '22:40' }   // 12
    ]

    if (duration === 1) {
      const slot = timeSlots[timeSlot - 1]
      return slot ? `${slot.startTime}-${slot.endTime}` : '未知时间'
    } else {
      const startSlot = timeSlots[timeSlot - 1]
      const endSlot = timeSlots[timeSlot + duration - 2]
      if (startSlot && endSlot) {
        return `${startSlot.startTime}-${endSlot.endTime}`
      }
      return '未知时间'
    }
  }

  const getDayName = (day) => {
    const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return days[day] || '未知'
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className={`course-modal ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-row">
            <h1 className="course-title">{course.name}</h1>
            {course.type === 'activity' && (
              <div className="action-buttons">
                <button className="btn-delete" onClick={handleDelete}>
                  删除
                </button>
                <button className="btn-edit" onClick={handleEdit}>
                  修改
                </button>
              </div>
            )}
          </div>
          {(course.classroom || course.location) && (
            <p className="course-subtitle">
              {course.classroom && `${course.classroom}`}
              {course.location && `${course.location}`}
            </p>
          )}
        </div>

        <div className="modal-body">
          <div className="course-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>名称</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                {course.type === 'course' && (
                  <div className="form-group">
                    <label>教师</label>
                    <input
                      type="text"
                      value={editForm.teacher}
                      onChange={(e) => handleInputChange('teacher', e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>{course.type === 'course' ? '教室' : '地点'}</label>
                  <input
                    type="text"
                    value={course.type === 'course' ? editForm.classroom : editForm.location}
                    onChange={(e) => handleInputChange(
                      course.type === 'course' ? 'classroom' : 'location',
                      e.target.value
                    )}
                  />
                </div>

                <div className="form-group">
                  <label>描述</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows="3"
                  />
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-row">
                  <span className="info-label">周期</span>
                  <span className="info-value">1-8周</span>
                </div>

                <div className="info-row">
                  <span className="info-label">时间</span>
                  <span className="info-value">{getDayName(course.day)} {formatTimeSlot(course.timeSlot, course.duration)}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">课程类型</span>
                  <span className="info-value">必修</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseModal