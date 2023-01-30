const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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

const app = {
  currentIndex: 0,
  isPlaying: false,
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

  render: function () {
    const htmls = app.songs.map((song) => {
      return `<div class="song">
                <div
                  class="thumb"
                  style="background-image: url('${song.image}')"></div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
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

      // Khi previous bài hát
      prevBtn.onclick = () => {
        this.prevSong();
        audio.play();
      };

      // Khi next bài hát
      nextBtn.onclick = () => {
        this.nextSong();
        audio.play();
      };
    };
  },

  definedProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    console.log(audio.src);
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

  start: function () {
    // Định nghĩa các thuộc tính cho Object
    this.definedProperties();

    // Lắng nghe / Xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
