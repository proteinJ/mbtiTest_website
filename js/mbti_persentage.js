document.addEventListener('DOMContentLoaded', function() {
    // 임시 데이터 (실제로는 테스트 결과를 받아와야 함)
    const mbtiPercentages = {
        'E': 60, // E 비율
        'S': 40, // S 비율
        'T': 70, // T 비율
        'J': 55  // J 비율
    };

    updatePercentageBar('E', mbtiPercentages['E']);
    updatePercentageBar('S', mbtiPercentages['S']);
    updatePercentageBar('T', mbtiPercentages['T']);
    updatePercentageBar('J', mbtiPercentages['J']);
    updatePercentageBar('P', 100 - mbtiPercentages['J']);
});

function updatePercentageBar(type, percentage) {
    const fillElement = document.getElementById(`${type}-fill`);
    const percentageElement = document.getElementById(`${type}-percentage`);

    fillElement.style.width = `${percentage}%`;
    percentageElement.textContent = `${percentage}%`;
}
