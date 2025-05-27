import { Scene } from 'phaser';
import { MathHelpers } from '../../../lib/road-utilities';
import { RenderHelpers } from '../../../lib/road-utilities';
import { appData, scenes } from '../../../app';

//TODO: ROAD NEEDS POTHOLES YOU HAVE TO GO SLOW OVER
//ALSO COPS
//ALSO PSYCHO TRUCKS

export default class Road extends Scene 
{
  renderSettings
  ROAD
  segments
  segmentSprites
  roadWidth
  segmentLength
  rumbleLength
  trackLength
  lanes

  background

  mathHelper
  renderHelper
  
  graphics
  cursors

  playerX
  playerY
  playerZ

  roadConfig

  //jared
  constants
  state
  buffer

  constructor() 
  {
    super({
      key: 'RoadScene'
    });
  }
  
  preload(): void //TODO move this to preload.ts
  {
    this.renderSettings = {
      width: this.sys.game.config.width, // logical canvas width
      height: this.sys.game.config.height, // logical canvas height
      resolution: null, // scaling factor to provide resolution independence (computed)
      fieldOfView: 150, // angle (degrees) for field of view
      cameraHeight: 600, // z height of camera
      cameraDepth: null, // z distance camera is from screen (computed)
      drawDistance: 33, // number of segments to draw
      position: 0, // current camera Z position (add playerZ to get player's absolute Z position)
      fogDensity: 0 // exponential fog density
    }

    this.ROAD = {
      LENGTH: {
        NONE: 0,
        SHORT: 25,
        MEDIUM: 50,
        LONG: 100
      },
      HILL: {
        NONE: 0,
        LOW: 20,
        MEDIUM: 40,
        HIGH: 60
      },
      CURVE: {
        NONE: 0,
        EASY: 2,
        MEDIUM: 4,
        HARD: 6
      }
    }

    this.segments = []; // array of road segments
    this.segmentSprites = [];

    this.roadWidth = 666; // actually half the roads width, easier math if the road spans from -roadWidth to +roadWidth
    this.segmentLength = 333; // length of a single segment
    this.rumbleLength = 2; // number of segments per red/white rumble strip
    this.trackLength = null; // z length of entire track (computed)
    this.lanes = 2; // number of lanes

    this.playerX = .33; // player x offset from center of road (-1 to 1 to stay independent of roadWidth)
    this.playerY = 0;
    this.playerZ = 0; // player relative z distance from camera (computed)

    this.background = this.add.sprite(appState.width / 2, (this.renderSettings.height / 2) - 60, 'bg');
    //this.camera = this.cameras3d.add(90).setPosition(0, -40, 100).setPixelScale(64);

    this.mathHelper = new MathHelpers(this);
    this.renderHelper = new RenderHelpers(this);

    this.constants =
    {
      speeds: [
        -1,
        11,
        22,
        66,
        133
      ]
    }

    this.state = 
    {
      speed: 0,
    }

    this.buffer = 
    {
      lastGear: 0
    }

    this.graphics = this.add.graphics({
      x: 0,
      y: 0
    });
    this.cameras.main.setBackgroundColor(this.renderHelper.COLORS.SKY);

    this.build();
  }

  create(): void 
  {
   
  }

  update(): void 
  {
    this.controller()
    this.view()
    this.debug()

    this.renderSettings.position = this.mathHelper.increase(this.renderSettings.position, 1, this.trackLength)

    this.updateRoad()
  }

  controller(): void
  {
    let paused = !scenes.game.state.playing
    if (paused)
    {
      this.state.speed = 0
      return
    }

    let gear = scenes.marge.state.shifter.gear
    this.state.speed = gear

  }

  model(): void
  {

  }

  view(): void
  {
    
  }

  debug(): void
  {

  }

  build() {
    this.renderSettings.cameraDepth = 1 / Math.tan((this.renderSettings.fieldOfView / 2) * Math.PI / 180);
    this.playerZ = (this.renderSettings.cameraHeight * this.renderSettings.cameraDepth);
    this.renderSettings.resolution = this.renderSettings.height / (this.renderSettings.height / 2);
    if (this.segments.length == 0) {
      this.buildRoad(); // only build road when necessary
    }
  }

  buildDefaultRoad()
  {
    this.segments = [];

    this.addStraight(this.ROAD.LENGTH.SHORT / 2);
    this.addCurve(this.ROAD.LENGTH.MEDIUM, this.ROAD.CURVE.MEDIUM, this.ROAD.HILL.LOW);
    this.addCurve(this.ROAD.LENGTH.MEDIUM, this.ROAD.CURVE.MEDIUM, this.ROAD.HILL.LOW);
    this.addCurve(this.ROAD.LENGTH.MEDIUM, this.ROAD.CURVE.MEDIUM, this.ROAD.HILL.LOW);
    this.addCurve(this.ROAD.LENGTH.MEDIUM, this.ROAD.CURVE.MEDIUM, this.ROAD.HILL.LOW);
    this.addHill(this.ROAD.LENGTH.SHORT, this.ROAD.HILL.LOW);
    this.addLowRollingHills();
    this.addLowRollingHills();
    this.addCurve(this.ROAD.LENGTH.LONG, this.ROAD.CURVE.MEDIUM, this.ROAD.HILL.MEDIUM);
    this.addStraight();
    this.addCurve(this.ROAD.LENGTH.LONG, -this.ROAD.CURVE.MEDIUM, this.ROAD.HILL.MEDIUM);
    this.addHill(this.ROAD.LENGTH.LONG, this.ROAD.HILL.HIGH);
    this.addCurve(this.ROAD.LENGTH.LONG, this.ROAD.CURVE.MEDIUM, -this.ROAD.HILL.LOW);
    this.addHill(this.ROAD.LENGTH.LONG, -this.ROAD.HILL.MEDIUM);
    this.addStraight();
    this.addDownhillToEnd();

    this.segments[this.findSegment(this.playerZ).index + 2].color = this.renderHelper.COLORS.START;
    this.segments[this.findSegment(this.playerZ).index + 3].color = this.renderHelper.COLORS.START;

    for (let n = 0; n < this.rumbleLength; n++) {
      this.segments[this.segments.length - 1 - n].color = this.renderHelper.COLORS.FINISH;
    }

    this.trackLength = this.segments.length * this.segmentLength;
    this.buildSprites();
  }

  buildRoad() 
  {
    this.segments = [];

    for (let i = 0; i < 19; i++)
    {
      this.addHill(this.ROAD.LENGTH.SHORT, this.ROAD.HILL.MEDIUM);
    }

    this.segments[this.findSegment(this.playerZ).index + 2].color = this.renderHelper.COLORS.START;
    this.segments[this.findSegment(this.playerZ).index + 3].color = this.renderHelper.COLORS.START;

    for (let n = 0; n < this.rumbleLength; n++) {
      this.segments[this.segments.length - 1 - n].color = this.renderHelper.COLORS.FINISH;
    }

    this.trackLength = this.segments.length * this.segmentLength;
    //this.buildSprites();
  }

  updateRoad() 
  {
    this.graphics.clear();

    let baseSegment = this.findSegment(this.renderSettings.position);

    let basePercent = this.mathHelper.percentRemaining(this.renderSettings.position, this.segmentLength);
    let playerSegment = this.findSegment(this.renderSettings.position + this.playerZ);
    let playerPercent = this.mathHelper.percentRemaining(this.renderSettings.position + this.playerZ, this.segmentLength);
    this.playerY = this.mathHelper.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);

    let maxy = this.renderSettings.height;
    let x = 0;
    let dx = -(baseSegment.curve * basePercent);
    let n, segment;

    this.renderSettings.position = this.mathHelper.increase(this.renderSettings.position, this.constants.speeds[this.state.speed], this.trackLength);

    for (n = 0; n < this.renderSettings.drawDistance; n++) {
      segment = this.segments[(baseSegment.index + n) % this.segments.length];
      segment.looped = segment.index < baseSegment.index;
      segment.fog = this.mathHelper.exponentialFog(n / this.renderSettings.drawDistance, this.renderSettings.fogDensity);
      segment.clip = maxy;

      this.mathHelper.project(segment.p1, (this.playerX * this.roadWidth) - x, this.playerY + this.renderSettings.cameraHeight, this.renderSettings.position - (segment.looped ? this.trackLength : 0), this.renderSettings.cameraDepth, this.renderSettings.width, this.renderSettings.height, this.roadWidth);
      this.mathHelper.project(segment.p2, (this.playerX * this.roadWidth) - x - dx, this.playerY + this.renderSettings.cameraHeight, this.renderSettings.position - (segment.looped ? this.trackLength : 0), this.renderSettings.cameraDepth, this.renderSettings.width, this.renderSettings.height, this.roadWidth);

      x = x + dx;
      dx = dx + segment.curve;

      if (segment.sprites.length) {
        for (let i = 0; i < segment.sprites.length; i++) {
          let spriteScale = segment.p1.screen.scale;
          let spriteX = segment.p1.screen.x + (spriteScale * segment.sprites[i].offset * this.roadWidth * this.renderSettings.width / 2);
          let spriteY = segment.p1.screen.y;

          if (segment.p2.screen.y <= maxy) // clip by (already rendered) segment
          {
            segment.sprites[i].spriteRef.setPosition(spriteX, spriteY);
            segment.sprites[i].spriteRef.setScale((spriteScale * 2000));
            segment.sprites[i].spriteRef.setVisible(true);
          } else {
            segment.sprites[i].spriteRef.setVisible(false);
          }
        }
      }

      if ((segment.p1.camera.z <= this.renderSettings.cameraDepth) || // behind us
        (segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
        (segment.p2.screen.y >= maxy)) // clip by (already rendered) segment
        continue;

      this.renderHelper.renderSegment(this.renderSettings.width, this.lanes,
        segment.p1.screen.x,
        segment.p1.screen.y,
        segment.p1.screen.w,
        segment.p2.screen.x,
        segment.p2.screen.y,
        segment.p2.screen.w,
        segment.fog,
        segment.color);
      maxy = segment.p2.screen.y;
    }
  }

  buildSprites()
  {
    
  }
  
  buildDefaultSprites() {
    this.addSegmentSprite(720, 'billboard', 1);
    this.addSegmentSprite(620, 'billboard', 1);
    this.addSegmentSprite(520, 'billboard', 1);

    this.addSegmentSprite(60, 'car', -1);
    this.addSegmentSprite(40, 'billboard', 1);
    this.addSegmentSprite(40, 'billboard', -1);
    this.addSegmentSprite(20, 'car', -1);
    this.addSegmentSprite(10, 'car', -1);
    this.addSegmentSprite(5, 'billboard', 1);
    this.addSegmentSprite(5, 'billboard', -1);
  }

  findSegment(z) {
    return this.segments[Math.floor(z / this.segmentLength) % this.segments.length];
  }

  lastY() {
    return (this.segments.length == 0) ? 0 : this.segments[this.segments.length - 1].p2.world.y;
  }

  addSegmentSprite(index, spriteKey, offset) {
    let sprite = this.add.sprite(0, 0, spriteKey);

    this.segments[index].sprites.push({
      key: spriteKey,
      offset: offset,
      spriteRef: sprite
    });
    sprite.setVisible(false);
  }

  addSegment(curve, y) {
    let n = this.segments.length;
    this.segments.push({
      index: n,
      p1: {
        world: {
          y: this.lastY(),
          z: n * this.segmentLength
        },
        camera: {},
        screen: {}
      },
      p2: {
        world: {
          y: y,
          z: (n + 1) * this.segmentLength
        },
        camera: {},
        screen: {}
      },
      sprites: [],
      cars: [],
      curve: curve,
      color: Math.floor(n / this.rumbleLength) % 2 ? this.renderHelper.COLORS.DARK : this.renderHelper.COLORS.LIGHT
    });
  }

  addRoad(enter, hold, leave, curve, y) {
    let startY = this.lastY();
    let endY = startY + (this.mathHelper.toInt(y, 0) * this.segmentLength);
    let n, total = enter + hold + leave;
    for (n = 0; n < enter; n++)
      this.addSegment(this.mathHelper.easeIn(0, curve, n / enter), this.mathHelper.easeInOut(startY, endY, n / total));
    for (n = 0; n < hold; n++)
      this.addSegment(curve, this.mathHelper.easeInOut(startY, endY, (enter + n) / total));
    for (n = 0; n < leave; n++)
      this.addSegment(this.mathHelper.easeInOut(curve, 0, n / leave), this.mathHelper.easeInOut(startY, endY, (enter + hold + n) / total));
  }

  addStraight(num = this.ROAD.LENGTH.MEDIUM) {
    this.addRoad(num, num, num, 0, 0);
  }

  addHill(num = this.ROAD.LENGTH.MEDIUM, height = this.ROAD.HILL.MEDIUM) {
    this.addRoad(num, num, num, 0, height);
  }
  
  addCurve(num = this.ROAD.LENGTH.MEDIUM, curve = this.ROAD.CURVE.MEDIUM, height = this.ROAD.HILL.NONE) {
    this.addRoad(num, num, num, curve, height);
  }

  addLowRollingHills(num = this.ROAD.LENGTH.SHORT, height = this.ROAD.HILL.LOW) {
    this.addRoad(num, num, num, 0, height / 2);
    this.addRoad(num, num, num, 0, -height);
    this.addRoad(num, num, num, 0, height);
    this.addRoad(num, num, num, 0, 0);
    this.addRoad(num, num, num, 0, height / 2);
    this.addRoad(num, num, num, 0, 0);
  }
  addSCurves() {
    this.addRoad(this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, -this.ROAD.CURVE.EASY, this.ROAD.HILL.NONE);
    this.addRoad(this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, this.ROAD.CURVE.MEDIUM, this.ROAD.HILL.MEDIUM);
    this.addRoad(this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, this.ROAD.CURVE.EASY, -this.ROAD.HILL.LOW);
    this.addRoad(this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, -this.ROAD.CURVE.EASY, this.ROAD.HILL.MEDIUM);
    this.addRoad(this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, this.ROAD.LENGTH.MEDIUM, -this.ROAD.CURVE.MEDIUM, -this.ROAD.HILL.MEDIUM);
  }

  addDownhillToEnd(num = 200) {
    this.addRoad(num, num, num, -this.ROAD.CURVE.EASY, -this.lastY() / this.segmentLength);
  }
}