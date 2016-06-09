import PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class Moor extends PIXI.Container{
	constructor(){
		super();
		this.radiusScale = 0.8 +  Math.random() * 0.6;
		this.radius = 20 * this.radiusScale;
		this.velocity = {x:0,y:0};
		this.virtualVelocity = {x:0,y:0};
		this.speed= {x:1.5,y:Math.random() * 1};
		if(Math.random() > 0.5){
			this.velocity.x = this.speed.x;
		}else{
			this.velocity.x = -this.speed.x;
		}

		if(Math.random() > 0.5){
			this.velocity.y = this.speed.y;
		}else{
			this.velocity.y = -this.speed.y;
		}

		this.virtualVelocity.x = this.velocity.x;
		this.virtualVelocity.y = this.velocity.y;

		this.acceleration = {x:this.speed.x * 0.05,y: this.speed.x * 0.005};

		this.dying = false;

		this.circle = new PIXI.Graphics();
		this.circle.beginFill(0xFFFFFF * Math.random());
		this.circle.drawCircle(0,0,this.radius);
		// this.addChild(this.circle);

		this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/moor.png'));
		this.sprite.pivot.x = this.sprite.width / 2;
		this.sprite.pivot.y = this.sprite.height / 2;
		this.sprite.scale.set(this.radiusScale);
		this.addChild(this.sprite);

		if(this.velocity.x > 0){
			this.sprite.scale.x = this.radiusScale;
		}else if(this.velocity.x < 0){
			this.sprite.scale.x = -this.radiusScale;
		}
	}
	die(){
		this.dying = true;
		this.virtualVelocity.y = 1;
	}
	update(delta){

		//calcule bounds
		if(!this.dying){
			if(this.position.x > config.width - this.radius && this.virtualVelocity.x > 0 ||
				this.position.x < this.radius && this.virtualVelocity.x < 0){
				this.virtualVelocity.x *= -1;
				if(this.virtualVelocity.x > 0){
					TweenLite.to(this.sprite.scale, 0.5, {x: this.radiusScale, ease:"easeOutBack"});
				}else{
					TweenLite.to(this.sprite.scale, 0.5, {x: -this.radiusScale, ease:"easeOutBack"});
				}
			}

			if(this.position.y > (config.height - 100) - this.radius && this.virtualVelocity.y > 0 ||
				this.position.y < this.radius + 100 && this.virtualVelocity.y < 0){
				this.virtualVelocity.y *= -1;
			}
		}else{
			this.virtualVelocity.y += 0.1;
			this.acceleration.y = 0.1;
			if(this.position.y > config.height){
				this.kill = true;
			}
		}


		//update virtual velocity
		if(this.velocity.x > this.virtualVelocity.x - this.acceleration.x){
			this.velocity.x -= this.acceleration.x;
		}else if(this.velocity.x < this.virtualVelocity.x + this.acceleration.x){
			this.velocity.x += this.acceleration.x;
		}else{
			this.velocity.x = this.virtualVelocity.x;
		}

		if(this.velocity.y > this.virtualVelocity.y - this.acceleration.y){
			this.velocity.y -= this.acceleration.y;
		}else if(this.velocity.y < this.virtualVelocity.y + this.acceleration.y){
			this.velocity.y += this.acceleration.y;
		}else{
			this.velocity.y = this.virtualVelocity.y;
		}


		//apply velocity
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}