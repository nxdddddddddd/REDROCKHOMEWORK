# 掌上重邮课表仿制版

基于 React 的课表管理应用，仿制掌上重邮的课表功能。

## 功能特性

- 📅 **课表展示**: 支持周视图和学期视图
- 📚 **课程管理**: 查看课程详情
- 🎯 **活动管理**: 添加、编辑、删除个人活动
- 🖱️ **拖拽功能**: 支持活动拖拽移动
- 📱 **响应式设计**: 适配不同屏幕尺寸

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式**: 原生 CSS3
- **数据模拟**: 本地 Mock 数据

## 项目结构

```
暑假考核/
├── README.md                    # 项目说明文档
├── index.html                   # HTML 入口文件
├── package.json                 # 项目依赖配置
├── package-lock.json            # 依赖版本锁定
├── vite.config.js              # Vite 构建配置
└── src/                        # 源代码目录
    ├── App.jsx                 # 主应用组件
    ├── App.css                 # 主应用样式
    ├── main.jsx                # 应用入口文件
    ├── index.css               # 全局样式
    ├── components/             # 组件目录
    │   ├── DragContainer.jsx   # 主容器组件
    │   ├── DragContainer.css   # 主容器样式
    │   ├── Header.jsx          # 顶部导航组件
    │   ├── Header.css          # 顶部导航样式
    │   ├── WeekView.jsx        # 周视图组件
    │   ├── WeekView.css        # 周视图样式
    │   ├── SemesterView.jsx    # 学期视图组件
    │   ├── SemesterView.css    # 学期视图样式
    │   ├── CourseCard.jsx      # 课程卡片组件
    │   ├── CourseCard.css      # 课程卡片样式
    │   ├── CourseModal.jsx     # 课程详情弹窗
    │   ├── CourseModal.css     # 课程详情弹窗样式
    │   ├── SlideInModal.jsx    # 滑入式添加弹窗
    │   ├── SlideInModal.css    # 滑入式弹窗样式
    │   ├── AddActivityModal.jsx # 添加活动弹窗
    │   ├── AddActivityModal.css # 添加活动弹窗样式
    │   ├── AddCourseModal.jsx  # 添加课程弹窗
    │   ├── AddCourseModal.css  # 添加课程弹窗样式
    │   ├── HomePage.jsx        # 首页组件
    │   ├── HomePage.css        # 首页样式
    │   ├── SchedulePage.jsx    # 课表页面组件
    │   ├── SchedulePage.css    # 课表页面样式
    │   ├── DragBar.jsx         # 拖拽条组件
    │   └── DragBar.css         # 拖拽条样式
    ├── data/                   # 数据目录
    │   └── mockData.js         # 模拟数据文件
    └── utils/                  # 工具函数目录
        └── colorUtils.js       # 颜色工具函数
```

## 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本
```bash
npm run build
```

## 使用说明

### 基本操作

1. **查看课表**
   - 默认显示当前周（第6周）的课表
   - 课程显示课程名、教师、教室信息
   - 活动显示活动名、地点信息

2. **切换视图**
   - 点击"周视图"查看单周课表
   - 点击"整学期"查看整个学期概览

3. **添加活动**
   - 点击"+ 添加活动"按钮
   - 填写活动信息（名称、地点、描述等）
   - 选择时间（支持拖拽选择连续时间段）
   - 选择颜色标识

4. **管理活动**
   - 点击活动卡片查看详情
   - 在详情弹窗中可以编辑或删除活动
   - 支持拖拽活动到其他时间段

5. **导航功能**
   - 点击"回到本周"快速返回当前周
   - 在整学期视图中点击任意周跳转到该周

### 高级功能

1. **拖拽操作**
   - 活动卡片可以拖拽到其他时间段
   - 拖拽时会显示放置区域提示
   - 只有活动可以拖拽，课程不可拖拽

2. **时间冲突检测**
   - 添加活动时自动检测时间冲突
   - 如有冲突会弹出确认对话框
   - 冲突的时间段会用红色标识

3. **响应式设计**
   - 自动适配不同屏幕尺寸
   - 移动端优化的触摸操作
   - 合理的字体和间距调整

## 数据结构

### 课程数据格式
```javascript
{
  id: 1,
  name: "课程名称",
  teacher: "教师姓名",
  classroom: "教室号",
  week: 6,           // 第几周
  day: 1,            // 星期几 (1-7)
  timeSlot: 1,       // 时间段 (1-6)
  duration: 2,       // 持续时间段数
  type: "course",    // 类型：course/activity
  color: "#FF9800"   // 显示颜色
}
```

### 活动数据格式
```javascript
{
  id: 101,
  name: "活动名称",
  location: "活动地点",
  description: "活动描述",
  week: 6,
  day: 1,
  timeSlot: 5,
  duration: 2,
  type: "activity",
  color: "#E91E63"
}
```

## 时间配置

### 时间段设置
- 第1-2节: 08:00-09:40
- 第3-4节: 10:00-11:40
- 第5-6节: 14:00-15:40
- 第7-8节: 16:00-17:40
- 第9-10节: 19:00-20:40
- 第11-12节: 21:00-22:40

### 学期设置
- 学期总共21周
- 学期开始日期: 2024年2月26日
- 当前周: 第6周

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 移动端测试

使用浏览器开发者工具（F12）切换到移动端模式进行测试：
1. 打开浏览器开发者工具
2. 点击设备模拟按钮
3. 选择移动设备型号
4. 测试触摸操作和响应式布局

## 开发说明

### 组件设计原则
- 单一职责：每个组件只负责一个功能
- 可复用性：组件设计考虑复用场景
- 可扩展性：预留扩展接口和配置项

### 状态管理
- 使用React Hooks进行状态管理
- 主要状态集中在App组件中
- 通过props传递数据和回调函数

### 样式规范
- 使用原生CSS，不依赖第三方UI库
- 采用BEM命名规范
- 响应式设计使用媒体查询
- 动画效果使用CSS3 transition和animation

## 已知问题

1. 时间显示为模拟时间，非实时更新
2. 数据存储在内存中，刷新页面会丢失修改
3. 拖拽功能在某些移动设备上可能不够流畅

## 后续优化方向

1. 添加数据持久化（localStorage/IndexedDB）
2. 实现真实的网络请求和后端接口
3. 添加更多的课表主题和自定义选项
4. 优化移动端拖拽体验
5. 添加课表导入导出功能

## 许可证

MIT License