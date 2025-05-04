const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');
const session = require('express-session');

// DB 연결
const DataBase = require('./public/config/DataBase'); 
const DataBase_Q = require('./public/config/DataBase_Q');
const DataBase_Qtest = require('./public/config/DataBase_Qtest');

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

function decision_mbtiType(E, S, T, J){
    let mbtiType = '';

    if (E > 4) {
        mbtiType += 'E';
    } else {
        mbtiType += 'I';
    }
    if (S > 4) {
        mbtiType += 'S';
    } else {
        mbtiType += 'N';
    }
    if (T > 4) {
        mbtiType += 'T';
    } else {
        mbtiType += 'F';
    }
    if (J > 4) {
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
    const traitScores = req.body;
  
    // 유효성 검사
    if (!traitScores || typeof traitScores !== 'object') {
        console.error('유효하지 않은 점수 데이터 수신:', traitScores);
        return res.status(400).json({ message: '잘못된 점수 데이터 형식입니다.' });
      }
    
    console.log('클라이언트로부터 받은 최종 점수:', traitScores);
  
    // 세션에 저장
    req.session.totalScore = traitScores;
  
    console.log('세션에 최종 점수 저장 완료:', req.session.totalScore);
    res.json({ message: '최종 점수가 성공적으로 저장되었습니다.' });
  });


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
    res.render('testP', { mbtiQuestion: DataBase_Qtest.questions});
})

function transPercentage(score_value){
    return (score_value / 8) * 100;
}

app.get('/resultPage', (req, res) => {
    const myScores = req.session.totalScore;

    const scoreE = myScores.E; // 8
    const scoreS = myScores.S;
    const scoreT = myScores.T;
    const scoreJ = myScores.J;

    // 모든 점수가 존재할 경우에만 결과 계산
    // if (score1 != null && score2 != null && score3 != null && score4 != null) {
        const EI_value = Math.round(transPercentage(scoreE)); 
        const SN_value = Math.round(transPercentage(scoreS)); 
        const TF_value = Math.round(transPercentage(scoreT)); 
        const JP_value = Math.round(transPercentage(scoreJ)); 

        const mbtiType = decision_mbtiType(scoreE, scoreS, scoreT, scoreJ);
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
})