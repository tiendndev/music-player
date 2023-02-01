const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "TIEN_PLAYER";

const cd = $(".cd");
const cdWidth = cd.offsetWidth;

const heading = $("header h2");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");

const progress = $("#progress");

const cdThumb = $(".cd-thumb");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem("TIEN_PLAYER")) || {},
  songs: [
    {
      name: "Nandemonaiya",
      singer: "Your Name OST",
      path: "./audio/nandemonaiya.mp3",
      image: "./img/kimi-no-nawa.jpg",
    },
    {
      name: "Yoru no Kuni",
      singer: "Aimer",
      path: "./audio/aimer.mp3",
      image: "./img/aimer.jpg",
    },
    {
      name: "Sparkle",
      singer: "Your Name OST",
      path: "./audio/sparkle.mp3",
      image: "./img/sparkle.jpg",
    },
    {
      name: "Tabun",
      singer: "YOASABI",
      path: "./audio/tabun.mp3",
      image: "./img/tabun.png",
    },
    {
      name: "Sihouette",
      singer: "KANABOON",
      path: "./audio/sihouette.mp3",
      image: "./img/sihouette.jpg",
    },
    {
      name: "Irony",
      singer: "Majiko",
      path: "./audio/irony.mp3",
      image: "./img/majiko.jpg",
    },
    {
      name: "The Reason Why",
      singer: "Ayasa",
      path: "./audio/The reason why.mp3",
      image: "./img/ayasa.jpg",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem("TIEN_PLAYER", JSON.stringify(this.config));
    // console.log(this.config);
  },

  render: function () {
    const htmls = app.songs.map((song, index) => {
      return `
              <div 
                  class="song ${this.currentIndex === index ? "active" : ""}" 
                  data-index="${index}">
                <div class="info">
                    <div 
                      class="thumb" 
                      style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                    </div>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>`;
    });
    $(".playlist").innerHTML = htmls.join("");
  },

  handleEvents: function () {
    // Xử lý CD quay / dừng
    const cdThumbAnimation = cdThumb.animate([{ transform: "rotate(360deg" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimation.pause();

    // Xử lý khi phóng to / Thu nhỏ
    document.onscroll = function () {
      const scrollValue = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollValue;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = () => {
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Xử lý khi bài hát được play
    audio.onplay = () => {
      this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimation.play();
    };

    // Xử lý khi bài hát bị pause
    audio.onpause = () => {
      this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimation.pause();
    };

    // Xử lý khi tiến độ bài hát thay đổi
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua bài hát
    progress.onchange = (e) => {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi bấm previous bài hát
    prevBtn.onclick = () => {
      if (this.isRandom) {
        this.playRandomSong();
      } else {
        this.prevSong();
      }
      audio.play();
      this.render();
      this.scrollToActiveSong();
    };

    // Khi bấm next bài hát
    nextBtn.onclick = () => {
      if (this.isRandom) {
        this.playRandomSong();
      } else {
        this.nextSong();
      }
      audio.play();
      this.render();
      this.scrollToActiveSong();
    };

    // Xử lý khi bấm on / off random
    randomBtn.onclick = () => {
      this.isRandom = !this.isRandom;
      randomBtn.classList.toggle("active", this.isRandom);
      this.setConfig("isRandom", this.isRandom);
    };

    // Xử lý repeat bài hát khi bấm on /off repeat
    repeatBtn.onclick = () => {
      this.isRepeat = !this.isRepeat;
      repeatBtn.classList.toggle("active", this.isRepeat);
      this.setConfig("isRepeat", this.isRepeat);
    };

    // Xử lý next bài hát khi audio ended
    audio.onended = () => {
      if (this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi Click vào playlist
    playlist.onclick = (e) => {
      const songElement = e.target.closest(".song:not(.active)");
      if (songElement && !e.target.closest(".option")) {
        // Xử lý khi click vào bài hát trên playlist
        if (songElement) {
          this.currentIndex = Number(songElement.dataset.index);
          this.loadCurrentSong();
          this.render();
          audio.play();
        }

        // Xử lý khi click vào option
        if (e.target.closest(".option")) {
          console.log(123);
        }
      }
    };
  },

  definedProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Gán cấu hình từ Config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho Object
    this.definedProperties();

    // Lắng nghe / Xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Render config ra giao diện khi load ứng dụng
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
