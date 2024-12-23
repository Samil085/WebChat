let userName = "Kullanıcı";
let userNameColor = "#000"; // Varsayılan isim rengi siyah
let messageColor = "#fff"; // Varsayılan mesaj rengi beyaz

const emojiBtn = document.getElementById('emojiBtn');
const emojiPanel = document.getElementById('emojiPanel');
const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const changeNameBtn = document.getElementById('changeName');
const confirmNameBtn = document.getElementById('confirmName');
const nameInputDiv = document.getElementById('nameInput');
const newNameInput = document.getElementById('newName');
const changeNameColorBtn = document.getElementById('changeNameColor');
const confirmNameColorBtn = document.getElementById('confirmNameColor');
const nameColorPickerDiv = document.getElementById('nameColorPicker');
const newNameColorInput = document.getElementById('newNameColor');

// Başlangıçta renk seçme ve isim değiştirme kısımlarını gizle
nameInputDiv.style.display = 'none';
nameColorPickerDiv.style.display = 'none';

// Kullanıcı ayarlarını yükleme
async function loadSettings() {
    try {
        const response = await fetch('/settings');
        const settings = await response.json();
        userName = settings.userName;
        userNameColor = settings.userNameColor;
    } catch (error) {
        console.error('Ayarlar yüklenirken hata oluştu:', error);
    }
}

// Kullanıcı ayarlarını kaydetme
async function saveSettings() {
    try {
        const settings = { userName, userNameColor };
        await fetch('/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings, null, 2)
        });
    } catch (error) {
        console.error('Ayarlar kaydedilirken hata oluştu:', error);
    }
}

// Mesajları yükleme
async function loadMessages() {
    try {
        const response = await fetch('/messages');
        const messages = await response.json();
        messages.forEach(message => {
            displayMessage(message.userName, message.userNameColor, message.text);
        });
    } catch (error) {
        console.error('Mesajlar yüklenirken hata oluştu:', error);
    }
}

// Mesajları kaydetme
async function saveMessages(messages) {
    try {
        await fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messages, null, 2) // JSON'u biçimlendirilmiş şekilde kaydet
        });
    } catch (error) {
        console.error('Mesajlar kaydedilirken hata oluştu:', error);
    }
}

// Mesajları gösterme
function displayMessage(userName, userNameColor, text) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.style.color = messageColor;
    messageElement.innerHTML = `<span style="color: ${userNameColor}">${userName}</span>: ${text}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Mesaj gönderme fonksiyonu
async function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText) {
        displayMessage(userName, userNameColor, messageText);
        const messages = Array.from(messagesDiv.children).map(message => ({
            userName: message.querySelector('span').textContent,
            userNameColor: message.querySelector('span').style.color,
            text: message.textContent.split(': ')[1]
        }));
        await saveMessages(messages);
        messageInput.value = '';
    }
}

// Emoji panelini aç/kapat
emojiBtn.addEventListener('click', function () {
    emojiPanel.style.display = emojiPanel.style.display === 'flex' ? 'none' : 'flex';
});

// Emoji ekleme
emojiPanel.addEventListener('click', function (event) {
    if (event.target.classList.contains('emoji-btn')) {
        const emoji = event.target.textContent;
        messageInput.value += emoji;
    }
});

// Mesaj gönderme butonuna tıklama
document.getElementById('sendBtn').addEventListener('click', sendMessage);

// Enter tuşuna basıldığında mesaj gönderme
messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// İsim değiştirme aç
changeNameBtn.addEventListener('click', function () {
    nameInputDiv.style.display = 'flex';
});

// İsim değiştirme tamam
function confirmNameChange() {
    const newName = newNameInput.value.trim();
    if (newName) {
        userName = newName;
        nameInputDiv.style.display = 'none';
        newNameInput.value = '';
        saveSettings();
    }
}

confirmNameBtn.addEventListener('click', confirmNameChange);
newNameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        confirmNameChange();
    }
});

// İsim rengi değiştirme aç
changeNameColorBtn.addEventListener('click', function () {
    nameColorPickerDiv.style.display = 'flex';
});

// İsim rengi değiştirme tamam
function confirmNameColorChange() {
    const newNameColor = newNameColorInput.value;
    if (newNameColor) {
        userNameColor = newNameColor;
        nameColorPickerDiv.style.display = 'none';
        saveSettings();
    }
}

confirmNameColorBtn.addEventListener('click', confirmNameColorChange);
newNameColorInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        confirmNameColorChange();
    }
});

// Sayfa yüklendiğinde mesajları ve ayarları yükle
window.addEventListener('load', () => {
    loadMessages();
    loadSettings();
});