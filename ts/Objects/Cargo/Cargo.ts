module ExamAssignmentMA {
    /**
     * The cargo to be displayed on the platorm.
     */
    export class Cargo extends Phaser.Group {

        public dropped: Phaser.Signal;
        public removed: Phaser.Signal;
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
                case CargoTypes.CircleGreen:
                    imageName = Spines.GreenCircle;
                    break;
                case CargoTypes.CircleBlue:
                    imageName = Spines.BlueCircle;
                    break;
                case CargoTypes.CubeRed:
                    imageName = Spines.RedCube;
                    break;
                case CargoTypes.CubeGreen:
                    imageName = Spines.GreenCube;
                    break;
                case CargoTypes.CubeBlue:
                    imageName = Spines.BlueCube;
                    break;
                case CargoTypes.TriangleRed:
                    imageName = Spines.RedTriangle;
                    break;
                case CargoTypes.TriangleGreen:
                    imageName = Spines.GreenTriangle;
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
            this.hitBox = this.game.add.image(0, 0, Images.WhitePixel, null, this);
            this.hitBox.alpha = 0;
            this.hitBox.anchor.setTo(0.5);
            this.hitBox.inputEnabled = true;
            this.hitBox.input.enableDrag(false, true);
            this.hitBox.events.onDragStart.add(this.onDragStart, this);
            this.hitBox.events.onDragStop.add(this.onDragStop, this);
            this.isDragging = false;
            this.releasePoint = null;
            this.moveBackNormal = 0;
            this.moveBackTween = null;
            this.fadeNormal = 0;
            this.fadeTween = null;
            this.fadeTarget = null;
            this.particleEmitter = game.add.emitter(0, 0, 50);
            this.particleEmitter.makeParticles(Images.ParticleStar);
            this.particleEmitter.setAlpha(1.0, 0.0, 1500, Phaser.Easing.Linear.None);
            this.particleEmitter.autoAlpha = true;
            //this.particleEmitter.gravity = -6;

            this.anim.position = this.hitBox.position;

            this.game.time.events.add(this.game.rnd.integerInRange(0, 500), () => {
                this.anim.setAnimationByName(0, 'idle', true);
            });
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

            this.particleEmitter.x = this.worldPosition.x;
            this.particleEmitter.y = this.worldPosition.y;
            this.particleEmitter.start(true, 1500, null, this.game.rnd.integerInRange(3, 7));
            this.fadeTween.onComplete.addOnce(this.fadeDone, this);

            this.anim.setAnimationByName(0, 'idle', true);
        }

        private fadeDone(): void {
            this.removed.dispatch(this);
            this.destroy();
            console.log('removed cargo');
        }

        private onDragStart(e: Cargo): void {
            if (this.moveBackTween && this.moveBackTween.isRunning) {
                this.moveBackTween.stop();
            }
            this.isDragging = true;
            this.anim.setAnimationByName(0, 'pickUp', true);
        }

        private onDragStop(e: Cargo): void {
            this.hitBox.inputEnabled = false;
            this.dropped.dispatch(this);
            this.isDragging = false;
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
            });
            this.anim.setAnimationByName(0, 'land');
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
            if (width / 145 * 139 > height) {
                this.anim.scale.setTo(height / 139);
            } else {
                this.anim.scale.setTo(width / 145);
            }
            this.anim.width = width;
            this.anim.scale.y = this.anim.scale.x;
            if (this.anim.height > height) {
                this.anim.height = height;
                this.anim.scale.x = this.anim.scale.y;
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

        public get worldPosition(): PIXI.Point {
            return this.hitBox.worldPosition;
        }
    }
}
