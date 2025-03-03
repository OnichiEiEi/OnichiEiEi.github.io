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

document.addEventListener("DOMContentLoaded", function () {
  const inputComment = document.getElementById("inputComment");

  inputComment.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const date = new Date();
      const day = date.getDate();
      saveComment(day, inputComment.value);
      inputComment.value = ""; // Clear the input field
    }
  });
});

function saveComment(day, text) {
  localStorage.setItem(`comment_${day}`, text);
}

function showComment(day) {
    const comment = localStorage.getItem(`comment_${day}`);
    if (comment) {
      const url = `text.html?day=${day}&comment=${encodeURIComponent(comment)}`;
      window.open(url, "_blank");
    } else {
      alert("No comment saved for this day.");
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
}

function updateMonthEmoji(emoji) {
    const monthEmojis = document.querySelectorAll('.grid-emoji');
    const date = new Date();
    const day = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Set the emoji for the current day
    monthEmojis[day - 1].src = `/assets/img/${emoji}`;
    localStorage.setItem(`emoji_${day}`, emoji);

    // Reset all monthEmojis to the initial image at the end of the month
    if (day === daysInMonth) {
        setTimeout(() => {
            resetMonthEmojis();
            currentEmojiIndex = 0;
            localStorage.setItem('currentEmojiIndex', currentEmojiIndex);
        }, 24 * 60 * 60 * 1000); // Reset at midnight
    } else {
        currentEmojiIndex = day;
        localStorage.setItem('currentEmojiIndex', currentEmojiIndex);
    }
}

function resetMonthEmojis() {
    const monthEmojis = document.querySelectorAll('.grid-emoji');
    monthEmojis.forEach((emoji, index) => {
        emoji.src = '/assets/img/Frame 2.png';
        localStorage.removeItem(`emoji_${index + 1}`);
    });
}

function loadEmojis() {
    const monthEmojis = document.querySelectorAll('.grid-emoji');
    monthEmojis.forEach((emoji, index) => {
        const savedEmoji = localStorage.getItem(`emoji_${index + 1}`);
        if (savedEmoji) {
            emoji.src = `/assets/img/${savedEmoji}`;
        }
    });
}

// Array of image paths
const images = [
    '/assets/img/Front_Challenge_card.png',
    '/assets/img/Front_Challenge_card (1).png',
    '/assets/img/Front_Challenge_card (2).png',
    '/assets/img/Front_Challenge_card (3).png',
    '/assets/img/Front_Challenge_card (4).png',
    '/assets/img/Front_Challenge_card (5).png',
    '/assets/img/Front_Challenge_card (6).png',
    '/assets/img/Front_Challenge_card (7).png',
    '/assets/img/Front_Challenge_card (8).png',
    '/assets/img/Front_Challenge_card (9).png',
    '/assets/img/Front_Challenge_card (10).png',
    '/assets/img/Front_Challenge_card (11).png',
    '/assets/img/Front_Challenge_card (12).png',
    '/assets/img/Front_Challenge_card (13).png',
    '/assets/img/Front_Challenge_card (14).png',
    '/assets/img/Front_Challenge_card (15).png',
    '/assets/img/Front_Challenge_card (16).png',
    '/assets/img/Front_Challenge_card (17).png',
    '/assets/img/Front_Challenge_card (18).png',
    '/assets/img/Front_Challenge_card (19).png',
    '/assets/img/Front_Challenge_card (20).png',
    '/assets/img/Front_Challenge_card (21).png',
    '/assets/img/Front_Challenge_card (22).png',
    '/assets/img/Front_Challenge_card (23).png',
    '/assets/img/Front_Challenge_card (24).png',
    '/assets/img/Front_Challenge_card (25).png',
    '/assets/img/Front_Challenge_card (26).png',
    '/assets/img/Front_Challenge_card (27).png',
    '/assets/img/Front_Challenge_card (28).png',
    '/assets/img/Front_Challenge_card (29).png',
    '/assets/img/Front_Challenge_card (30).png',
];

// Function to get a random image from the array
function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

// Function to update the image at a specified interval
function updateImageAtInterval(interval) {
    const flashCard = document.getElementById('flashCard');
    setInterval(() => {
        const newImage = getRandomImage();
        flashCard.src = newImage;
        localStorage.setItem('flashCardImage', newImage);
    }, interval);
}

// Function to set the initial image from localStorage or a random image
function setInitialImage() {
    const flashCard = document.getElementById('flashCard');
    const savedImage = localStorage.getItem('flashCardImage');
    if (savedImage) {
        flashCard.src = savedImage;
    } else {
        const newImage = getRandomImage();
        flashCard.src = newImage;
        localStorage.setItem('flashCardImage', newImage);
    }
}

// Function to update the day and month
function updateDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const fullMonth = date.toLocaleString('default', { month: 'long' });
    document.getElementById('numDay').innerText = day;
    document.getElementById('numMonth').innerText = month;
    const previousMonth = localStorage.getItem('previousMonth');
    if (previousMonth !== fullMonth) {
        resetMonthEmojis();
        localStorage.setItem('previousMonth', fullMonth);
    }
    document.getElementById('numMonths').innerText = fullMonth;
}

// Function to show the splash screen for 5 seconds and then navigate to homePage
function showSplashScreen() {
    document.getElementById("showPage").classList.remove("hidden");
    document.getElementById("homePage").classList.add("hidden");

    setTimeout(() => {
        document.getElementById("showPage").classList.add("hidden");
        document.getElementById("homePage").classList.remove("hidden");
    }, 2000); // 5000 milliseconds = 5 seconds
}

// Call the function to show the splash screen on page load
window.onload = () => {
    showSplashScreen();
    updateDate();
    setInitialImage();
    loadEmojis();
    const oneDayInMilliseconds = 1 * 1 * 10 * 1000; // 24 hours
    updateImageAtInterval(oneDayInMilliseconds);
    setInterval(() => {
        // Update the emoji for the current day
        const currentEmoji = document.getElementById('showEmoji').src.split('/').pop();
        updateMonthEmoji(currentEmoji);
    }, oneDayInMilliseconds);
};

// Function to update the image on the flash card
function updateImage() {
    const flashCard = document.getElementById('flashCard');
    const newImage = getRandomImage();
    flashCard.src = newImage;
    localStorage.setItem('flashCardImage', newImage);
}

// Function to flip the card
function flipCard() {
    const card = document.getElementById('card');
    card.classList.toggle('flipped');
    updateImage();
}

const emojiMessages = {
    'happy_emo.png': [
        "I'm here for you na ja",
        "Stay strong!",
        "You got this!",
        "Keep smiling!"
    ],
    'anxi_emo.png': [
        "It's okay to feel anxious",
        "Take a deep breath",
        "You are not alone",
        "Stay calm"
    ],
    'ANGRY_emo.png': [
        "It's okay to feel angry",
        "Take a moment to cool down",
        "You are in control",
        "Stay composed"
    ],
    'ennui_emo.png': [
        "Feeling bored is normal",
        "Find something fun to do",
        "Stay engaged",
        "Keep exploring"
    ]
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

    // ขออนุญาตแจ้งเตือนเมื่อโหลดหน้าเว็บ
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // ตรวจสอบแจ้งเตือนทุก 30 วินาที
    setInterval(checkNotificationTime, 30000);
});
