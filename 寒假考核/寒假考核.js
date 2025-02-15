const SidebarManager = {
  // 配置映射关系
  config: {
    pageMap: {
      recommend: 'home-page',      // 推荐
      playlists: 'playlist-square',  // 精选
      podcast: 'podcast-page',     // 播客
      explore: 'explore-page',     // 漫游
      following: 'following-page', // 关注
      favorites: 'favorites-page', // 我喜欢的音乐
      recent: 'recent-page',       // 最近播放
      'my-podcast': 'my-podcast-page', // 我的播客
      collections: 'collections-page', // 我的收藏
      downloads: 'downloads-page',     // 下载管理
      local: 'local-page',             // 本地音乐
      cloud: 'cloud-page'              // 我的音乐网盘
    },
    style: {
      activeBgColor: 'rgb(253, 62, 7)',
      activeTextColor: 'white',
      hoverBgColor: 'rgb(228, 232, 236)'
    }
  },

  // 初始化
  init() {
    this.cacheElements();
    this.bindEvents();
    this.restoreState();
    this.initHoverEffects();
  },

  // 缓存DOM元素
  cacheElements() {
    this.sidebarItems = document.querySelectorAll('.sidebar li');
    this.pages = document.querySelectorAll('.page');
  },

  // 事件绑定
  bindEvents() {
    this.sidebarItems.forEach(item => {
      item.addEventListener('click', this.handleItemClick.bind(this));
    });
  },

  // 点击处理
  handleItemClick(e) {
    const target = e.currentTarget;
    const pageKey = target.dataset.page;

    if (!pageKey || !this.config.pageMap[pageKey]) {
      console.warn('未配置的侧边栏项目:', pageKey);
      return;
    }

    this.toggleActiveState(target);
    this.switchPage(pageKey);
    this.saveState(pageKey);
  },

  // 切换激活状态
  toggleActiveState(target) {
    this.sidebarItems.forEach(item => {
      item.style.backgroundColor = '';
      item.style.color = '';
    });

    target.style.backgroundColor = this.config.style.activeBgColor;
    target.style.color = this.config.style.activeTextColor;
  },

  // 切换页面
  switchPage(pageKey) {
    const pageId = this.config.pageMap[pageKey];

    this.pages.forEach(page => {
      page.classList.toggle('active', page.id === pageId);
    });

    // 触发自定义事件
    const pageEvent = new CustomEvent('pagechanged', {
      detail: { pageId }
    });
    document.dispatchEvent(pageEvent);
  },

  // 状态持久化
  saveState(pageKey) {
    try {
      localStorage.setItem('currentPage', pageKey);
    } catch (e) {
      console.warn('本地存储失败:', e);
    }
  },

  // 悬停效果
  initHoverEffects() {
    this.sidebarItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
          item.style.backgroundColor = this.config.style.hoverBgColor;
        }
      });

      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          item.style.backgroundColor = '';
        }
      });
    });
  }
};

//推荐界面
// 初始化
document.addEventListener('DOMContentLoaded', () => {
  SidebarManager.init();
});

//轮播图
class SimpleCarousel {
  constructor() {
    this.banner = document.querySelector('.banner');
    this.dots = Array.from(document.querySelectorAll('.dot-list li'));
    this.currentIndex = 0;
    this.interval = null;

    // 初始化图片
    this.initImages();
    this.addEvents();
    this.startAutoPlay();
  }

  initImages() {
    const imgsContainer = document.createElement('div');
    imgsContainer.className = 'banner-imgs';

    // 生成11张图片（实际路径需替换）
    for (let i = 0; i < 11; i++) {
      const img = document.createElement('img');
      img.src = `path/to/image${i + 1}.jpg`; // 替换实际图片路径
      img.classList.add(i === 0 ? 'active' : '');
      imgsContainer.appendChild(img);
    }

    this.banner.insertBefore(imgsContainer, this.banner.firstChild);
    this.images = imgsContainer.querySelectorAll('img');
  }

  addEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('mouseenter', () => this.goTo(index));
    });

    // 悬停暂停
    this.banner.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.banner.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  goTo(index) {
    this.currentIndex = index;

    // 更新图片
    this.images.forEach(img => img.classList.remove('active'));
    this.images[index].classList.add('active');

    // 更新分页点
    this.dots.forEach(dot => dot.classList.remove('active'));
    this.dots[index].classList.add('active');
  }

  next() {
    const newIndex = (this.currentIndex + 1) % 11;
    this.goTo(newIndex);
  }

  startAutoPlay() {
    this.interval = setInterval(() => this.next(), 3000);
  }

  stopAutoPlay() {
    clearInterval(this.interval);
  }
}

//精选界面
class PlaylistSquareTabs {
  constructor() {
    this.container = document.getElementById('playlist-square');
    if (!this.container) return;

    this.tabs = this.container.querySelectorAll('.playlist-squareWrap1 span');
    this.panes = this.container.querySelectorAll('.tab-pane');
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', this.handleTabClick.bind(this));
    });

    // 默认激活第一个标签
    if (this.tabs.length > 0) {
      this.switchTab(this.tabs[0].dataset.tab);
    }
  }

  handleTabClick(e) {
    const target = e.currentTarget;
    const tabId = target.dataset.tab;
    this.switchTab(tabId);
  }

  switchTab(tabId) {
    // 切换下划线
    this.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // 切换内容区域
    this.panes.forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });

    // 触发自定义事件
    const tabEvent = new CustomEvent('tabchanged', {
      detail: { tabId }
    });
    document.dispatchEvent(tabEvent);
  }
}

// 页面切换事件初始化
document.addEventListener('pagechanged', (e) => {
  if (e.detail.pageId === 'playlist-square') {
    new PlaylistSquareTabs();
  }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new TabSwitcher();
});

// 初始化
new SimpleCarousel();

//音乐播放器
class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.playlist = []; // 当前播放列表
    this.currentIndex = 0; // 当前播放索引
    this.isPlaying = false;

    // 绑定事件
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', this.next.bind(this));
  }

  // 加载并播放音乐
  play(url) {
    this.audio.src = url;
    this.audio.play();
    this.isPlaying = true;
  }

  // 播放/暂停切换
  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  // 进度条更新
  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    document.querySelector('.seek-bar').value = progress;
    document.querySelector('.progress-time').textContent =
      this.formatTime(this.audio.currentTime);
  }

  // 时间格式化
  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  // 上一首/下一首
  prev() { /* ... */ }
  next() { /* ... */ }
}

const player = new MusicPlayer();

// 绑定按钮事件
document.querySelector('.play-pause-button').addEventListener('click', () => {
  player.togglePlay();
  const btn = document.querySelector('.play-pause-button');
  btn.textContent = player.isPlaying ? '⏸' : '▶';
});

// 进度条拖拽
document.querySelector('.seek-bar').addEventListener('input', function (e) {
  const duration = player.audio.duration || 0;
  const currentTime = (e.target.value / 100) * duration;
  player.audio.currentTime = currentTime;
  document.querySelector('.progress-time').textContent =
    player.formatTime(currentTime);
});

// 音量控制
document.querySelector('.volume-button').addEventListener('mouseenter', () => {
  document.querySelector('.volume-slider').style.display = 'block';
});

document.querySelector('.volume-slider input').addEventListener('input', function (e) {
  player.audio.volume = e.target.value / 100;
  document.querySelector('.slider-value').textContent = `${e.target.value}%`;
});

// 获取歌单数据示例
async function fetchPlaylistDetail(id) {
  try {
    const res = await fetch(`http://localhost:3000/playlist/detail?id=${id}`);
    const data = await res.json();
    return data.playlist.tracks;
  } catch (err) {
    console.error('获取歌单失败:', err);
  }
}

// 点击歌单时调用
document.querySelectorAll('.playlist').forEach(item => {
  item.addEventListener('click', async () => {
    const songs = await fetchPlaylistDetail(item.dataset.id);
    player.playlist = songs.map(song => ({
      id: song.id,
      name: song.name,
      url: `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`,
      cover: song.al.picUrl
    }));

    player.currentIndex = 0;
    player.play(player.playlist[0].url);
    updatePlayerUI(player.playlist[0]);
  });
});

// 更新播放器UI
function updatePlayerUI(song) {
  document.querySelector('.song-name').textContent = song.name;
  document.querySelector('.album-cover').src = song.cover;
}

//音量控制
document.querySelector('.volume-button').addEventListener('mouseover', function () {
  document.querySelector('.volume-slider').style.display = 'block';
});

document.querySelector('.volume-button').addEventListener('mouseout', function () {
  document.querySelector('.volume-slider').style.display = 'none';
});

// 更新滑块值
document.querySelector('.seek-bar').addEventListener('input', function () {
  document.querySelector('.slider-value').textContent = this.value + '%';
});