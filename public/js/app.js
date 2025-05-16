let traitScores = {
  E: 0, I: 0,
  S: 0, N: 0,
  T: 0, F: 0,
  J: 0, P: 0
};

const traitMap = ['EI', 'SN', 'TF', 'JP'];
const userAnswers = Array(28).fill(null); // 각 질문의 선택값 저장
let currentQuestionIndex = 0; // 현재 위치

function updateTraitScore(questionIndex, value, isUndo = false) {
  const traitGroup = Math.floor(questionIndex / 7);
  const direction = parseInt(value);
  const trait = traitMap[traitGroup][direction];

  traitScores[trait] += isUndo ? -1 : 1;

  console.log(`${isUndo ? 'UNDO' : 'Q'}${questionIndex + 1}: ${trait} ${isUndo ? '-1' : '+1'} →`, traitScores);
}

function nextQuestion(questionIndex, value) {
  const newValue = parseInt(value);

  // 선택 저장 및 점수 반영
  userAnswers[questionIndex] = newValue;
  updateTraitScore(questionIndex, newValue);

  // 현재 질문 숨기기
  document.getElementById(`question${questionIndex + 1}`).style.display = 'none';

  if (questionIndex < 27) {
    currentQuestionIndex = questionIndex + 1;
    document.getElementById(`question${currentQuestionIndex + 1}`).style.display = 'block';
  } else {
    document.getElementById(`prev-btn`).style.display = 'none';  
    console.log("submitForm() 제출 완료");
    submitForm();
  }
}

function prevQuestion() {
  if (currentQuestionIndex === 0) return;

  // 현재 질문 숨기기
  document.getElementById(`question${currentQuestionIndex + 1}`).style.display = 'none';

  // 이전 질문으로 이동
  currentQuestionIndex -= 1;
  document.getElementById(`question${currentQuestionIndex + 1}`).style.display = 'block';

  // 기존 선택값이 있으면 점수에서 제거하고, 라디오 선택 해제
  const previousValue = userAnswers[currentQuestionIndex];
  if (previousValue !== null) {
    updateTraitScore(currentQuestionIndex, previousValue, true); // 점수 -1

    // 선택 해제
    const option0 = document.getElementById(`q${currentQuestionIndex}_option0`);
    const option1 = document.getElementById(`q${currentQuestionIndex}_option1`);
    if (option0) option0.checked = false;
    if (option1) option1.checked = false;

    // 선택값 초기화
    userAnswers[currentQuestionIndex] = null;
  }
}

function submitForm() {
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(traitScores),
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

// 라디오 버튼 선택 시 처리
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
}

// 페이지 이동 버튼 처리
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

  const resultRestartBtn = document.getElementById('result-restart-btn');
  if (resultRestartBtn) {
    resultRestartBtn.addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  const allResultBtn = document.getElementById('AllResult-btn');
  if (allResultBtn) {
    allResultBtn.addEventListener('click', () => {
      window.location.href = '/resultList';
    });
  }

  const backBtn = document.getElementById('prev-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      prevQuestion();
    });
  }
});
