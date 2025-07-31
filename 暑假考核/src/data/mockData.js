// 模拟课程数据
export const mockData = {
  courses: [
    {
      id: 1,
      name: 'Python程序设计',
      teacher: '张老师',
      classroom: '2310',
      week: 6,
      day: 1, // 周一
      timeSlot: 1, // 第1-2节课
      duration: 2,
      type: 'course',
      editable: true
    },
    {
      id: 2,
      name: '计算机网络',
      teacher: '李老师',
      classroom: '2201',
      week: 6,
      day: 1,
      timeSlot: 3,
      duration: 2,
      type: 'course',
      editable: true
    },
    {
      id: 3,
      name: '数据结构',
      teacher: '王老师',
      classroom: '2306',
      week: 6,
      day: 2,
      timeSlot: 1,
      duration: 2,
      type: 'course',
      editable: true
    },
    {
      id: 4,
      name: '软件工程',
      teacher: '赵老师',
      classroom: '2108',
      week: 6,
      day: 2,
      timeSlot: 3,
      duration: 2,
      type: 'course',
      editable: true
    },
    {
      id: 5,
      name: '操作系统',
      teacher: '陈老师',
      classroom: '2201',
      week: 6,
      day: 3,
      timeSlot: 1,
      duration: 2,
      type: 'course',
      editable: true
    },
    {
      id: 6,
      name: '数据库原理',
      teacher: '刘老师',
      classroom: '2207',
      week: 6,
      day: 4,
      timeSlot: 1,
      duration: 2,
      type: 'course',
      editable: true
    },
    {
      id: 7,
      name: '算法分析',
      teacher: '周老师',
      classroom: '2410',
      week: 6,
      day: 4,
      timeSlot: 3,
      duration: 2,
      type: 'course',
      editable: true
    },
    {
      id: 8,
      name: '机器学习',
      teacher: '吴老师',
      classroom: '2115',
      week: 6,
      day: 5,
      timeSlot: 1,
      duration: 2,
      type: 'course',
      editable: true
    }
  ],

  activities: [
    {
      id: 101,
      name: '习近平新时代中国特色社会主义思想',
      location: '2501',
      week: 6,
      day: 1,
      timeSlot: 5,
      duration: 2,
      type: 'activity',
      description: '重要的思想政治课程',
      editable: true
    },
    {
      id: 102,
      name: '体育分析与健身论',
      location: '2115',
      week: 6,
      day: 2,
      timeSlot: 5,
      duration: 2,
      type: 'activity',
      description: '体育理论课程',
      editable: true
    },
    {
      id: 103,
      name: '风华运动会',
      location: '操场',
      week: 6,
      day: 6,
      timeSlot: 2,
      duration: 1,
      type: 'activity',
      description: '学校运动会活动',
      editable: false
    },
    {
      id: 104,
      name: '中国近现代史纲要',
      location: '3111',
      week: 6,
      day: 6,
      timeSlot: 9,
      duration: 3,
      type: 'activity',
      description: '历史课程',
      editable: true
    }
  ]
}

// 时间段配置
export const timeSlots = [
  {
    id: 1,
    label: '1',
    startTime: '8:00',
    endTime: '8:45',
    period: 1
  },
  {
    id: 2,
    label: '2',
    startTime: '8:55',
    endTime: '9:40',
    period: 2
  },
  {
    id: 3,
    label: '3',
    startTime: '10:00',
    endTime: '10:45',
    period: 3
  },
  {
    id: 4,
    label: '4',
    startTime: '10:55',
    endTime: '11:40',
    period: 4
  },
  {
    id: 5,
    label: '5',
    startTime: '14:00',
    endTime: '14:45',
    period: 5
  },
  {
    id: 6,
    label: '6',
    startTime: '14:55',
    endTime: '15:40',
    period: 6
  },
  {
    id: 7,
    label: '7',
    startTime: '16:00',
    endTime: '16:45',
    period: 7
  },
  {
    id: 8,
    label: '8',
    startTime: '16:55',
    endTime: '17:40',
    period: 8
  },
  {
    id: 9,
    label: '9',
    startTime: '19:00',
    endTime: '19:45',
    period: 9
  },
  {
    id: 10,
    label: '10',
    startTime: '19:55',
    endTime: '20:40',
    period: 10
  },
  {
    id: 11,
    label: '11',
    startTime: '21:00',
    endTime: '21:45',
    period: 11
  },
  {
    id: 12,
    label: '12',
    startTime: '21:55',
    endTime: '22:40',
    period: 12
  }
]

// 星期配置
export const weekDays = [
  { id: 1, name: '周一', short: '一' },
  { id: 2, name: '周二', short: '二' },
  { id: 3, name: '周三', short: '三' },
  { id: 4, name: '周四', short: '四' },
  { id: 5, name: '周五', short: '五' },
  { id: 6, name: '周六', short: '六' },
  { id: 7, name: '周日', short: '日' }
]

// 根据时间段获取颜色
export const getTimeSlotColor = (timeSlot) => {
  if (timeSlot >= 1 && timeSlot <= 4) {
    return '#F9E8D7'
  } else if (timeSlot >= 5 && timeSlot <= 8) {
    return '#F9E3E5'
  } else if (timeSlot >= 9 && timeSlot <= 12) {
    return '#DDE3F9'
  }
  return '#F9E8D7' // 默认颜色
}