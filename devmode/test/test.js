// Get references to elements
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const volumeControl = document.getElementById("volumeControl");
const volumeLabel = document.getElementById("volumeLabel");

// Load saved volume from localStorage (if available)
const savedVolume = localStorage.getItem("audioVolume");
if (savedVolume !== null) {
  audioPlayer.volume = parseFloat(savedVolume);
  volumeControl.value = savedVolume;
  volumeLabel.textContent = `Volume: ${Math.round(savedVolume * 100)}%`;
} else {
  // Set default volume to 50%
  audioPlayer.volume = 0.5;
  volumeControl.value = 0.5;
  volumeLabel.textContent = "Volume: 50%";
}

// Play the audio when the page loads
audioPlayer.play();

// Toggle play/pause functionality
playPauseBtn.addEventListener("click", function() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseIcon.classList.remove("bi-play-fill");
    playPauseIcon.classList.add("bi-pause-fill");
  } else {
    audioPlayer.pause();
    playPauseIcon.classList.remove("bi-pause-fill");
    playPauseIcon.classList.add("bi-play-fill");
  }
});

// Adjust volume and save to localStorage
volumeControl.addEventListener("input", function() {
  const volume = volumeControl.value;
  audioPlayer.volume = volume;
  volumeLabel.textContent = `Volume: ${Math.round(volume * 100)}%`;
  
  // Save the volume level to localStorage
  localStorage.setItem("audioVolume", volume);
}); 

document.addEventListener("DOMContentLoaded", function () {
  const audioPlayer = document.getElementById("audioPlayer");
  const audioSource = document.getElementById("audioSource");
  const controlBtn = document.getElementById("controlBtn");
  const controlIcon = document.getElementById("controlIcon");
  const volumeControl = document.getElementById("volumeControl");
  const volumeLabel = document.getElementById("volumeLabel");

  const tracks = [
      "/devmode/test/Teletubbies say Ehoh  HD Music Video Videos For Kids.mp3",
      "/devmode/test/Baby Shark Dance.mp3"
  ];
  
  let currentTrack = 0;
  let holdTimer;

  document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = document.getElementById("audioPlayer");
    const audioSource = document.getElementById("audioSource");
    const controlBtn = document.getElementById("controlBtn");
    const controlIcon = document.getElementById("controlIcon");
    const volumeControl = document.getElementById("volumeControl");
    const volumeLabel = document.getElementById("volumeLabel");

    const tracks = [
        "/devmode/test/Teletubbies say Ehoh  HD Music Video Videos For Kids.mp3",
        "/devmode/test/Baby Shark Dance.mp3"
    ];
    
    let currentTrack = 0;
    let holdTimer;

    // ฟังก์ชันสลับ Play/Pause
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            controlIcon.classList.remove("bi-play-fill");
            controlIcon.classList.add("bi-pause-fill"); // เปลี่ยนเป็น Pause icon
        } else {
            audioPlayer.pause();
            controlIcon.classList.remove("bi-pause-fill");
            controlIcon.classList.add("bi-play-fill"); // เปลี่ยนเป็น Play icon
        }
    }

    // ฟังก์ชันเปลี่ยนเพลงถัดไป
    function nextTrack() {
        currentTrack = (currentTrack + 1) % tracks.length; // เปลี่ยนเป็นเพลงถัดไป (วนลูป)
        audioSource.src = tracks[currentTrack]; // อัปเดตแหล่งที่มาของเพลง
        audioPlayer.load(); // โหลดเพลงใหม่
        audioPlayer.play(); // เล่นเพลงใหม่
        controlIcon.classList.remove("bi-play-fill");
        controlIcon.classList.add("bi-pause-fill"); // เปลี่ยนไอคอนเป็น Pause หลังจากข้ามเพลง
    }

    // กดปุ่มสั้น ๆ เพื่อ Play/Pause
    controlBtn.addEventListener("click", function () {
        togglePlayPause();
    });

    // กดปุ่มค้างไว้ 2 วินาทีเพื่อเปลี่ยนเพลง
    controlBtn.addEventListener("mousedown", function () {
        holdTimer = setTimeout(nextTrack, 2000); // ถ้ากดค้างไว้ 2 วินาทีให้เปลี่ยนเพลง
    });

    controlBtn.addEventListener("mouseup", function () {
        clearTimeout(holdTimer); // ถ้าปล่อยปุ่มก่อน 2 วินาที ให้ยกเลิกการเปลี่ยนเพลง
    });

    // รองรับการกดค้างบนมือถือ (Touch)
    controlBtn.addEventListener("touchstart", function () {
        holdTimer = setTimeout(nextTrack, 2000);
    });

    controlBtn.addEventListener("touchend", function () {
        clearTimeout(holdTimer);
    });

    // ปรับระดับเสียง
    volumeControl.addEventListener("input", function () {
        audioPlayer.volume = volumeControl.value;
        volumeLabel.textContent = `Volume: ${Math.round(volumeControl.value * 100)}%`;
    });
});
