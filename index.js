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
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
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
    // X??? l?? CD quay / d???ng
    const cdThumbAnimation = cdThumb.animate([{ transform: "rotate(360deg" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimation.pause();

    // X??? l?? khi ph??ng to / Thu nh???
    document.onscroll = function () {
      const scrollValue = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollValue;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // X??? l?? khi click play
    playBtn.onclick = () => {
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // X??? l?? khi b??i h??t ???????c play
    audio.onplay = () => {
      this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimation.play();
    };

    // X??? l?? khi b??i h??t b??? pause
    audio.onpause = () => {
      this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimation.pause();
    };

    // X??? l?? khi ti???n ????? b??i h??t thay ?????i
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // X??? l?? khi tua b??i h??t
    progress.oninput = (e) => {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi b???m previous b??i h??t
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

    // Khi b???m next b??i h??t
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

    // X??? l?? khi b???m on / off random
    randomBtn.onclick = () => {
      this.isRandom = !this.isRandom;
      randomBtn.classList.toggle("active", this.isRandom);
      this.setConfig("isRandom", this.isRandom);
    };

    // X??? l?? repeat b??i h??t khi b???m on /off repeat
    repeatBtn.onclick = () => {
      this.isRepeat = !this.isRepeat;
      repeatBtn.classList.toggle("active", this.isRepeat);
      this.setConfig("isRepeat", this.isRepeat);
    };

    // X??? l?? next b??i h??t khi audio ended
    audio.onended = () => {
      if (this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // L???ng nghe h??nh vi Click v??o playlist
    playlist.onclick = (e) => {
      const songElement = e.target.closest(".song:not(.active)");
      if (songElement && !e.target.closest(".option")) {
        // X??? l?? khi click v??o b??i h??t tr??n playlist
        if (songElement) {
          this.currentIndex = Number(songElement.dataset.index);
          this.loadCurrentSong();
          this.render();
          audio.play();
        }

        // X??? l?? khi click v??o option
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
    // G??n c???u h??nh t??? Config v??o ???ng d???ng
    this.loadConfig();

    // ?????nh ngh??a c??c thu???c t??nh cho Object
    this.definedProperties();

    // L???ng nghe / X??? l?? c??c s??? ki???n (DOM events)
    this.handleEvents();

    // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Render config ra giao di???n khi load ???ng d???ng
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
