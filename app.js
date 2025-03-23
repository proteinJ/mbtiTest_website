const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 'views' 폴더 설정
app.set('views', './views');

app.use(express.static('public')); // CSS, JS, 이미지 같은 정적 파일 제공

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/testPage1', (req, res) => {
    res.render('testPage1');
})

app.get('/testPage2', (req, res) => {
    res.render('testPage2');
})

app.get('/testPage3', (req, res) => {
    res.render('testPage3');
})

app.get('/testPage4', (req, res) => {
    res.render('testPage4');
})

app.get('/result', (req, res) => {
    res.render('result');
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})