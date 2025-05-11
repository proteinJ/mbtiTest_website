if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const LOCAL_DEV_COOKIE_SECRET = 'weak_fallback_cookie_scret_key_2243083';
const COOKIE_SECRET_FROM_ENV = process.env.COOKIE_SECRET || LOCAL_DEV_COOKIE_SECRET;
const APP_PORT = process.env.PORT;

const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');
const cookieParser = require('cookie-parser');



// 쿠키 파서 등록
app.use(cookieParser(COOKIE_SECRET_FROM_ENV));

// DB 연결
const DataBase = require('./config/DataBase');
const DataBase_P = require('./config/DateBase_P');
const DataBase_Qtest = require('./config/DataBase_Qtest');

app.use(express.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 'views' 폴더 


function decision_mbtiType(E, S, T, J){
    let mbtiType = '';

    if (E > 3) {
        mbtiType += 'E';
    } else {
        mbtiType += 'I';
    }
    if (S > 3) {
        mbtiType += 'S';
    } else {
        mbtiType += 'N';
    }
    if (T > 3) {
        mbtiType += 'T';
    } else {
        mbtiType += 'F';
    }
    if (J > 3) {
        mbtiType += 'J';
    } else {
        mbtiType += 'P';
    }

    return mbtiType;
}



app.get('/', (req, res) => {
    res.render('home');
})

app.get('/info', (req, res) => {
    res.render('info');
})

app.get('/intro', (req, res) => {
    res.clearCookie('totalScore');
    res.render('introPage');
})

app.post('/submit', (req, res) => {
    const traitScores = req.body;
  
    // 유효성 검사
    if (!traitScores || typeof traitScores !== 'object') {
        console.error('유효하지 않은 점수 데이터 수신:', traitScores);
        return res.status(400).json({ message: '잘못된 점수 데이터 형식입니다.' });
      }
  
    // 쿠키에 저장 (1시간 유지)
    res.cookie('totalScore', JSON.stringify(traitScores), {
    maxAge: 900000, // 15분
    httpOnly: true // JS에서 접근 금지
    });

    return res.json({ redirectTo: '/resultPage' });

  });

app.get('/testP', (req, res) => {         
    res.render('testP', { mbtiQuestion: DataBase_Qtest.questions});
})

function transPercentage(score_value){
    return (score_value / 8) * 100;
}

app.get('/resultList', (req, res) => {
    const mbtiData = [];

    // E, I 구분 없이 모든 MBTI를 하나의 배열로 변환
    Object.values(DataBase).forEach(group => {
        Object.entries(group).forEach(([type, data]) => {
            mbtiData.push({
                type,
                ...data,
                image: data.image
            });
        });
    });

    res.render('resultList', { mbtiData });
});

app.get('/resultPage', (req, res) => {
    const myScores = req.cookies.totalScore ? JSON.parse(req.cookies.totalScore) : null;
    const queryType = req.query.mbtiType;
    
    let mbtiType;
    let EI_value = 0, SN_value = 0, TF_value = 0, JP_value = 0;

    // ✅ 1. 쿼리스트링으로 MBTI 타입이 들어오면 그것을 우선 사용
    if (queryType) {
        mbtiType = queryType.toUpperCase();
    } 
    // ✅ 2. 쿼리스트링이 없을 경우에만 쿠키 기반 계산
    else if (myScores) {
        const scoreE = myScores.E;
        const scoreS = myScores.S;
        const scoreT = myScores.T;
        const scoreJ = myScores.J;

        EI_value = Math.round(transPercentage(scoreE));
        SN_value = Math.round(transPercentage(scoreS));
        TF_value = Math.round(transPercentage(scoreT));
        JP_value = Math.round(transPercentage(scoreJ));

        mbtiType = decision_mbtiType(scoreE, scoreS, scoreT, scoreJ);
    }

    if (!mbtiType) {
        return res.status(400).send("❌ MBTI 타입을 알 수 없습니다. 테스트를 진행하거나, 타입을 전달해주세요.");
    }

    const category = mbtiType.startsWith("E") ? "E" : "I";
    const mbtiData = DataBase[category][mbtiType];

    console.log("쿠키 내용:", req.cookies);
    console.log("myScores:", myScores);

    if(!mbtiData){
        return res.status(500).send(`❌ 결과 데이터를 찾을 수 없습니다: ${mbtiType}`);
    }
    

    res.render('resultPage', { 
        mbtiType,
        mbtiData,
        DataBase_P,
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


app.listen(APP_PORT, () => {
    console.log(`Server running on port ${APP_PORT}`);
})