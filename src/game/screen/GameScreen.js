import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Moor from '../entity/Moor'

export default class GameScreen extends Screen{
	constructor(label){
		super(label);
	}
	build(){
		super.build();

		//create background shape
		this.background = new PIXI.Graphics();
		this.background.beginFill( 0xFFFFFF );
	    this.background.drawRect( 0, 0, config.width, config.height);
		this.addChild(this.background);

		this.bg3 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/bg3.png'))
		this.addChild(this.bg3)

		this.layer1 = new PIXI.Container();
		this.addChild(this.layer1)

		this.bg2 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/bg2.png'))
		this.addChild(this.bg2)

		this.layer2 = new PIXI.Container();
		this.addChild(this.layer2)

		this.bg1 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/bg1.png'))
		this.addChild(this.bg1)

		this.layer3 = new PIXI.Container();
		this.addChild(this.layer3)

		this.bg1.height = config.height;
		this.bg2.height = config.height;
		this.bg3.height = config.height;

		this.bg1.scale.x = this.bg1.scale.y;
		this.bg2.scale.x = this.bg2.scale.y;
		this.bg3.scale.x = this.bg3.scale.y;

		this.bg2.position.x = -700;
		this.bg1.position.x = -800;
	
		this.bg2.scale.alpha = 0.3;
		this.bg3.scale.alpha = 0.3;

		this.addEvents();

		this.initGame();
	}
	addMoor(){
		let moorTeste = new Moor();
		// moorTeste.position.x = (Math.random() * (config.width - 200)) + 100;
		if(Math.random() < 0.5){
			moorTeste.position.x = config.width + (Math.random() *  200);
		}else{
			moorTeste.position.x = - (Math.random() *  200);
		}
		moorTeste.position.y = (Math.random() * (config.height - 150));
		let layerRnd = Math.random();
		if(layerRnd < 0.25){
			this.layer2.addChild(moorTeste);
		}else if(layerRnd < 0.55){
			this.layer2.addChild(moorTeste);
		}else{
			this.layer3.addChild(moorTeste);
		}
		this.entityList.push(moorTeste);
		this.moorList.push(moorTeste);
	}
	createMoorList(){
		this.moorList = [];
		this.addMoor();
		this.addMoor();
		this.addMoor();
		this.addMoor();
		this.addMoor();
		this.addMoor();
	}
	//EVENTS
	removeEvents(){
		this.off('tap').off('mouseup');
	}
	addEvents(){
		this.interactive = true;
		this.removeEvents();
	    this.on('mouseup', this.onGameClickCallback.bind(this)).on('tap', this.onGameClickCallback.bind(this));	    
	    //this.gameContainer.on('click', this.onGameClickCallback.bind(this)).on('tap', this.onGameClickCallback.bind(this));	    
	}	
	onGameClickCallback(e) {
		let distance = 0;
		let dieCounter = 0;
		let killed = false;
		for (var i = this.moorList.length - 1; i >= 0; i--) {
			distance = (utils.pointDistance(this.moorList[i].position.x, this.moorList[i].position.y, e.data.global.x, e.data.global.y)); 
			if(!killed && distance < this.moorList[i].radius){
				//config.effectsLayer.addShockwave(this.moorList[i].position.x / config.width, this.moorList[i].position.y / config.height, 0.2, 0, 0.02);
				this.moorList[i].die();
				killed = true;
			}
			if(this.moorList[i].dying){
				dieCounter ++;
			}
		}
		if(dieCounter >= this.moorList.length){
			this.createMoorList();
		}
	}
	
	initGame() {
		this.createMoorList();
	}
	
	//destroy game
	destroyGame(){
		this.removeEvents();
	}

	toInit(){
		this.destroyGame();
		this.screenManager.change("INIT");
	}

	//game update
	update(delta){
		super.update(delta);
	}


}
