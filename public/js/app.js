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
    let nextButton = document.getElementById('nextPage');  // 버튼의 id가 'nextPage'라고 가정
    if (nextButton) {
        nextButton.addEventListener('click', function(event) {
            event.preventDefault();  // 폼이 제출되지 않도록 방지


            
            let questions = document.querySelectorAll('input[type="radio"]:checked');

            // 선택된 radio 버튼이 6개인지 확인
            if (questions.length !== 6) {
                // 6개가 아닌 경우, 경고 메시지 출력
                alert('모든 문항에 답하세요.');
                return;  // 점수 전송 및 페이지 이동을 하지 않음
            }


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

                let currentPage = window.location.pathname;

                if(currentPage === "/testPage1"){
                    window.location.href = "/testPage2";
                }else if(currentPage === "/testPage2"){
                    window.location.href = "/testPage3"
                }else if(currentPage === "/testPage3"){
                    window.location.href = "/testPage4"
                }else{
                    window.location.href = "/result"
                }

            }).catch(error => {
                console.error('오류 발생:', error);  // 오류 처리
            });
        });
    }
});