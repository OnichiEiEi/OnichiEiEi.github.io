let currentEmojiIndex = parseInt(localStorage.getItem('currentEmojiIndex')) || 0;

function calenderShow() {
    console.log("calenderShow called");
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("homePage").classList.remove("visible");
    document.getElementById("calendarPage").classList.remove("hidden");
    document.getElementById("calendarPage").classList.add("visible");
}

function homeShow() {
    console.log("homeShow called");
    document.getElementById("calendarPage").classList.add("hidden");
    document.getElementById("calendarPage").classList.remove("visible");
    document.getElementById("settingPage").classList.add("hidden");
    document.getElementById("settingPage").classList.remove("visible");
    document.getElementById("homePage").classList.remove("hidden");
    document.getElementById("homePage").classList.add("visible");
}

function settingShow() {
    console.log("sittingShow called");
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("homePage").classList.remove("visible");
    document.getElementById("calendarPage").classList.add("hidden");
    document.getElementById("calendarPage").classList.remove("visible");
    document.getElementById("settingPage").classList.remove("hidden");
    document.getElementById("settingPage").classList.add("visible");
}

function showMood() {
    document.getElementById('emojiOverlay').style.display = 'flex';
}

function closeOverlay() {
    document.getElementById('emojiOverlay').style.display = 'none';
}

async function loadFromMongoDB(key, callback) {
    try {
        const response = await fetch(`http://localhost:8000/load/${key}`);
        if (response.ok) {
            const value = await response.json();
            callback(value);
        } else {
            console.log('No such document!');
            callback(null);
        }
    } catch (error) {
        console.error('Error loading data from MongoDB:', error);
        callback(null);
    }
}

async function saveToMongoDB(key, value) {
    try {
        const response = await fetch('http://localhost:8000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key, value })
        });
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
    }
}

function selectEmoji(emoji) {
    document.getElementById('showEmoji').src = `/assets/img/${emoji}`;
    const messages = emojiMessages[emoji];
    if (messages) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('showSupport').innerText = randomMessage;
    }
    updateMonthEmoji(emoji);
    closeOverlay(); // Close the overlay after selecting an emoji
    saveToMongoDB('selectedEmoji', emoji); // Save selected emoji to MongoDB
}

function updateMonthEmoji(emoji) {
    const monthEmojis = document.querySelectorAll('.grid-emoji');
    const date = new Date();
    const day = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Set the emoji for the current day
    monthEmojis[day - 1].src = `/assets/img/${emoji}`;
    saveToMongoDB(`emoji_${day}`, emoji); // Save emoji to MongoDB

    // Reset all monthEmojis to the initial image at the end of the month
    if (day === daysInMonth) {
        setTimeout(() => {
            resetMonthEmojis();
            currentEmojiIndex = 0;
            saveToMongoDB('currentEmojiIndex', currentEmojiIndex); // Save currentEmojiIndex to MongoDB
        }, 24 * 60 * 60 * 1000); // Reset at midnight
    } else {
        currentEmojiIndex = day;
        saveToMongoDB('currentEmojiIndex', currentEmojiIndex); // Save currentEmojiIndex to MongoDB
    }
}

function resetMonthEmojis() {
    const monthEmojis = document.querySelectorAll('.grid-emoji');
    monthEmojis.forEach((emoji, index) => {
        emoji.src = '/assets/img/Frame 2.png';
        saveToMongoDB(`emoji_${index + 1}`, 'Frame 2.png'); // Save reset emoji to MongoDB
    });
}

function loadEmojis() {
    const monthEmojis = document.querySelectorAll('.grid-emoji');
    monthEmojis.forEach((emoji, index) => {
        loadFromMongoDB(`emoji_${index + 1}`, (savedEmoji) => {
            if (savedEmoji) {
                emoji.src = `/assets/img/${savedEmoji}`;
            }
        });
    });
}

// Function to set the initial image from MongoDB or a random image
function setInitialImage() {
    const flashCard = document.getElementById('flashCard');
    loadFromMongoDB('flashCardImage', (savedImage) => {
        if (savedImage) {
            flashCard.src = savedImage;
        } else {
            const newImage = getRandomImage();
            flashCard.src = newImage;
            saveToMongoDB('flashCardImage', newImage); // Save new image to MongoDB
        }
    });
}

// Function to update the day and month
function updateDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const fullMonth = date.toLocaleString('default', { month: 'long' });
    document.getElementById('numDay').innerText = day;
    document.getElementById('numMonth').innerText = month;
    loadFromMongoDB('previousMonth', (previousMonth) => {
        if (previousMonth !== fullMonth) {
            resetMonthEmojis();
            saveToMongoDB('previousMonth', fullMonth); // Save new month to MongoDB
        }
    });
    document.getElementById('numMonths').innerText = fullMonth;
}

// Call the function to update the date on page load
window.onload = () => {
    updateDate();
    setInitialImage();
    loadEmojis();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
    updateImageAtInterval(oneDayInMilliseconds);
    setInterval(() => {
        updateDate();
        setInitialImage();
        loadEmojis();
    }, oneDayInMilliseconds);
};

// Array of image paths
const images = [
    'assets/img/Front_Challenge_card.png',
    'assets/img/Front_Challenge_card (1).png',
    'assets/img/Front_Challenge_card (2).png',
    'assets/img/Front_Challenge_card (3).png',
    'assets/img/Front_Challenge_card (4).png',
];

// Function to get a random image from the array
function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

function updateImage() {
    const flashCard = document.getElementById('flashCard');
    const newImage = getRandomImage();
    flashCard.src = newImage;
    saveToMongoDB('flashCardImage', newImage); // Save new image to MongoDB
}

// Function to flip the card
function flipCard() {
    const card = document.getElementById('card');
    card.classList.toggle('flipped');
    updateImage();
}

// Function to update the image at a specified interval
function updateImageAtInterval(interval) {
    setInterval(updateImage, interval);
}

const emojiMessages = {
    'happy_emo.png': ['Keep smiling!', 'You look happy!', 'Stay positive!'],
    'anxi_emo.png': ['Take a deep breath.', 'Everything will be okay.', 'Stay calm.'],
    'ANGRY_emo.png': ['Take it easy.', 'Stay cool.', 'Don’t let anger control you.'],
    'ennui_emo.png': ['Find something fun to do.', 'Stay engaged.', 'Keep your mind active.']
};

document.addEventListener("DOMContentLoaded", function () {
    const passcodeToggle = document.getElementById("passcode-toggle");
    const passcodeModal = document.getElementById("passcode-modal");
    const passcodeInput = document.getElementById("new-passcode");
    const savePasscodeBtn = document.getElementById("save-passcode");
    const cancelPasscodeBtn = document.getElementById("cancel-passcode");
    const deletePasscodeBtn = document.createElement("button");
    deletePasscodeBtn.id = "delete-passcode";
    deletePasscodeBtn.textContent = "Delete Passcode";
  
    // เช็คว่ามีรหัสผ่านใน localStorage หรือไม่
    if (localStorage.getItem("passcode")) {
        passcodeToggle.checked = true;
    } else {
        passcodeToggle.checked = false;
    }
  
    passcodeToggle.addEventListener("change", function () {
        if (this.checked) {
            passcodeModal.style.display = "block";
        } else {
            localStorage.removeItem("passcode");
            localStorage.setItem("passcodeEnabled", "false");
            alert("Passcode ถูกปิดแล้ว");
            passcodeToggle.checked = false;
        }
    });
  
    savePasscodeBtn.addEventListener("click", function () {
        if (passcodeInput.value.length === 4) {
            localStorage.setItem("passcode", passcodeInput.value);
            localStorage.setItem("passcodeEnabled", "true");
            alert("รหัสผ่านถูกบันทึกแล้ว!");
            passcodeModal.style.display = "none";
        } else {
            alert("กรุณากรอกรหัสผ่าน 4 หลัก");
        }
    });
  
    cancelPasscodeBtn.addEventListener("click", function () {
        passcodeModal.style.display = "none";
        passcodeToggle.checked = false;
    });
  
    deletePasscodeBtn.addEventListener("click", function () {
        localStorage.removeItem("passcode");
        localStorage.setItem("passcodeEnabled", "false");
        alert("รหัสผ่านถูกลบแล้ว!");
        passcodeModal.style.display = "none";
        passcodeToggle.checked = false;
    });
  
    document.querySelector(".modal-content").appendChild(deletePasscodeBtn);
  
    // เพิ่มฟังก์ชันให้กดตัวเลขแล้วขึ้นที่หน้าจอ
    const numberButtons = document.querySelectorAll(".number");
    const clearButton = document.getElementById("clear");
  
    numberButtons.forEach(button => {
        button.addEventListener("click", function () {
            if (passcodeInput.value.length < 4) {
                passcodeInput.value += this.dataset.number;
            }
        });
    });
  
    clearButton.addEventListener("click", function () {
        passcodeInput.value = "";
    });
  });
  
  document.addEventListener("DOMContentLoaded", function () {
      const notificationSwitch = document.getElementById("notificationSwitch");
      const notificationForm = document.getElementById("notificationForm");
      const notificationTimeInput = document.getElementById("notificationTime");
      const saveNotificationBtn = document.querySelector("#notificationForm button");
      const notificationAlert = document.getElementById("notificationAlert");
  
      // โหลดค่าที่บันทึกไว้
      if (localStorage.getItem("notificationEnabled") === "true") {
          notificationSwitch.checked = true;
          notificationForm.style.display = "block";
      } else {
          notificationForm.style.display = "none";
      }
  
      if (localStorage.getItem("notificationTime")) {
          notificationTimeInput.value = localStorage.getItem("notificationTime");
      }
  
      // เปิด/ปิดฟอร์มแจ้งเตือน
      notificationSwitch.addEventListener("change", function () {
          if (this.checked) {
              notificationForm.style.display = "block";
              localStorage.setItem("notificationEnabled", "true");
          } else {
              notificationForm.style.display = "none";
              localStorage.setItem("notificationEnabled", "false");
          }
      });
  
      // บันทึกเวลาแจ้งเตือน
      saveNotificationBtn.addEventListener("click", function () {
          const timeValue = notificationTimeInput.value;
          if (timeValue) {
              localStorage.setItem("notificationTime", timeValue);
              notificationAlert.style.display = "block";
              setTimeout(() => {
                  notificationAlert.style.display = "none";
              }, 3000);
          } else {
              alert("กรุณาเลือกเวลาที่ต้องการแจ้งเตือน");
          }
      });
  
      // ฟังก์ชันแจ้งเตือนเมื่อถึงเวลาที่ตั้งไว้
      function checkNotificationTime() {
          const savedTime = localStorage.getItem("notificationTime");
          if (!savedTime) return;
  
          const now = new Date();
          const [savedHour, savedMinute] = savedTime.split(":").map(Number);
  
          if (now.getHours() === savedHour && now.getMinutes() === savedMinute) {
              showNotification();
          }
      }
  
      // ฟังก์ชันแจ้งเตือน (เสียง + การแจ้งเตือน)
      function showNotification() {
      
          // ใช้ Notification API
          if (Notification.permission === "granted") {
              new Notification("⏰ แจ้งเตือน!", { body: "ถึงเวลาที่คุณตั้งค่าไว้แล้ว!" });
          } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                      new Notification("⏰ แจ้งเตือน!", { body: "ถึงเวลาที่คุณตั้งค่าไว้แล้ว!" });
                  }
              });
          }
      }
  
      // ขออนุญาตแจ้งเตือนเมื่อโหลดหน้าเว็บ
      if (Notification.permission !== "granted") {
          Notification.requestPermission();
      }
  
      // ตรวจสอบแจ้งเตือนทุก 30 วินาที
      setInterval(checkNotificationTime, 30000);
  });
  