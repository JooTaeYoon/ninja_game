class Hero {
  constructor(el) {
    this.el = document.querySelector(el);
    this.moveX = 0;
    this.moveY = 0;
    this.speed = 11;
    this.direction = 'right';
    this.attackDamage = 1000;
    this.hpProgress = 0;
    this.hpValue = 10000;
    this.defaultHpValue = this.hpValue;
  }

  keyMotion() {
    if (key.keyDown['left']) {
      this.el.classList.add('flip');
      this.el.classList.add('run');

      this.moveX = this.moveX <= 0 ? 0 : this.moveX - this.speed;

      this.direction = 'left';
    } else if (key.keyDown['right']) {
      this.el.classList.add('run');
      this.el.classList.remove('flip');
      this.moveX = this.moveX + this.speed;
      this.direction = 'right';
    }

    /*
1. 키를 누른다
2. y좌표에 speed값을 더해준다
3. 그리고 중력값을 뺀다.
4. 땅에 닿았는지 확인한다.
*/

    if (!key.keyDown['left'] && !key.keyDown['right']) {
      this.el.classList.remove('run');
    }

    if (key.keyDown['attack']) {
      if (!bulletComProp.launch) {
        this.el.classList.add('attack');
        bulletComProp.arr.push(new Bullet());
        bulletComProp.launch = true;
      }
    }
    if (!key.keyDown['attack']) {
      this.el.classList.remove('attack');
      bulletComProp.launch = false;
    }

    this.el.parentNode.style.transform = `translate(${this.moveX}px, ${this.moveY}px)`;
  }

  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    };
  }
  size() {
    return {
      width: this.el.offsetWidth,
      height: this.el.offsetHeight,
    };
  }

  updateHp(damage) {
    this.hpValue = Math.max(0, this.hpValue - damage);
    this.hpProgress = (this.hpValue / this.defaultHpValue) * 100;
    const heroHpBox = document.querySelector('.state_box .hp span');
    heroHpBox.style.width = this.hpProgress + '%';
    this.crash();
    if (this.hpProgress === 0) this.dead();
  }

  crash() {
    this.el.classList.add('crash');
    setTimeout(() => {
      this.el.classList.remove('crash');
    }, 400);
  }

  dead() {
    console.log('dead');
    this.el.classList.remove('crash');
    this.el.classList.add('dead');
    endGame();
  }
}

class Bullet {
  constructor() {
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div');
    this.el.className = 'hero_bullet';
    this.x = 0;
    this.y = 0;
    this.speed = 30;
    this.distance = 0;
    this.bulletDirection = 'right';
    this.init();
  }

  init() {
    this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
    this.x =
      this.bulletDirection === 'right'
        ? hero.moveX + hero.size().width / 2
        : hero.moveX - hero.size().width / 2;
    this.y = hero.position().bottom - hero.size().height / 2;
    this.distance = this.x;

    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;

    this.parentNode.appendChild(this.el);
  }

  moveBullet() {
    let setRotate = '';
    if (this.bulletDirection === 'left') {
      this.distance -= this.speed;
      setRotate = 'rotate(180deg)';
    } else {
      this.distance += this.speed;
    }
    this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
    this.crashBullet();
  }

  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    };
  }

  crashBullet() {
    for (let j = 0; j < allMonsterComProp.arr.length; j++) {
      if (
        this.position().left > allMonsterComProp.arr[j].position().left &&
        this.position().right < allMonsterComProp.arr[j].position().right
      ) {
        this.el.remove();
        for (let i = 0; i < bulletComProp.arr.length; i++) {
          if (bulletComProp.arr[i] === this) {
            bulletComProp.arr.splice(i, 1);
          }
        }
        allMonsterComProp.arr[j].updateHp(j);
        this.damageView(allMonsterComProp.arr[j]);
      }
    }

    if (
      this.position().left > gameProp.screenWidth ||
      this.position().right < 0
    ) {
      this.el.remove();
      for (let i = 0; i < bulletComProp.arr.length; i++) {
        if (bulletComProp.arr[i] === this) {
          bulletComProp.arr.splice(i, 1);
        }
      }
    }
  }

  damageView(monster) {
    this.parentNode = document.querySelector('.game_app');
    this.textDamageNode = document.createElement('div');
    this.textDamageNode.className = 'text_damage';
    this.textDamage = document.createTextNode(hero.attackDamage);
    this.textDamageNode.appendChild(this.textDamage);
    this.parentNode.appendChild(this.textDamageNode);
    let textPosition = Math.random() * -100;
    let damageX = monster.position().left + textPosition;
    let damageY = monster.position().top;

    this.textDamageNode.style.transform = `translate(${damageX}px, ${-damageY}px)`;
    setTimeout(() => {
      this.textDamageNode.remove();
    }, 500);
  }
}

class Monster {
  constructor(positionX, hp) {
    console.log(positionX);
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div');
    this.el.className = 'monster_box ' + positionX.name;
    this.elChildren = document.createElement('div');
    this.elChildren.className = 'monster';
    this.hpNode = document.createElement('div');
    this.hpNode.className = 'hp';
    this.hpValue = positionX.hpValue;
    this.hpInner = document.createElement('span');
    this.positionX = hp;
    this.defaultHpValue = positionX.hpValue;
    this.progress = 0;
    this.moveX = 0;
    this.speed = positionX.speed;
    this.crashDamage = positionX.crashDamage;

    this.init();
  }

  init() {
    this.hpNode.appendChild(this.hpInner);
    this.el.appendChild(this.hpNode);
    this.el.appendChild(this.elChildren);
    this.parentNode.appendChild(this.el);
    this.el.style.left = this.positionX + 'px';
  }

  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    };
  }

  updateHp(j) {
    this.hpValue = Math.max(0, this.hpValue - hero.attackDamage);
    this.progress = (this.hpValue / this.defaultHpValue) * 100;
    this.el.children[0].children[0].style.width = this.progress + '%';

    if (this.hpValue === 0) {
      this.dead(j);
    }
  }

  dead(j) {
    this.el.classList.add('remove');
    console.log('before: ', allMonsterComProp.arr);
    setTimeout(() => {
      this.el.remove();
      allMonsterComProp.arr.splice(j, 1);
      console.log('after: ', allMonsterComProp.arr);
    }, 200);
  }

  moveMonster() {
    if (
      this.moveX +
        this.positionX +
        this.el.offsetWidth +
        hero.position().left -
        hero.moveX <=
      0
    ) {
      this.moveX =
        hero.moveX -
        this.positionX +
        gameProp.screenWidth -
        hero.position().left;
    } else {
      this.moveX -= this.speed;
    }

    this.el.style.transform = `translate(${this.moveX}px)`;

    this.crash();
  }

  crash() {
    let rightDiff = 30;
    let leftDiff = 90;
    if (
      hero.position().right - rightDiff > this.position().left &&
      hero.position().left + leftDiff < this.position().right
    ) {
      hero.updateHp(this.crashDamage);
    }
  }
}
