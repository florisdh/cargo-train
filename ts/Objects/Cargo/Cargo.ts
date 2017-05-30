module ExamAssignmentMA {
    /**
     * The cargo to be displayed on the platorm.
     */
    export class Cargo extends Phaser.Group {

        private static readonly frameWidth: number = 150;
        private static readonly frameHeight: number = 138;

        public dropped: Phaser.Signal;
        public removed: Phaser.Signal;
        public dragUpdate: Phaser.Signal;
        private anim: PhaserSpine.Spine;
        private hitBox: Phaser.Image;
        private isDragging: boolean;
        private releasePoint: Phaser.Point;
        private cargo: CargoTypes;
        private moveBackTween: Phaser.Tween;
        private moveBackNormal: number;
        private fadeTween: Phaser.Tween;
        private fadeNormal: number;
        private fadeTarget: Wagon;
        private particleEmitter: Phaser.Particles.Arcade.Emitter;
        private pickup: Phaser.Sound;
        private drop: Phaser.Sound;

        /**
         * @param game The active game instance to be added to.
         * @param type The type of cargo to be displayed.
         */
        constructor(game: Phaser.Game, type: CargoTypes) {
            let imageName: string = null;
            switch (type) {
                case CargoTypes.CircleRed:
                    imageName = Spines.RedCircle;
                    break;
                case CargoTypes.CircleYellow:
                    imageName = Spines.YellowCircle;
                    break;
                case CargoTypes.CircleBlue:
                    imageName = Spines.BlueCircle;
                    break;
                case CargoTypes.CubeRed:
                    imageName = Spines.RedCube;
                    break;
                case CargoTypes.CubeYellow:
                    imageName = Spines.YellowCube;
                    break;
                case CargoTypes.CubeBlue:
                    imageName = Spines.BlueCube;
                    break;
                case CargoTypes.TriangleRed:
                    imageName = Spines.RedTriangle;
                    break;
                case CargoTypes.TriangleYellow:
                    imageName = Spines.YellowTriangle;
                    break;
                case CargoTypes.TriangleBlue:
                    imageName = Spines.BlueTriangle;
                    break;
                default:
                    break;
            }
            super(game);
            this.cargo = type;
            this.anim = (<PhaserSpine.SpineGame>this.game).add.spine(0, 0, imageName);
            this.add(this.anim);
            this.dropped = new Phaser.Signal();
            this.removed = new Phaser.Signal();
            this.dragUpdate = new Phaser.Signal();
            this.hitBox = this.game.add.image(0, 0, Images.WhitePixel, null, this);
            this.hitBox.alpha = 0;
            this.hitBox.anchor.setTo(0.5);
            this.hitBox.inputEnabled = true;
            this.hitBox.input.enableDrag(false, true);
            this.hitBox.events.onDragStart.add(this.onDragStart, this);
            this.hitBox.events.onDragStop.add(this.onDragStop, this);
            this.hitBox.events.onDragUpdate.add(this.onDragUpdate, this);
            this.isDragging = false;
            this.releasePoint = null;
            this.moveBackNormal = 0;
            this.moveBackTween = null;
            this.fadeNormal = 0;
            this.fadeTween = null;
            this.fadeTarget = null;
            this.pickup = this.game.add.sound(Sounds.PickedupCargo, 1, false);
            this.drop = this.game.add.sound(Sounds.DroppedCargo, 1, false);

            this.anim.position = this.hitBox.position;
            this.game.time.events.add(this.game.rnd.integerInRange(0, 500), () => {
                this.anim.setAnimationByName(0, 'idle', true);
            });
        }

        /**
         * Properly disposes all cargo dependencies.
         */
        public destroy(): void {
            this.anim.destroy(true);
            if (this.moveBackTween) {
                this.moveBackTween.stop();
            }
            this.hitBox.input.disableDrag();
            super.destroy(true);
        }

        /**
         * Transitions the cargo to the target wagon and invisible.
         * @param target The target wagon to be moved to.
         */
        public fadeOut(target: Wagon): void {
            this.fadeTarget = target;
            if (this.fadeTween && this.fadeTween.isRunning) {
                this.fadeTween.stop();
            }
            this.releasePoint = this.position.clone();
            this.fadeAnim = 0;
            this.fadeTween = this.game.add.tween(this).to({ fadeAnim: 1 }, 300, Phaser.Easing.Quadratic.In, true);
            this.fadeTween.onComplete.addOnce(this.fadeDone, this);

            if (this.particleEmitter) {
                this.particleEmitter.destroy(true);
            }
            this.particleEmitter = this.game.add.emitter(0, 0, 50);
            this.particleEmitter.enableBody = false;
            this.particleEmitter.autoAlpha = true;
            this.particleEmitter.x = this.worldPosition.x;
            this.particleEmitter.y = this.worldPosition.y;
            this.particleEmitter.minParticleScale = 0.5;
            this.particleEmitter.maxParticleScale = 1;
            this.particleEmitter.makeParticles(Images.ParticleStar);
            this.particleEmitter.setAlpha(1.0, 0.0, 1500, Phaser.Easing.Linear.None);
            this.particleEmitter.start(true, 1500, null, this.game.rnd.integerInRange(3, 7));
            this.game.time.events.add(1500, () => {
                if (this.particleEmitter) {
                    this.particleEmitter.destroy(true);
                }
            });

            this.anim.setAnimationByName(0, 'idle', true);
        }

        private fadeDone(): void {
            this.removed.dispatch(this);
            this.destroy();
        }

        private onDragStart(e: Cargo): void {
            if (this.moveBackTween && this.moveBackTween.isRunning) {
                this.moveBackTween.stop();
            }
            this.isDragging = true;
            this.anim.setAnimationByName(0, 'pickUp', true);
            this.pickup.play();
        }

        private onDragStop(e: Cargo): void {
            this.hitBox.inputEnabled = false;
            this.dropped.dispatch(this);
            this.isDragging = false;
        }

        private onDragUpdate(): void {
            this.dragUpdate.dispatch(this);
        }

        /**
         * Moves the cargo back to the position in the grid.
         */
        public moveBack(): void {
            if (this.moveBackTween && this.moveBackTween.isRunning) {
                this.moveBackTween.stop();
            }
            this.releasePoint = this.hitBox.position.clone();
            this.moveBackAnim = 1;
            this.moveBackTween = this.game.add.tween(this).to({ moveBackAnim: 0 }, 300, Phaser.Easing.Quadratic.In, true);
            this.moveBackTween.onComplete.addOnce(() => {
                this.hitBox.inputEnabled = true;
                this.drop.play();
            });
            this.anim.setAnimationByName(0, 'land');
            this.anim.addAnimationByName(0, 'idle', true);
        }

        /**
         * Scales and moves the cargo based on the given variables from the grid.
         * @param x The centerX position in the grid.
         * @param y The centerY position in the grid.
         * @param width The desired width of the cargo in the grid.
         * @param height The desired height of the cargo in the grid.
         */
        public resize(x: number, y: number, width: number, height: number): void {
            if (!this.isDragging && (this.moveBackTween === null || !this.moveBackTween.isRunning)) {
                this.x = x;
                this.y = y;
            }
            this.hitBox.width = width;
            this.hitBox.height = height;

            if (width / Cargo.frameWidth * Cargo.frameHeight > height) {
                this.anim.scale.setTo(height / Cargo.frameHeight);
            } else {
                this.anim.scale.setTo(width / Cargo.frameWidth);
            }
        }

        private get moveBackAnim(): number {
            return this.moveBackNormal;
        }

        private set moveBackAnim(normal: number) {
            this.moveBackNormal = normal;
            this.hitBox.position.setTo(this.releasePoint.x * normal, this.releasePoint.y * normal);
        }

        private get fadeAnim(): number {
            return this.fadeNormal;
        }

        private set fadeAnim(normal: number) {
            this.fadeNormal = normal;
            let offset: Phaser.Point = new Phaser.Point(this.fadeTarget.centerX - this.releasePoint.x, this.fadeTarget.centerY - this.releasePoint.y);
            this.position.setTo(this.releasePoint.x + offset.x * normal, this.releasePoint.y + offset.y * normal);
            this.alpha = 1 - normal;
            this.anim.rotation = Math.PI * 2 * (1 - normal);
            this.scale.setTo(1 - normal);
        }

        /**
         * Returns the type of this wagon.
         */
        public get cargoType(): CargoTypes {
            return this.cargo;
        }

        /**
         * Returns the world space position of the cargo.
         */
        public get worldPosition(): PIXI.Point {
            return this.hitBox.worldPosition;
        }
    }
}
