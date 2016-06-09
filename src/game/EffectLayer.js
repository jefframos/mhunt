import PIXI from 'pixi.js';
import config  from '../config';
import TweenLite from 'gsap';

export default class EffectLayer extends PIXI.Container{
	constructor(screenManager){
		super();

		this.screenManager = screenManager;

		this.grey = new PIXI.Graphics();
		this.grey.beginFill(0X555555);
	    this.grey.drawRect( 0, 0, config.width, config.height);
	    this.grey.alpha = 0;
		this.addChild(this.grey);

		
		//RGB SPLITTER
		this.rgpSplit = new PIXI.filters.RGBSplitFilter();
		this.rgpSplit.red = new PIXI.Point(1,1);
		this.rgpSplit.green = new PIXI.Point(-1,-1);
		this.rgpSplit.blue = new PIXI.Point(1,-1);

		

		//GLITCH 1
		this.glitch1 = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/glicthBugFix.png', 1000, 1000))
		this.addChild(this.glitch1)
		this.glitch1.width = 1000;
		this.glitch1.height = 1000;
		this.displacementFilterGlitch1 = new PIXI.filters.DisplacementFilter(this.glitch1);

		//PIXELATE
		this.pixelate = new PIXI.filters.PixelateFilter()
		this.pixelate.size.x = 32;
		this.pixelate.size.y = 32;


		//BLOOM
		this.bloom = new PIXI.filters.BloomFilter();
		this.bloom.blur = 10;

		//SHOCKWAVE
		this.shockwave = new PIXI.filters.ShockwaveFilter();
		this.shockwave.time = 0;
		this.shockwave.center.x = 0.5;
		this.shockwave.center.y = 0.5;

		this.filtersList = [this.rgpSplit, this.pixelate, this.displacementFilterGlitch1, this.bloom, this.shockwave];
		this.filtersActives = [false, false,false,false, false];

		this.updateFilters();
		
		this.ID_PIXELATE = 1;
		this.ID_RGBSPLIT = 0;
		// this.ID_DISPLACEMENT = 2;
		this.ID_GLITCH1 = 2;
		this.ID_BLOOM = 3;
		this.ID_SHOCKWAVE = 4;

		this.updatePixelate(4,4);

	}
	hideGreyShape(time, delay){
		TweenLite.to(this.grey, time, {alpha:0, delay:delay});
	}
	updateFilters(){
		if(config.isJuicy == 0){
			return;
		}
		var filtersToApply = [];
		for (var i = 0; i < this.filtersList.length; i++) {
			
			if(this.filtersActives[i]){
				filtersToApply.push(this.filtersList[i]);
			}
		};
		console.log(filtersToApply);
		this.screenManager.filters = filtersToApply.length > 0?filtersToApply:null;
	}
	removeBloom(){
		this.filtersActives[this.ID_BLOOM] = false;
		this.updateFilters();
	}
	addBloom(){
		this.filtersActives[this.ID_BLOOM] = true;		
		this.updateFilters();		
	}

	removePixelate(){
		this.filtersActives[this.ID_PIXELATE] = false;
		this.updateFilters();
	}
	addPixelate(){
		this.filtersActives[this.ID_PIXELATE] = true;		
		this.updateFilters();		
	}
	removeRGBSplitter(){
		this.filtersActives[this.ID_RGBSPLIT] = false;
		this.updateFilters();
	}
	addRGBSplitter(){
		this.filtersActives[this.ID_RGBSPLIT] = true;		
		this.updateFilters();		
	}
	updatePixelate(x,y){
		this.pixelate.size.x = x;
		this.pixelate.size.y = y;
	}
	removeShockwave(){
		this.filtersActives[this.ID_SHOCKWAVE] = false;
		this.updateFilters();	
	}
	addShockwave(x,y,time, delay, size, customInitSize){
		if(!delay){
			delay = 0;
		}
		if(!size){
			size =  1;
		}
		if(!customInitSize){
			customInitSize =  0;
		}
		this.filtersActives[this.ID_SHOCKWAVE] = true;
		this.updateFilters();
		this.shockwave.time = customInitSize;
		this.shockwave.center.x = x;
		this.shockwave.center.y = y;
		TweenLite.killTweensOf(this.shockwave);
		TweenLite.to(this.shockwave, time, {delay:delay, time:size, onComplete:this.removeShockwave, onCompleteScope: this});
	}

	fadeBloom(initValue, endValue, time, delay, removeAfter){
		this.addBloom();
		this.bloom.blur = initValue;
		if(removeAfter){
			TweenLite.to(this.bloom, time, {delay:delay, blur:endValue, onComplete:this.removeBloom, onCompleteScope: this});
		}else{
			TweenLite.to(this.bloom, time, {delay:delay, blur:endValue});
		}
	}
	shakeSplitter(force, steps, time, removeAfter){
		this.filtersActives[this.ID_RGBSPLIT] = true;		
		this.updateFilters();		
		if(config.isJuicy == 0){
	      return;
	    }
		if(!force){
			force = 1;
		}
		if(!steps){
			steps = 4;
		}
		if(!time){
			time = 1;
		}
		let timelineSplitRed = new TimelineLite();
		let timelineSplitGreen = new TimelineLite();
		let timelineSplitBlue = new TimelineLite();
		let spliterForce = (force * 20);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelineSplitRed.append(TweenLite.to(this.rgpSplit.red, speed, {x:Math.random() * spliterForce - spliterForce/2, y: Math.random() * spliterForce - spliterForce/2, ease:"easeNoneLinear"}));
			timelineSplitGreen.append(TweenLite.to(this.rgpSplit.green, speed, {x:Math.random() * spliterForce - spliterForce/2, y: Math.random() * spliterForce - spliterForce/2, ease:"easeNoneLinear"}));
			timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, {x:Math.random() * spliterForce - spliterForce/2, y: Math.random() * spliterForce - spliterForce/2, ease:"easeNoneLinear"}));
		};
		timelineSplitRed.append(TweenLite.to(this.rgpSplit.red, speed, {x:1, y:1, ease:"easeNoneLinear"}));
		timelineSplitGreen.append(TweenLite.to(this.rgpSplit.green, speed, {x:-1, y:-1, ease:"easeNoneLinear"}));
		if(removeAfter){
			timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, {x:1, y:-1, ease:"easeNoneLinear", onComplete:this.removeRGBSplitter, onCompleteScope: this}));
		}else{
			timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, {x:1, y:-1, ease:"easeNoneLinear"}));
		}
	}
	shake(force, steps, time){
		if(config.isJuicy == 0){
	      return;
	    }
		if(!force){
			force = 1;
		}
		if(!steps){
			steps = 4;
		}
		if(!time){
			time = 1;
		}
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 50);
		let spliterForce = (force * 20);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.screenManager.position, speed, {x: Math.random() * positionForce - positionForce/2, y: Math.random() * positionForce - positionForce/2, ease:"easeNoneLinear"}));
		};

		timelinePosition.append(TweenLite.to(this.screenManager.position, speed, {x:0, y:0, ease:"easeeaseNoneLinear"}));		
	}

	update(delta){
	}
}
