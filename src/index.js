import plugins from './plugins';
import config  from './config';
import Game from './Game';
import EffectLayer from './game/EffectLayer';
import GameScreen from './game/screen/GameScreen';
import InitScreen from './game/screen/InitScreen';
import ScreenManager from './screenManager/ScreenManager';


PIXI.loader
	.add('./assets/particle1.png')
	.add('./assets/particle2.png')
	.add('./assets/bg1.png')
	.add('./assets/bg2.png')
	.add('./assets/bg3.png')
	.add('./assets/moor.png')
	.load(configGame);

function configGame(){

	var type = window.location.hash.substr(1);
	let game = new Game(config);

	//create screen manager
	let screenManager = new ScreenManager();
	//add screens
	let gameScreen = new GameScreen("GAME");
	let initScreen = new InitScreen("INIT");
	//add effect layer
	let effectLayer = new EffectLayer(screenManager);
	game.stage.addChild(screenManager);

	config.effectsLayer = effectLayer;
	screenManager.addScreen(gameScreen);
	screenManager.addScreen(initScreen);
	//change to init screen
	screenManager.forceChange("GAME");

	game.stage.addChild(effectLayer);

	game.start();
}
