import { Application, Assets, Sprite, Container, Graphics } from 'pixi.js';
import { useEffect, useRef } from 'react';

import cloudImg from "../assets/Graphics/Symbol 3 copy.png";
import pumpContainerImg from "../assets/Graphics/Symbol 320003.png";
import pumpHandleImg from "../assets/Graphics/Symbol 320001.png";
import pumpNozzleImg from "../assets/Graphics/Symbol 320002.png";
import balloonKnotImg from "../assets/Graphics/Symbol 100011.png";

import balloonImage1 from "../assets/Graphics/Symbol 100001.png";
import balloonImage2 from "../assets/Graphics/Symbol 100002.png";
import balloonImage3 from "../assets/Graphics/Symbol 100003.png";
import balloonImage4 from "../assets/Graphics/Symbol 100004.png";
import balloonImage5 from "../assets/Graphics/Symbol 100005.png";
import balloonImage6 from "../assets/Graphics/Symbol 100006.png";
import balloonImage7 from "../assets/Graphics/Symbol 100007.png";
import balloonImage8 from "../assets/Graphics/Symbol 100008.png";
import balloonImage9 from "../assets/Graphics/Symbol 100009.png";
import balloonImage10 from "../assets/Graphics/Symbol 100010.png";

import alphabetImage1 from "../assets/Graphics/Symbol 10001.png";
import alphabetImage2 from "../assets/Graphics/Symbol 10002.png";
import alphabetImage3 from "../assets/Graphics/Symbol 10003.png";
import alphabetImage4 from "../assets/Graphics/Symbol 10004.png";
import alphabetImage5 from "../assets/Graphics/Symbol 10005.png";
import alphabetImage6 from "../assets/Graphics/Symbol 10006.png";
import alphabetImage7 from "../assets/Graphics/Symbol 10007.png";
import alphabetImage8 from "../assets/Graphics/Symbol 10008.png";
import alphabetImage9 from "../assets/Graphics/Symbol 10009.png";
import alphabetImage10 from "../assets/Graphics/Symbol 10010.png";
import alphabetImage11 from "../assets/Graphics/Symbol 10011.png";
import alphabetImage12 from "../assets/Graphics/Symbol 10012.png";
import alphabetImage13 from "../assets/Graphics/Symbol 10013.png";
import alphabetImage14 from "../assets/Graphics/Symbol 10014.png";
import alphabetImage15 from "../assets/Graphics/Symbol 10015.png";
import alphabetImage16 from "../assets/Graphics/Symbol 10016.png";
import alphabetImage17 from "../assets/Graphics/Symbol 10017.png";
import alphabetImage18 from "../assets/Graphics/Symbol 10018.png";
import alphabetImage19 from "../assets/Graphics/Symbol 10019.png";
import alphabetImage20 from "../assets/Graphics/Symbol 10020.png";
import alphabetImage21 from "../assets/Graphics/Symbol 10021.png";
import alphabetImage22 from "../assets/Graphics/Symbol 10022.png";
import alphabetImage23 from "../assets/Graphics/Symbol 10023.png";
import alphabetImage24 from "../assets/Graphics/Symbol 10024.png";
import alphabetImage25 from "../assets/Graphics/Symbol 10025.png";
import alphabetImage26 from "../assets/Graphics/Symbol 10026.png";

import popSoundFile from '../assets/Graphics/pop.mp3';

const balloonImages = [
  balloonImage1,
  balloonImage2,
  balloonImage3,
  balloonImage4,
  balloonImage5,
  balloonImage6,
  balloonImage7,
  balloonImage8,
  balloonImage9,
  balloonImage10,
];

const alphabetImages = [
  alphabetImage1,
  alphabetImage2,
  alphabetImage3,
  alphabetImage4,
  alphabetImage5,
  alphabetImage6,
  alphabetImage7,
  alphabetImage8,
  alphabetImage9,
  alphabetImage10,
  alphabetImage11,
  alphabetImage12,
  alphabetImage13,
  alphabetImage14,
  alphabetImage15,
  alphabetImage16,
  alphabetImage17,
  alphabetImage18,
  alphabetImage19,
  alphabetImage20,
  alphabetImage21,
  alphabetImage22,
  alphabetImage23,
  alphabetImage24,
  alphabetImage25,
  alphabetImage26,
];

const popSound = new Audio('../assets/Graphics/pop-sound.mp3');
popSound.load();

const BalloonGame = () => {
  const gameContainer = useRef(null);
  let app, pump, pumpHandle, pumpNozzle;
  let pumpClicks = 0;
  let alphabetIndex = 0;
  let balloons = [];
  const popSound = new Audio(popSoundFile);

  useEffect(() => {
    async function initGame() {
      app = new Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xfff7cd,
        resizeTo: window,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });

      gameContainer.current.appendChild(app.canvas);

      await Assets.load([
        { alias: 'pumpContainer', src: pumpContainerImg },
        { alias: 'pumpHandle', src: pumpHandleImg },
        { alias: 'pumpNozzle', src: pumpNozzleImg },
        { alias: 'cloud', src: cloudImg },
        { alias: 'balloonKnot', src: balloonKnotImg },
        ...balloonImages.map((img, index) => ({ alias: `balloon${index + 1}`, src: img })),
        ...alphabetImages.map((img, index) => ({ alias: `alphabet${index + 1}`, src: img })),
      ]);

      setup();
    }

    initGame();

    function setup() {
      createBackground();
      createPump();
      app.ticker.add(gameLoop);
    }

    function createBackground() {
      const bg = Sprite.from('cloud');
      bg.width = app.screen.width;
      bg.height = app.screen.height;
      app.stage.addChild(bg);
    }

    function handleResize() {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    function createPump() {
      pump = Sprite.from('pumpContainer');
      pumpHandle = Sprite.from('pumpHandle');
      pumpNozzle = Sprite.from('pumpNozzle');

      pump.scale.set(0.6);
      pumpHandle.scale.set(0.6);
      pumpNozzle.scale.set(0.6);

      pump.position.set(app.screen.width - 145, app.screen.height - 45);
      pumpHandle.position.set(pump.x, pump.y - 60);
      pumpNozzle.position.set(pump.x - 24, pump.y - 66);

      pump.anchor.set(0.5, 0.7);
      pumpHandle.anchor.set(0.5, 1);
      pumpNozzle.anchor.set(1, 0.6);

      pumpHandle.eventMode = 'static';
      pumpHandle.cursor = 'pointer';

      pumpHandle.on('pointerdown', onPumpClick);

      app.stage.addChild(pumpHandle, pump, pumpNozzle);
    }

    function onPumpClick() {
      pumpHandle.y += pumpHandle.height * 0.2 * 0.6;
      pump.scale.y -= 0.06;

      pumpClicks++;
      if (pumpClicks <= 5) {
        if (pumpClicks === 1) {
          createBalloon();
        }
        inflateBalloon();
      }

      if (pumpClicks === 5) {
        releaseBalloon();
        pumpClicks = 0;
      }

      setTimeout(() => {
        pumpHandle.y -= pumpHandle.height * 0.2 * 0.6;
        pump.scale.y += 0.06;
      }, 50);
    }

    function createBalloon() {
      const randomBalloonIndex = Math.floor(Math.random() * balloonImages.length);
      const balloon = Sprite.from(`balloon${randomBalloonIndex + 1}`);
      const alphabet = Sprite.from(`alphabet${alphabetIndex + 1}`);
      const knot = Sprite.from('balloonKnot');

      balloon.scale.set(0.08);
      alphabet.scale.set(0.05);
      knot.scale.set(0.06);

      balloon.anchor.set(0.5, 1);
      alphabet.anchor.set(0.5);
      knot.anchor.set(0.5, 0);

      const container = new Container();
      container.addChild(knot, balloon, alphabet);
      container.position.set(pumpNozzle.x -230, pumpNozzle.y -40);

      app.stage.addChildAt(container, app.stage.getChildIndex(pump));
      app.stage.addChild(pumpNozzle);

      balloons.push({ container, balloon, alphabet, knot });
    }

    function inflateBalloon() {
      const { container, balloon, alphabet, knot } = balloons[balloons.length - 1];
      const newScale = 0.05 * pumpClicks;
      
      balloon.scale.set(newScale, newScale * 1.2);
      alphabet.scale.set(newScale / 2);
      knot.scale.set(newScale);

      alphabet.position.set(0, -balloon.height / 2);

      knot.position.set(0, -balloon.height / 3);
      knot.visible = false;

      container.y = pumpNozzle.y - 115;
    }

    function releaseBalloon() {
      const balloonObj = balloons[balloons.length - 1];
      const { container, balloon, knot } = balloonObj;

      balloon.scale.set(balloon.scale.x, balloon.scale.x);
      knot.visible = true;

      container.vx = -15;
      container.vy = -8;

      container.eventMode = 'static';
      container.cursor = 'pointer';
      container.on('pointerdown', () => popBalloon(balloonObj));

      alphabetIndex = (alphabetIndex + 1) % alphabetImages.length;

      app.ticker.add(() => {
        container.y += Math.sin(app.ticker.lastTime / 500) * 5;
      });
    }

    function popBalloon(balloonObj) {
      const { container, balloon } = balloonObj;
      const particles = [];
      const particleCount = 10;
      const explosionRadius = 100;
      const particleColor = Math.random() * 0xFFFFFF;
    
      for (let i = 0; i < particleCount; i++) {
        const particle = new Graphics();
        particle.beginFill(particleColor);
        particle.drawPolygon([0, 0, -3, 5, 3, 5]);
        particle.endFill();
        particle.x = container.x;
        particle.y = container.y - balloon.height / 2;
        const angle = Math.random() * Math.PI - Math.PI / 2;
        const speed = Math.random() * 10 + 5;
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
        particles.push(particle);
        app.stage.addChild(particle);
      }

      popSound.play();
    
      app.stage.removeChild(container);
      balloons = balloons.filter(b => b !== balloonObj);
    
      const startTime = Date.now();
      const animateParticles = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > 500) {
          particles.forEach(particle => app.stage.removeChild(particle));
          return;
        }
    
        particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.alpha = 1 - (elapsedTime / 500);
          particle.scale.set(1 - (elapsedTime / 500));
        });
    
        requestAnimationFrame(animateParticles);
      };
    
      animateParticles();
    }
    
    function gameLoop(delta) {
      const topBufferZone = 120;
      const sideBufferZone = 50;
    
      balloons.forEach((balloonObj, index) => {
        const { container } = balloonObj;
        if (container.vx && container.vy) {
          container.x += container.vx;
          container.y += container.vy;
    
          container.x = Math.max(sideBufferZone, Math.min(app.screen.width - sideBufferZone, container.x));
          container.y = Math.max(topBufferZone, Math.min(app.screen.height, container.y));
    
          for (let i = index + 1; i < balloons.length; i++) {
            const otherBalloon = balloons[i].container;
            const dx = container.x - otherBalloon.x;
            const dy = container.y - otherBalloon.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = container.width / 2 + otherBalloon.width / 2;
    
            if (distance < minDistance) {

              const angle = Math.atan2(dy, dx);
              const overlap = minDistance - distance;
              container.x += Math.cos(angle) * overlap / 2;
              container.y += Math.sin(angle) * overlap / 2;
              otherBalloon.x -= Math.cos(angle) * overlap / 2;
              otherBalloon.y -= Math.sin(angle) * overlap / 2;
    
              [container.vx, otherBalloon.vx] = [otherBalloon.vx, container.vx];
              [container.vy, otherBalloon.vy] = [otherBalloon.vy, container.vy];
            }
          }
        }
      });
    }
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, []);

  return (
    <div 
      ref={gameContainer} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        overflow: 'hidden' 
      }} 
    />
  );
};

export default BalloonGame;