import React, { useState, useEffect } from 'react'
import { weekDays, timeSlots } from '../data/mockData'
import './SlideInModal.css'

const SlideInModal = ({ isOpen, onClose, onAdd, onUpdate, editingCourse = null, defaultDay, defaultTimeSlot }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isClosing, setIsClosing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    selectedWeeks: [],
    day: defaultDay || 1,
    startTimeSlot: defaultTimeSlot || 1,
    endTimeSlot: defaultTimeSlot || 1,
    selectedTag: ''
  })
  const [showWeekPicker, setShowWeekPicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [titleError, setTitleError] = useState('')

  // 预定义标签
  const predefinedTags = [
    '自习', '值班', '考试', '英语', '开会',
    '作业', '补课', '实验', '复习', '学习'
  ]

  // 重置表单数据
  useEffect(() => {
    if (isOpen) {
      if (editingCourse) {
        // 编辑模式
        setFormData({
          title: editingCourse.name || '',
          description: editingCourse.description || '',
          location: editingCourse.location || editingCourse.classroom || '',
          selectedWeeks: [editingCourse.week] || [],
          day: editingCourse.day || 1,
          startTimeSlot: editingCourse.timeSlot || 1,
          endTimeSlot: (editingCourse.timeSlot + editingCourse.duration - 1) || 1,
          selectedTag: editingCourse.tag || ''
        })
        setCurrentStep(3) // 编辑时直接跳到第三步
      } else {
        // 新增模式
        setFormData({
          title: '',
          description: '',
          location: '',
          selectedWeeks: [],
          day: defaultDay || 1,
          startTimeSlot: defaultTimeSlot || 1,
          endTimeSlot: defaultTimeSlot || 1,
          selectedTag: ''
        })
        setCurrentStep(1)
      }
      setTitleError('')
      setIsClosing(false)
    }
  }, [isOpen, editingCourse, defaultDay, defaultTimeSlot])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
      setCurrentStep(1)
      setShowWeekPicker(false)
      setShowTimePicker(false)
    }, 300)
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setTitleError('掌友，标题不能为空哟！')
        return
      }
      setTitleError('')
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (field === 'title' && titleError) {
      setTitleError('')
    }
  }

  const handleTagSelect = (tag) => {
    setFormData(prev => ({
      ...prev,
      selectedTag: prev.selectedTag === tag ? '' : tag,
      title: prev.selectedTag === tag ? '' : tag // 选择标签时自动填入标题
    }))
    if (titleError) {
      setTitleError('')
    }
  }

  const handleWeekToggle = (week) => {
    setFormData(prev => ({
      ...prev,
      selectedWeeks: prev.selectedWeeks.includes(week)
        ? prev.selectedWeeks.filter(w => w !== week)
        : [...prev.selectedWeeks, week]
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

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      setTitleError('掌友，标题不能为空哟！')
      return
    }

    if (formData.selectedWeeks.length === 0) {
      alert('请选择至少一周')
      return
    }

    // 检查时间冲突（这里可以添加冲突检测逻辑）
    const hasConflict = false // 简化处理，实际应该检查冲突

    if (hasConflict) {
      alert('选择的时间段有冲突，请重新选择')
      return
    }

    const courseData = {
      id: editingCourse ? editingCourse.id : Date.now(),
      name: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      day: formData.day,
      timeSlot: formData.startTimeSlot,
      duration: formData.endTimeSlot - formData.startTimeSlot + 1,
      type: 'activity',
      editable: true,
      weeks: formData.selectedWeeks,
      tag: formData.selectedTag
    }

    if (editingCourse) {
      // 编辑模式
      onUpdate(editingCourse.id, courseData)
    } else {
      // 新增模式，为每个选中的周创建活动
      formData.selectedWeeks.forEach(week => {
        const newCourse = {
          ...courseData,
          id: Date.now() + week, // 确保每个周的活动有唯一ID
          week: week
        }
        onAdd(newCourse)
      })
    }

    handleClose()
  }

  const getDayName = (day) => {
    const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return days[day] || '未知'
  }

  const getTimeSlotName = (slot) => {
    const timeSlot = timeSlots.find(t => t.id === slot)
    return timeSlot ? `第${timeSlot.label}节 (${timeSlot.startTime}-${timeSlot.endTime})` : '未知时间'
  }

  if (!isOpen) return null

  return (
    <div className={`slide-modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`slide-modal ${isClosing ? 'slide-out' : 'slide-in'}`}>
        {/* 返回按钮 */}
        {currentStep > 1 && (
          <button className="back-btn" onClick={handlePrevStep}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* 关闭按钮 */}
        <button className="slide-close-btn" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="slide-modal-content">
          {/* 第一页：输入标题 */}
          {currentStep === 1 && (
            <>
              <div className="step-content">
                <h1 className="step-title">为你的行程添加一个标题</h1>
                <div className="input-container">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="请输入标题"
                    className={`title-input ${titleError ? 'error' : ''}`}
                    autoFocus
                  />
                  {titleError && <div className="error-message">{titleError}</div>}
                </div>

                {/* 标签选择区域 */}
                <div className="tags-container">
                  <div className="tags-grid">
                    {predefinedTags.map(tag => (
                      <button
                        key={tag}
                        className={`tag-item ${formData.selectedTag === tag ? 'selected' : ''}`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 独立的按钮容器 */}
              <div className="button-container">
                <button className="next-btn" onClick={handleNextStep}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* 第二页：输入描述 */}
          {currentStep === 2 && (
            <>
              <div className="step-content">
                <h1 className="step-title">为你的行程添加具体内容</h1>
                <div className="input-container">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="请输入具体内容"
                    className="description-input"
                    rows="6"
                    autoFocus
                  />
                </div>
              </div>

              {/* 独立的按钮容器 */}
              <div className="button-container">
                <button className="next-btn" onClick={handleNextStep}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* 第三页：选择时间和周数 */}
          {currentStep === 3 && (
            <>
              <div className="step-content">
                <h1 className="step-title">{formData.title}</h1>

                <div className="input-container">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="请输入地点"
                    className="location-input"
                  />
                </div>

                {/* 选择周数 */}
                <div className="selection-row">
                  <button
                    className="selection-btn"
                    onClick={() => setShowWeekPicker(true)}
                  >
                    <span>选择第几周</span>
                    <span className="selection-value">
                      {formData.selectedWeeks.length > 0
                        ? `已选择 ${formData.selectedWeeks.length} 周`
                        : '请选择'
                      }
                    </span>
                  </button>
                </div>

                {/* 选择时间 */}
                <div className="selection-row">
                  <button
                    className="selection-btn"
                    onClick={() => setShowTimePicker(true)}
                  >
                    <span>选择时间</span>
                    <span className="selection-value">
                      {getDayName(formData.day)} {getTimeSlotName(formData.startTimeSlot)}
                      {formData.endTimeSlot !== formData.startTimeSlot &&
                        ` - ${getTimeSlotName(formData.endTimeSlot)}`
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* 独立的按钮容器 */}
              <div className="button-container">
                <button className="confirm-btn" onClick={handleSubmit}>
                  确定
                </button>
              </div>
            </>
          )}
        </div>

        {/* 周数选择弹窗 */}
        {showWeekPicker && (
          <div className="picker-overlay" onClick={() => setShowWeekPicker(false)}>
            <div className="week-picker" onClick={e => e.stopPropagation()}>
              <div className="picker-header">
                <h3>选择周数</h3>
              </div>
              <div className="week-grid">
                {Array.from({ length: 20 }, (_, i) => i + 1).map(week => (
                  <button
                    key={week}
                    className={`week-item ${formData.selectedWeeks.includes(week) ? 'selected' : ''}`}
                    onClick={() => handleWeekToggle(week)}
                  >
                    第{week}周
                  </button>
                ))}
              </div>
              <button
                className="picker-confirm"
                onClick={() => setShowWeekPicker(false)}
              >
                确定
              </button>
            </div>
          </div>
        )}

        {/* 时间选择弹窗 */}
        {showTimePicker && (
          <div className="picker-overlay" onClick={() => setShowTimePicker(false)}>
            <div className="time-picker" onClick={e => e.stopPropagation()}>
              <div className="picker-header">
                <h3>选择时间</h3>
              </div>

              <div className="time-selection">
                <div className="time-group">
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

                <div className="time-group">
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

                <div className="time-group">
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

              <button
                className="picker-confirm"
                onClick={() => setShowTimePicker(false)}
              >
                确定
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlideInModal