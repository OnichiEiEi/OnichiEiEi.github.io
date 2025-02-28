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
    document.getElementById("homePage").classList.remove("hidden");
    document.getElementById("homePage").classList.add("visible");
}

function showMood() {
    document.getElementById('emojiOverlay').style.display = 'flex';
}

function closeOverlay() {
    document.getElementById('emojiOverlay').style.display = 'none';
}

function selectEmoji(emoji) {
    document.getElementById('showEmoji').src = `/mbproject/assets/img/${emoji}`;
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
    monthEmojis[day - 1].src = `/mbproject/assets/img/${emoji}`;
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
        emoji.src = '/mbproject/assets/img/Frame 2.png';
        localStorage.removeItem(`emoji_${index + 1}`);
    });
}

function loadEmojis() {
    const monthEmojis = document.querySelectorAll('.grid-emoji');
    monthEmojis.forEach((emoji, index) => {
        const savedEmoji = localStorage.getItem(`emoji_${index + 1}`);
        if (savedEmoji) {
            emoji.src = `/mbproject/assets/img/${savedEmoji}`;
        }
    });
}

// Array of image paths
const images = [
    '/mbproject/assets/img/Rectangle 1.png',
    '/mbproject/assets/img/Rectangle 2.png',
    '/mbproject/assets/img/Rectangle 1.png',
    '/mbproject/assets/img/Rectangle 2.png'
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

// Call the function to update the date on page load
window.onload = () => {
    updateDate();
    setInitialImage();
    loadEmojis();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
    updateImageAtInterval(oneDayInMilliseconds);
    setInterval(() => {
        // Update the emoji for the current day
        const currentEmoji = document.getElementById('showEmoji').src.split('/').pop();
        updateMonthEmoji(currentEmoji);
    }, oneDayInMilliseconds);
};

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