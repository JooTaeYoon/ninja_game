const key = {
  keyDown: {},
  keyValue: {
    37: 'left',
    39: 'right',
    88: 'attack',
  },
};

const bulletComProp = {
  arr: [],
  launch: false,
};

let hero;

const renderGame = () => {
  hero.keyMotion();
  bulletComProp.arr.forEach((arr, i) => {
    arr.moveBullet();
  });
  requestAnimationFrame(renderGame);
};

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
};

const windowEvent = () => {
  window.addEventListener('keydown', (e) => {
    key.keyDown[key.keyValue[e.which]] = true;
  });

  window.addEventListener('keyup', (e) => {
    key.keyDown[key.keyValue[e.which]] = false;
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
  hero = new Hero('.hero');
  loadImg(); // 이미지 로드 함수
  renderGame(); // 이미지 render 함수
  windowEvent(); // key 이벤트 함수
};

window.onload = () => {
  console.log('onload !');
  init();
};
