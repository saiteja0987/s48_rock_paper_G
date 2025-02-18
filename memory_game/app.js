document.addEventListener('DOMContentLoaded', () => {
  const cardArray = [
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' },
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' }
  ];

  cardArray.sort(() => 0.5 - Math.random());

  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];

  function createBoard() {
    for (let i = 0; i < cardArray.length; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-id', i);

      const cardInner = document.createElement('div');
      cardInner.classList.add('card-inner');

      const cardFront = document.createElement('div');
      cardFront.classList.add('card-front');
      cardFront.textContent = '?';

      const cardBack = document.createElement('div');
      cardBack.classList.add('card-back');
      const cardImage = document.createElement('img');
      cardImage.setAttribute('src', cardArray[i].img);
      cardBack.appendChild(cardImage);

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);
      card.addEventListener('click', flipCard);
      grid.appendChild(card);
    }
  }

  function flipCard() {
    if (cardsChosenId.length === 2 || this.classList.contains('flipped')) return;

    const cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);

    this.classList.add('flipped');

    if (cardsChosen.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }

  function checkForMatch() {
    const cards = document.querySelectorAll('.card');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (optionOneId === optionTwoId) {
      alert('You clicked the same card!');
      cards[optionOneId].classList.remove('flipped');
    } else if (cardsChosen[0] === cardsChosen[1]) {
      alert('You found a match!');
      cardsWon.push(cardsChosen);
    } else {
      alert('Sorry, try again.');
      cards[optionOneId].classList.remove('flipped');
      cards[optionTwoId].classList.remove('flipped');
    }

    cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;

    if (cardsWon.length === cardArray.length / 2) {
      resultDisplay.textContent = 'Congratulations! You found them all!';
    }
  }

  createBoard();
});