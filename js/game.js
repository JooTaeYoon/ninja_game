const key = {
  keyDown: {},
  keyValue: {
    37: 'left',
    39: 'right',
    88: 'attack',
    38: 'up',
    32: 'up',
  },
};

const bulletComProp = {
  arr: [],
  launch: false,
};

let hero;
let monster;

const gameBackground = {
  gameBox: document.querySelector('.game'),
};

const renderGame = () => {
  hero.keyMotion();
  setGameBackground();
  bulletComProp.arr.forEach((arr, i) => {
    arr.moveBullet();
  });
  requestAnimationFrame(renderGame);
};

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
};

const setGameBackground = () => {
  let parallaxValue = Math.min(0, (hero.moveX - gameProp.screenWidth / 3) * -1);
  gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
};

const windowEvent = () => {
  window.addEventListener('keydown', (e) => {
    key.keyDown[key.keyValue[e.which]] = true;
  });

  window.addEventListener('keyup', (e) => {
    key.keyDown[key.keyValue[e.which]] = false;
  });

  window.addEventListener('resize', (e) => {
    gameProp.screenWidth = window.innerWidth;
    gameProp.screenHeight = window.innerHeight;
    console.log('바뀜 : ', e);
  });
};

const loadImg = () => {
  const preLoadImgSrc = [
    './ggang_game/lib/images/ninja_attack.png',
    './ggang_game/lib/images/ninja_run.png',
  ];

  preLoadImgSrc.forEach((arr) => {
    const img = new Image();
    img.src = arr;
  });
};

const init = () => {
  hero = new Hero('.hero'); // Hero 객체 생성
  monster = new Monster();
  loadImg(); // 이미지 로드 함수
  renderGame(); // 이미지 render 함수
  windowEvent(); // key 이벤트 함수
};

window.onload = () => {
  console.log('onload !');
  init();
};
