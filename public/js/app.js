let traitScores = {
  E: 0, I: 0,
  S: 0, N: 0,
  T: 0, F: 0,
  J: 0, P: 0
};

const traitMap = ['EI', 'SN', 'TF', 'JP']; 

function handleAnswer(questionIndex, questionValue) {

  const traitGroup = Math.floor(questionIndex / 7);

  const direction = parseInt(questionValue); // 0 또는 1
  const trait = traitMap[traitGroup][direction]; // 해당 특성 결정
  traitScores[trait] += 1; // 특성 점수 증가

  // 콘솔 로그는 질문 번호 (1-32)로 표시
  console.log(`Q${questionIndex + 1}: ${trait} +1 →`, traitScores);
}

function nextQuestion(questionIndex, value) {

  // 답변 처리 (질문 인덱스와 값 전달)
  handleAnswer(questionIndex, value);

  // 현재 질문 컨테이너 숨기기 (HTML ID: question1 ~ question32)
  // 받은 questionIndex(0-31)에 1을 더해야 실제 HTML ID와 일치
  document.getElementById(`question${questionIndex + 1}`).style.display = 'none';

  if (questionIndex < 27) { 
      // 다음 질문 컨테이너 표시 (HTML ID: question2 ~ question32)
      // 현재 questionIndex에 2를 더해야 다음 질문 ID와 일치
      document.getElementById(`question${questionIndex + 2}`).style.display = 'block';
  } else {
      // 마지막 질문(인덱스 27)까지 완료했으면 폼 제출
      console.log("submitForm()제출 완료")
      submitForm();
  }
}

  


function submitForm() {
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(traitScores),
    // credentials: 'include'
  })  
  .then(response => response.json())
  .then(data => {
    if (data.redirectTo) {
      window.location.href = '/resultPage'; 
    } else {
      console.error('No redirectTo provided in response');
    }
  })
  .catch(error => console.error('Error:', error));
}

// -- radio 선택시 (test질문 버튼) --
const container = document.querySelector('.container-content');
  if (container) {
    container.addEventListener('change', (event) => {
      const target = event.target;
      if (target.matches('input[type="radio"]')) {
        const questionIndex = parseInt(target.dataset.index);
        const value = target.value;
        nextQuestion(questionIndex, value);
      }
    });
  };

// -- btn 선택시 (각 페이지 화면전환 버튼) --
document.addEventListener('DOMContentLoaded', () => {
  const homeNextBtn = document.getElementById('home_next_btn');
  if (homeNextBtn) {
    homeNextBtn.addEventListener('click', () => {
      window.location.href = '/intro';
    });
  }

  const introNextBtn = document.getElementById('intro_next_btn');
  if (introNextBtn) {
    introNextBtn.addEventListener('click', () => {
      window.location.href = '/testP';
    });
  }

  const resultNextBtn = document.getElementById('result_restart_btn');
  if (resultNextBtn) {
    resultNextBtn.addEventListener('click', () => {
      window.location.href = '/';
    });
  }
});