const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');
const session = require('express-session');

// DB 연결
const DataBase = require('./public/config/DataBase'); 
const DataBase_Q = require('./public/config/DataBase_Q');

app.use(express.json());

// CSS, JS, 이미지 같은 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 'views' 폴더 설정


app.use(session({
    secret: 'proteinj',  // 세션 암호화 키
    resave: false,
    saveUninitialized: true,
  }));

function decision_mbtiType(EI, SN, TF, JP){
    let mbtiType = '';

    if (EI > 0) {
        mbtiType += 'E';
    } else {
        mbtiType += 'I';
    }
    if (SN > 0) {
        mbtiType += 'S';
    } else {
        mbtiType += 'N';
    }
    if (TF > 0) {
        mbtiType += 'T';
    } else {
        mbtiType += 'F';
    }
    if (JP > 0) {
        mbtiType += 'J';
    } else {
        mbtiType += 'P';
    }

    return mbtiType;
}



app.get('/', (req, res) => {
    res.render('home');
})

app.get('/intro', (req, res) => {
    res.render('introPage');
})

app.post('/submit', (req, res) => {
    const { totalScore, pageNumber } = req.body; // 요청에서 전송된 점수 받아오기

    req.session[`totalScorePage${pageNumber}`] = totalScore;

    console.log(`세션 저장 후:`, req.session);

    console.log(`Page ${pageNumber}의 totalScore 저장:`, totalScore);
    res.json({ message: `Page ${pageNumber}의 점수가 세션에 저장되었습니다.` });
})


app.get('/testPage1', (req, res) => {
    res.render('testPage1', { mbtiQuestion: DataBase_Q.questions});
})

app.get('/testPage2', (req, res) => {
    res.render('testPage2', { mbtiQuestion: DataBase_Q.questions});
})

app.get('/testPage3', (req, res) => {
    res.render('testPage3', { mbtiQuestion: DataBase_Q.questions});
})

app.get('/testPage4', (req, res) => {
    res.render('testPage4', { mbtiQuestion: DataBase_Q.questions});
})

app.get('/testP', (req, res) => {
    res.render('testP', { mbtiQuestion: DataBase_Q.questions});
})

function iePer(count){
    if(count<0){
        return (50 + count / 30 * 50);
    }
    return (50 + count / 30 * 50);
}

app.get('/resultPage', (req, res) => {
    const score1 = req.session.totalScorePage1;
    const score2 = req.session.totalScorePage2;
    const score3 = req.session.totalScorePage3;
    const score4 = req.session.totalScorePage4;

    // 모든 점수가 존재할 경우에만 결과 계산
    // if (score1 != null && score2 != null && score3 != null && score4 != null) {
        const EI_value = Math.round(iePer(score1)); 
        const SN_value = Math.round(iePer(score2)); 
        const TF_value = Math.round(iePer(score3)); 
        const JP_value = Math.round(iePer(score4)); 

        const mbtiType = decision_mbtiType(score1, score2, score3, score4);
        const category = mbtiType.startsWith("E") ? "E" : "I";
        const mbtiData = DataBase[category][mbtiType];

        if(!mbtiData){
            return res.status(500).send(`❌ 결과 데이터를 찾을 수 없습니다: ${mbtiType}`);
        }
        

        res.render('resultPage', { 
            mbtiType,
            mbtiData,
            EI_value,
            SN_value,
            TF_value,
            JP_value
         });
    // } else {
    //     // 하나라도 점수가 없으면 에러 메시지
    //     res.status(400).send("⚠️ 모든 테스트를 완료하셔야 결과를 볼 수 있어요!");
    }
// }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})