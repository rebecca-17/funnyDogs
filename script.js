const dogs = [
  { breed: 'shiba', url: 'https://images.dog.ceo/breeds/shiba/shiba-13.jpg' },
  { breed: 'husky', url: 'https://images.dog.ceo/breeds/husky/n02110185_10047.jpg' },
  { breed: 'pug', url: 'https://images.dog.ceo/breeds/pug/n02110958_15721.jpg' },
  { breed: 'retriever', url: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3414.jpg' },
  { breed: 'samoyed', url: 'https://images.dog.ceo/breeds/samoyed/n02111889_5014.jpg' },
  { breed: 'beagle', url: 'https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg' },
  { breed: 'dalmatian', url: 'https://images.dog.ceo/breeds/dalmatian/cooper2.jpg' },
  { breed: 'corgi', url: 'https://images.dog.ceo/breeds/pembroke/n02113023_5776.jpg' },
  { breed: 'chihuahua', url: 'https://images.dog.ceo/breeds/chihuahua/n02085620_4394.jpg' },
  { breed: 'boxer', url: 'https://images.dog.ceo/breeds/boxer/n02108089_11902.jpg' },
  { breed: 'terrier', url: 'https://images.dog.ceo/breeds/terrier-yorkshire/n02094433_2690.jpg' },
  { breed: 'sheepdog', url: 'https://images.dog.ceo/breeds/sheepdog-english/n02105641_11185.jpg' }
];

const hats = ['🎩', '👑', '🧢', '🎓', '⛑️'];
const eyes = ['🕶️', '👀', '🥽', '✨'];
const mouths = ['🍭', '🥕', '🎤', '🦴', '🍔'];

const topTemplates = [
  'WHEN THE {breed} ENTERS THE CHAT',
  'ME TRYING TO LOOK NORMAL',
  'BORN TO BE A SUPERSTAR',
  'POV: YOU SAID "WALK"',
  '{breed} MODE: LEGENDARY'
];

const bottomTemplates = [
  'BUT I BROUGHT A LOLLIPOP',
  'RATE MY DRIP 1-5 ⭐',
  'NO THOUGHTS, ONLY VIBES',
  'I DID THIS FOR THE COMPETITION',
  'SWIPE IF YOU CAN HANDLE THIS ENERGY'
];

const elements = {
  card: document.getElementById('meme-card'),
  image: document.getElementById('dog-image'),
  top: document.getElementById('caption-top'),
  bottom: document.getElementById('caption-bottom'),
  hat: document.getElementById('hat'),
  eyes: document.getElementById('eyes'),
  mouth: document.getElementById('mouth'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  shuffle: document.getElementById('shuffle'),
  auto: document.getElementById('auto'),
  ratingButtons: document.getElementById('rating-buttons'),
  ratingSummary: document.getElementById('rating-summary'),
  leaderboard: document.getElementById('leaderboard')
};

let currentIndex = 0;
let autoSwipeId = null;
let touchStartX = 0;

const ratings = JSON.parse(localStorage.getItem('funnyDogsRatings') || '{}');

function rand(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function captionFrom(template, breed) {
  return template.replace('{breed}', breed.toUpperCase());
}

function currentDog() {
  return dogs[currentIndex];
}

function renderRatingButtons() {
  elements.ratingButtons.innerHTML = '';
  const { url } = currentDog();
  for (let score = 1; score <= 5; score += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '⭐'.repeat(score);
    if (ratings[url] === score) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      ratings[url] = score;
      localStorage.setItem('funnyDogsRatings', JSON.stringify(ratings));
      renderRatingButtons();
      renderRatingSummary();
      renderLeaderboard();
    });
    elements.ratingButtons.appendChild(button);
  }
}

function renderRatingSummary() {
  const values = Object.values(ratings);
  if (!values.length) {
    elements.ratingSummary.textContent = 'No ratings yet.';
    return;
  }
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  elements.ratingSummary.textContent = `Your average rating: ${avg} across ${values.length} meme(s).`;
}

function renderLeaderboard() {
  const ranked = dogs
    .map((dog) => ({ dog, score: ratings[dog.url] || 0 }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  elements.leaderboard.innerHTML = '';
  if (!ranked.length) {
    elements.leaderboard.innerHTML = '<li>Rate a dog to start the leaderboard.</li>';
    return;
  }

  ranked.forEach(({ dog, score }) => {
    const item = document.createElement('li');
    item.textContent = `${dog.breed} — ${'⭐'.repeat(score)}`;
    elements.leaderboard.appendChild(item);
  });
}

function renderCard() {
  const dog = currentDog();
  elements.image.src = dog.url;
  elements.image.alt = `Funny ${dog.breed} dog meme`;
  elements.top.textContent = captionFrom(rand(topTemplates), dog.breed);
  elements.bottom.textContent = captionFrom(rand(bottomTemplates), dog.breed);
  elements.hat.textContent = rand(hats);
  elements.eyes.textContent = rand(eyes);
  elements.mouth.textContent = rand(mouths);
  renderRatingButtons();
  renderRatingSummary();
  renderLeaderboard();
}

function go(step) {
  currentIndex = (currentIndex + step + dogs.length) % dogs.length;
  renderCard();
}

function remixCurrent() {
  renderCard();
}

function toggleAutoSwipe() {
  if (autoSwipeId) {
    clearInterval(autoSwipeId);
    autoSwipeId = null;
    elements.auto.textContent = '▶️ Auto Swipe';
    elements.auto.setAttribute('aria-pressed', 'false');
    return;
  }

  autoSwipeId = setInterval(() => go(1), 2600);
  elements.auto.textContent = '⏸️ Stop Auto';
  elements.auto.setAttribute('aria-pressed', 'true');
}

function wireEvents() {
  elements.prev.addEventListener('click', () => go(-1));
  elements.next.addEventListener('click', () => go(1));
  elements.shuffle.addEventListener('click', remixCurrent);
  elements.auto.addEventListener('click', toggleAutoSwipe);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
    if (event.key.toLowerCase() === 'r') remixCurrent();
  });

  elements.card.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  elements.card.addEventListener('touchend', (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (deltaX > 35) go(-1);
    if (deltaX < -35) go(1);
  });
}

wireEvents();
renderCard();
