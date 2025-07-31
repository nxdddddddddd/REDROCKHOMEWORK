import React, { useState } from 'react'
import { weekDays, timeSlots } from '../data/mockData'
import './AddActivityModal.css'

const AddActivityModal = ({ onClose, onAdd, existingActivities, currentWeek }) => {
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    week: currentWeek,
    day: 1,
    timeSlot: 1,
    duration: 1,
    color: '#4CAF50'
  })

  const [dragStart, setDragStart] = useState(null)
  const [dragEnd, setDragEnd] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const colors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
    '#F44336', '#FF5722', '#607D8B', '#795548',
    '#E91E63', '#00BCD4', '#CDDC39', '#3F51B5'
  ]

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 检查时间冲突
  const checkTimeConflict = () => {
    const conflicts = existingActivities.filter(activity =>
      activity.week === form.week &&
      activity.day === form.day &&
      !(
        form.timeSlot + form.duration <= activity.timeSlot ||
        activity.timeSlot + activity.duration <= form.timeSlot
      )
    )
    return conflicts
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      alert('请输入活动名称')
      return
    }

    const conflicts = checkTimeConflict()
    if (conflicts.length > 0) {
      const conflictNames = conflicts.map(c => c.name).join(', ')
      if (!window.confirm(`时间冲突：与"${conflictNames}"重叠，是否继续添加？`)) {
        return
      }
    }

    onAdd(form)
    onClose()
  }

  // 拖拽选择时间段
  const handleMouseDown = (timeSlot) => {
    setIsDragging(true)
    setDragStart(timeSlot)
    setDragEnd(timeSlot)
    handleInputChange('timeSlot', timeSlot)
    handleInputChange('duration', 1)
  }

  const handleMouseEnter = (timeSlot) => {
    if (isDragging && dragStart) {
      const start = Math.min(dragStart, timeSlot)
      const end = Math.max(dragStart, timeSlot)
      setDragEnd(timeSlot)
      handleInputChange('timeSlot', start)
      handleInputChange('duration', end - start + 1)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const isTimeSlotSelected = (timeSlot) => {
    return timeSlot >= form.timeSlot && timeSlot < form.timeSlot + form.duration
  }

  const hasConflict = (timeSlot) => {
    return existingActivities.some(activity =>
      activity.week === form.week &&
      activity.day === form.day &&
      timeSlot >= activity.timeSlot &&
      timeSlot < activity.timeSlot + activity.duration
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-activity-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>添加活动</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-section">
            <h4>基本信息</h4>
            <div className="form-row">
              <div className="form-group">
                <label>活动名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入活动名称"
                  required
                />
              </div>

              <div className="form-group">
                <label>地点</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="请输入活动地点"
                />
              </div>
            </div>

            <div className="form-group">
              <label>描述</label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="请输入活动描述"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>颜色</label>
              <div className="color-picker">
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${form.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleInputChange('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>时间安排</h4>
            <div className="form-row">
              <div className="form-group">
                <label>周次</label>
                <select
                  value={form.week}
                  onChange={(e) => handleInputChange('week', parseInt(e.target.value))}
                >
                  {Array.from({ length: 21 }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>第{week}周</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>星期</label>
                <select
                  value={form.day}
                  onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                >
                  {weekDays.map(day => (
                    <option key={day.id} value={day.id}>{day.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="time-selector">
              <label>时间段（可拖拽选择连续时间）</label>
              <div
                className="time-grid"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {timeSlots.map(slot => (
                  <div
                    key={slot.id}
                    className={`time-slot-option ${isTimeSlotSelected(slot.id) ? 'selected' : ''
                      } ${hasConflict(slot.id) ? 'conflict' : ''}`}
                    onMouseDown={() => handleMouseDown(slot.id)}
                    onMouseEnter={() => handleMouseEnter(slot.id)}
                  >
                    <div className="slot-label">{slot.label}</div>
                    <div className="slot-time">{slot.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              添加活动
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddActivityModal