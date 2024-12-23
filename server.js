const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const requestIp = require('request-ip');

const app = express();
const PORT = 3000;
const messagesFilePath = path.join(__dirname, 'messages.json');
const settingsFilePath = path.join(__dirname, 'settings.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use(requestIp.mw());

app.get('/messages', async (req, res) => {
    try {
        const messages = await fs.readJson(messagesFilePath);
        res.json(messages);
    } catch (error) {
        res.status(500).send('Mesajlar yüklenirken hata oluştu');
    }
});

app.post('/messages', async (req, res) => {
    try {
        await fs.writeJson(messagesFilePath, req.body, { spaces: 2 });
        res.status(200).send('Mesajlar kaydedildi');
    } catch (error) {
        res.status(500).send('Mesajlar kaydedilirken hata oluştu');
    }
});

app.get('/settings', async (req, res) => {
    try {
        const settings = await fs.readJson(settingsFilePath);
        const userSettings = settings[req.clientIp] || { userName: "Kullanıcı", userNameColor: "#000" };
        res.json(userSettings);
    } catch (error) {
        res.status(500).send('Ayarlar yüklenirken hata oluştu');
    }
});

app.post('/settings', async (req, res) => {
    try {
        const settings = await fs.readJson(settingsFilePath);
        settings[req.clientIp] = req.body;
        await fs.writeJson(settingsFilePath, settings, { spaces: 2 });
        res.status(200).send('Ayarlar kaydedildi');
    } catch (error) {
        res.status(500).send('Ayarlar kaydedilirken hata oluştu');
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});