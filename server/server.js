const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');


app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 'views' 폴더 설정
app.set('views', './views');

app.use(express.static('public')); // CSS, JS, 이미지 같은 정적 파일 제공






app.get('/', (req, res) => {
    res.render('home');
})

app.post('/submit', (req, res) => {
    const score = req.body.score;  // 요청에서 전송된 점수 받아오기
    console.log('받은 점수:', score);

    // 점수를 저장하거나, 다른 로직을 추가할 수 있음

    // 클라이언트에 응답
    res.status(200).json({
        message : '점수가 성공적으로 처리되었습니다.',
        score : score
    });
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