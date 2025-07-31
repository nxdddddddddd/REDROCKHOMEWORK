// 根据时间段获取课程卡片背景色
export const getTimeSlotColor = (timeSlot) => {
  if (timeSlot >= 1 && timeSlot <= 4) {
    return '#F9E8D7'; // 1-4节：浅橙色
  } else if (timeSlot >= 5 && timeSlot <= 8) {
    return '#F9E3E5'; // 5-8节：浅粉色
  } else if (timeSlot >= 9 && timeSlot <= 12) {
    return '#DDE3F9'; // 9-12节：浅蓝色
  }
  return '#f8f9fa'; // 默认颜色
};

// 根据时间段获取文字颜色
export const getTimeSlotTextColor = (timeSlot) => {
  if (timeSlot >= 1 && timeSlot <= 4) {
    return '#EC8C3A'; // 1-4节：橙色文字
  } else if (timeSlot >= 5 && timeSlot <= 8) {
    return '#F96E6F'; // 5-8节：红色文字
  } else if (timeSlot >= 9 && timeSlot <= 12) {
    return '#4267E7'; // 9-12节：蓝色文字
  }
  return '#333'; // 默认文字颜色
};

// 获取不可编辑课程的颜色
export const getNonEditableColor = () => {
  return '#808080'; // 灰色
};

// 获取不可编辑课程的文字颜色
export const getNonEditableTextColor = () => {
  return '#ffffff'; // 白色文字
};