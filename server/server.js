const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');
const session = require('express-session');

const DataBase = require('../public/config/DataBase'); // 경로를 정확히 지정

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 'views' 폴더 설정
app.set('views', './views');

app.use(express.static('public')); // CSS, JS, 이미지 같은 정적 파일 제공

app.use(session({
    secret: 'proteinj',  // 세션 암호화 키
    resave: false,
    saveUninitialized: true,
  }));

function decision_mbtiType(EI, SN, TF, JP){
    let mbtiType = '';

    if (EI > 50) {
        mbtiType += 'E';
    } else {
        mbtiType += 'I';
    }
    if (SN > 50) {
        mbtiType += 'S';
    } else {
        mbtiType += 'N';
    }
    if (TF > 50) {
        mbtiType += 'T';
    } else {
        mbtiType += 'F';
    }
    if (JP > 50) {
        mbtiType += 'J';
    } else {
        mbtiType += 'P';
    }

    return mbtiType;
}



app.get('/', (req, res) => {
    res.render('home');
})

app.post('/submit', (req, res) => {
    const { totalScore, pageNumber } = req.body; // 요청에서 전송된 점수 받아오기

    req.session[`totalScorePage${pageNumber}`] = totalScore;

    console.log(`세션 저장 후:`, req.session);

    console.log(`Page ${pageNumber}의 totalScore 저장:`, totalScore);
    res.json({ message: `Page ${pageNumber}의 점수가 세션에 저장되었습니다.` });
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

function iePer(count){
    if(count<0){
        return count / 30 * -100;
    }
    return (count / 30 * 100);
}

app.get('/result', (req, res) => {

    const EI_value = Math.round(iePer(req.session.totalScorePage1));
    const SN_value = Math.round(iePer(req.session.totalScorePage2));
    const TF_value = Math.round(iePer(req.session.totalScorePage3));
    const JP_value = Math.round(iePer(req.session.totalScorePage4));

    const mbtiType = decision_mbtiType(EI_value, SN_value, TF_value, JP_value);
    const category = mbtiType.startsWith("E") ? "E" : "I"; // 유형이 E로 시작하면 "E", 아니면 "I"
    const mbtiData = DataBase[category][mbtiType]; // DataBase에서 해당 유형 데이터 가져오기

    res.render('result', { mbtiType, mbtiData, EI_value, SN_value, TF_value, JP_value});
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})