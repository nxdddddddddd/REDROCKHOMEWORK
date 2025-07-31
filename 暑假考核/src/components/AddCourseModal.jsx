import React, { useState, useEffect } from 'react'
import { weekDays, timeSlots } from '../data/mockData'
import './AddCourseModal.css'

const AddCourseModal = ({ isOpen, onClose, onAdd, defaultDay, defaultTimeSlot }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    day: defaultDay || 1,
    startTimeSlot: defaultTimeSlot || 1,
    endTimeSlot: defaultTimeSlot || 1
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        location: '',
        day: defaultDay || 1,
        startTimeSlot: defaultTimeSlot || 1,
        endTimeSlot: defaultTimeSlot || 1
      })
    }
  }, [isOpen, defaultDay, defaultTimeSlot])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('请输入课程名称')
      return
    }

    const newCourse = {
      id: Date.now(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      day: formData.day,
      timeSlot: formData.startTimeSlot,
      duration: formData.endTimeSlot - formData.startTimeSlot + 1,
      type: 'activity',
      editable: true,
      week: 6 // 当前周
    }

    onAdd(newCourse)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTimeChange = (field, value) => {
    const newValue = parseInt(value)
    setFormData(prev => {
      const updated = { ...prev, [field]: newValue }
      // 确保结束时间不小于开始时间
      if (field === 'startTimeSlot' && updated.endTimeSlot < newValue) {
        updated.endTimeSlot = newValue
      }
      if (field === 'endTimeSlot' && newValue < updated.startTimeSlot) {
        updated.startTimeSlot = newValue
      }
      return updated
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>添加活动</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>活动名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="请输入活动名称"
              required
            />
          </div>

          <div className="form-group">
            <label>活动描述</label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="请输入活动描述（可选）"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>活动地点</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              placeholder="请输入活动地点"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>星期</label>
              <select
                value={formData.day}
                onChange={e => handleInputChange('day', parseInt(e.target.value))}
              >
                {weekDays.map(day => (
                  <option key={day.id} value={day.id}>
                    {day.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>开始时间</label>
              <select
                value={formData.startTimeSlot}
                onChange={e => handleTimeChange('startTimeSlot', e.target.value)}
              >
                {timeSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    第{slot.label}节 ({slot.startTime}-{slot.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>结束时间</label>
              <select
                value={formData.endTimeSlot}
                onChange={e => handleTimeChange('endTimeSlot', e.target.value)}
              >
                {timeSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    第{slot.label}节 ({slot.startTime}-{slot.endTime})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              取消
            </button>
            <button type="submit" className="submit-btn">
              添加活动
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCourseModal