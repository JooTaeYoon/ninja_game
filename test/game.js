const hero = document.querySelector('.hero');
const sky = document.querySelector('.game');

const heroBox = {
  positionX: 0,
  speed: 10,
  direction: 1,
  bgPosition: 0,
};

const keyState = {
  ArrowLeft: false,
  ArrowRight: false,
  x: false,
};

const addEvent = () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      keyState[e.key] = true;
      hero.classList.add('hero_run');
    }
    if (e.key === 'x') {
      keyState[e.key] = true;
      arrow();
      hero.classList.add('attack');
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      keyState[e.key] = false;
      hero.classList.remove('hero_run');
    }
    if (e.key === 'x') {
      keyState[e.key] = false;
      hero.classList.remove('attack');
    }
  });
};

const position = () => {
  return {
    left: hero.getBoundingClientRect().left,
    top: hero.getBoundingClientRect().top,
    right: hero.getBoundingClientRect().right,
    bottom: hero.getBoundingClientRect().bottom,
  };
};

const moving = () => {
  position();
  if (keyState.ArrowLeft) {
    heroBox.positionX = Math.max(0, (heroBox.positionX -= heroBox.speed));
    heroBox.direction = -1;
    // heroBox.bgPosition -= heroBox.speed;
  }
  if (keyState.ArrowRight) {
    heroBox.positionX += heroBox.speed;
    heroBox.direction = 1;
    // heroBox.bgPosition += heroBox.speed;
  }

  const result = downloadImg();

  const screenWidth = window.innerWidth; // 뷰포트 가로 거리
  const heroLimit = screenWidth / 10; // 캐릭터가 최대로 이동 할 거리
  if (heroBox.positionX <= heroLimit) {
    // 캐릭터의 이동 거리가 아직 최대거리까지가 아니라면
    hero.style.transform = `translateX(${heroBox.positionX}px) scaleX(${heroBox.direction})`; // 캐릭터를 이동
  } else {
    hero.style.transform = `translateX(${heroLimit}px) scaleX(${heroBox.direction})`; // 캐릭터 이동

    const bgX = (heroBox.positionX - heroLimit) * -1; // 이거 뭐야?
    sky.style.backgroundPosition = `${bgX}px 0px`; // background-position 속성 설명 해줘
  }

  requestAnimationFrame(moving);
};

const downloadImg = () => {
  const image = [
    '../ggang_game/lib/images/ninja_attack.png',
    '../ggang_game/lib/images/ninja_run.png',
  ];
  image.forEach((arr) => {
    const img = new Image();
    img.src = arr;
  });
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

const arrow = () => {
  const heroPos = position();
  const newArrow = document.createElement('div');
  newArrow.className = 'arrow';
  newArrow.style.position = 'absolute';

  // Center the arrow vertically relative to the hero
  newArrow.style.top =
    heroPos.top + hero.offsetHeight / 2 - newArrow.offsetHeight / 2 + 'px';

  const arrowSpeed = 15;
  const fireDirection = heroBox.direction; // Lock in the direction when fired

  // Set initial horizontal position based on hero's direction
  if (fireDirection === 1) {
    // Facing Right
    newArrow.style.left = heroPos.right + 'px';
  } else {
    // Facing Left
    newArrow.style.left = heroPos.left + 'px';
  }

  newArrow.style.transform = `scaleX(${fireDirection})`;
  sky.appendChild(newArrow);

  function moveArrow() {
    const currentLeft = parseFloat(newArrow.style.left);
    const nextLeft = currentLeft + arrowSpeed * fireDirection;
    newArrow.style.left = nextLeft + 'px';
    console.log('remove');
    // Remove the arrow if it goes off-screen
    if (nextLeft > window.innerWidth || nextLeft < -100) {
      // Give some buffer
      newArrow.remove();
    } else {
      requestAnimationFrame(moveArrow);
    }
  }
  requestAnimationFrame(moveArrow);
};

const init = () => {
  addEvent();
  downloadImg();
  moving();
};

init();
