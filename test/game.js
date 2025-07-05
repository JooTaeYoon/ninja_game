const hero = document.querySelector('.hero');
const sky = document.querySelector('.game');
let allMonsters = [];
let allArrows = [];

const heroBox = {
  positionX: 0,
  positionY: 0,
  speed: 10,
  direction: 1,
  bgPosition: 0,
  velocityY: 0,
  gravity: 0.5,
  isJumping: false,
};

const keyState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  x: false,
};

const addEvent = () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      keyState[e.key] = true;
      hero.classList.add('hero_run');
    }
    if (e.key === 'ArrowUp' && !heroBox.isJumping) {
      heroBox.isJumping = true;
      heroBox.velocityY = -15; // Initial jump velocity
      hero.classList.add('jump'); // Add jump class for styling
    }
    if (e.key === 'x' && !keyState.x) {
      keyState.x = true;
      console.log('x');
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

  // Jump physics
  if (heroBox.isJumping) {
    heroBox.velocityY += heroBox.gravity;
    heroBox.positionY += heroBox.velocityY;

    // Ground check
    if (heroBox.positionY >= 0) {
      heroBox.positionY = 0;
      heroBox.isJumping = false;
      heroBox.velocityY = 0;
      hero.classList.remove('jump');
    }
  }
  checkCollision();
  const result = downloadImg();

  const screenWidth = window.innerWidth; // 뷰포트 가로 거리
  const heroLimit = screenWidth / 10; // 캐릭터가 최대로 이동 할 거리
  if (heroBox.positionX <= heroLimit) {
    // 캐릭터의 이동 거리가 아직 최대거리까지가 아니라면
    hero.style.transform = `translateX(${heroBox.positionX}px) translateY(${heroBox.positionY}px) scaleX(${heroBox.direction})`; // 캐릭터를 이동
  } else {
    hero.style.transform = `translateX(${heroLimit}px) translateY(${heroBox.positionY}px) scaleX(${heroBox.direction})`; // 캐릭터 이동

    const bgX = (heroBox.positionX - heroLimit) * -1; // 이거 뭐야?
    sky.style.backgroundPosition = `${bgX}px 0px`; // background-position 속성 설명 해줘
  }

  requestAnimationFrame(moving);
};

const checkCollision = () => {
  for (let i = 0; i < allArrows.length; i++) {
    const arrow = allArrows[i];
    const arrowPos = objPosition(arrow);

    for (let j = 0; j < allMonsters.length; j++) {
      const monster = allMonsters[j];
      const monsterPos = objPosition(monster);

      // Check if the arrow intersects with the monster
      if (
        arrowPos.left < monsterPos.right &&
        arrowPos.right > monsterPos.left &&
        arrowPos.top < monsterPos.bottom &&
        arrowPos.bottom > monsterPos.top
      ) {
        // Collision detected, remove both the arrow and the monster
        arrow.remove();
        monster.remove();
        allArrows.splice(i, 1); // Remove the arrow from the array
        allMonsters.splice(j, 1); // Remove the monster from the array
        i--; // Adjust index after removal
        break; // Exit inner loop to avoid checking against removed arrow
      }
    }
  }
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

  // Position the arrow vertically based on the hero's bottom position
  // This prevents the arrow from appearing off-screen during a jump
  const arrowVerticalOffset = -90; // Adjust this value to center the arrow on the hero
  newArrow.style.top = heroPos.top - arrowVerticalOffset + 'px';

  const arrowSpeed = 5;
  const fireDirection = heroBox.direction; // Lock in the direction when fired

  // Set initial horizontal position based on hero's direction
  if (fireDirection === 1) {
    // Facing Right
    newArrow.style.left = heroPos.right + 'px';
  } else {
    // Facing Left
    newArrow.style.left = heroPos.left - 50 + 'px'; // Adjust offset for left-facing arrow
  }
  allArrows.push(newArrow); // Add to the array to track it
  newArrow.style.transform = `scaleX(${fireDirection})`;
  sky.appendChild(newArrow);

  function moveArrow() {
    const currentLeft = parseFloat(newArrow.style.left);
    const nextLeft = currentLeft + arrowSpeed * fireDirection;
    newArrow.style.left = nextLeft + 'px';

    // Remove the arrow if it goes off-screen
    if (nextLeft > window.innerWidth || nextLeft < -100) {
      // Give some buffer
      newArrow.remove();
      allArrows = allArrows.filter((arrow) => arrow !== newArrow); // Remove from array
    } else {
      requestAnimationFrame(moveArrow);
    }
  }
  requestAnimationFrame(moveArrow);
};

const spawnMonster = () => {
  const monster = document.createElement('div');
  monster.className = 'monster';
  monster.style.position = 'absolute';
  monster.style.width = '280px'; // Set width for the monster
  monster.style.height = '294px'; // Set height for the monster
  monster.style.left = window.innerWidth + 'px';
  monster.style.bottom = '-30px'; // Adjust to be on the ground
  sky.appendChild(monster);
  allMonsters.push(monster); // Add to the array to track it

  const monsterSpeed = 3 + Math.random() * 3; // Add some speed variation

  function moveMonster() {
    let currentLeft = parseFloat(monster.style.left);
    monster.style.left = currentLeft - monsterSpeed + 'px';
    const position = objPosition(monster);

    // Remove monster if it's off-screen
    if (currentLeft < -300) {
      // Adjust removal threshold
      monster.remove();
      // Remove from array
      allMonsters = allMonsters.filter((m) => m !== monster);
    } else {
      requestAnimationFrame(moveMonster);
    }
  }
  requestAnimationFrame(moveMonster);
};

const objPosition = (obj) => {
  return {
    left: obj.getBoundingClientRect().left,
    top: obj.getBoundingClientRect().top,
    right: obj.getBoundingClientRect().right,
    bottom: obj.getBoundingClientRect().bottom,
  };
};

const init = () => {
  addEvent();
  downloadImg();
  moving();
  // Spawn a new monster every 2 seconds
  setInterval(spawnMonster, 2000);
};

init();
