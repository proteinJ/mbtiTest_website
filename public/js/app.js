document.addEventListener('DOMContentLoaded', function() {
    // 점수 초기화
    let totalScore = 0;

    // 각 질문에 대해 radio 버튼 값의 합을 업데이트하는 함수
    function updateScore() {
        // 모든 선택된 radio 버튼을 가져옴
        let questions = document.querySelectorAll('input[type="radio"]:checked');  // 선택된 모든 radio 버튼을 가져옴
        
        totalScore = 0;  // 점수 초기화

        // 선택된 radio 버튼에 대해 합산
        questions.forEach((radio) => {
            totalScore += parseInt(radio.value);  // radio의 value는 문자열이므로, 숫자로 변환하여 합산
        });

        console.log("현재 총합:", totalScore); // 디버그용으로 콘솔에 출력
    }

    // "Next Page" 버튼 클릭 시 폼 제출 전 점수를 계산
    document.getElementById('aptitudeForm').addEventListener('submit', function(event) {
        event.preventDefault();  // 폼이 제출되지 않도록 방지

        // 점수 업데이트
        updateScore();

        // 점수 출력 (디버그용으로 알림창)
        alert('선택된 점수의 총합은 ' + totalScore + '입니다.');

        // 서버에 점수 전송
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // JSON 형식으로 전송
            },
            body: JSON.stringify({ score: totalScore })  // 점수를 JSON 형식으로 변환하여 전송
        }).then(response => {
            if (response.ok) {
                // 서버로부터 받은 응답 처리
                return response.json();  // 응답을 JSON 형식으로 반환
            } else {
                throw new Error('점수 전송 실패');
            }
        }).then(data => {
            console.log('서버 응답:', data);  // 서버 응답 출력
            // 페이지 이동
            window.location.href = "/testPage2";  // 다른 페이지로 이동
        }).catch(error => {
            console.error('오류 발생:', error);  // 오류 처리
        });
    });
});
