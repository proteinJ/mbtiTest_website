document.addEventListener('DOMContentLoaded', () => {
    const mbtiCards = document.querySelectorAll('.mbti-type-container');

    mbtiCards.forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        window.location.href = `/resultPage?mbtiType=${type}`;
      });
    });
  });