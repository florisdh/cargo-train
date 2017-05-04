module ExamAssignmentMA {
    /**
     * The cargo to be displayed on the platorm.
     */
    export class Cargo extends Phaser.Image {

        public dropped: Phaser.Signal;
        public removed: Phaser.Signal;
        private isDragging: boolean;
        private gridPoint: Phaser.Point;
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
            let image: string = null;
            switch (type) {
                case CargoTypes.CircleRed:
                    image = Images.CargoIndicatorCircleRed;
                    break;
                case CargoTypes.CircleGreen:
                    image = Images.CargoIndicatorCircleGreen;
                    break;
                case CargoTypes.CircleBlue:
                    image = Images.CargoIndicatorCircleBlue;
                    break;
                case CargoTypes.CubeRed:
                    image = Images.CargoIndicatorCubeRed;
                    break;
                case CargoTypes.CubeGreen:
                    image = Images.CargoIndicatorCubeGreen;
                    break;
                case CargoTypes.CubeBlue:
                    image = Images.CargoIndicatorCubeBlue;
                    break;
                case CargoTypes.TriangleRed:
                    image = Images.CargoIndicatorTriangleRed;
                    break;
                case CargoTypes.TriangleGreen:
                    image = Images.CargoIndicatorTriangleGreen;
                    break;
                case CargoTypes.TriangleBlue:
                    image = Images.CargoIndicatorTriangleBlue;
                    break;
                default:
                    break;
            }
            super(game, 0, 0, image);
            this.cargo = type;
            this.anchor.setTo(0.5);
            this.dropped = new Phaser.Signal();
            this.removed = new Phaser.Signal();
            this.inputEnabled = true;
            this.input.enableDrag(false, true);
            this.events.onDragStart.add(this.onDragStart, this);
            this.events.onDragStop.add(this.onDragStop, this);
            this.isDragging = false;
            this.gridPoint = this.position.clone();
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
            this.fadeTween = this.game.add.tween(this.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Linear.None, true);
            this.fadeTween = this.game.add.tween(this).to({ angle: 359 }, 300, null, true, 0, Infinity);

            this.particleEmitter.x = this.worldPosition.x;
            this.particleEmitter.y = this.worldPosition.y;
            this.particleEmitter.start(true, 1500, null, this.game.rnd.integerInRange(3, 7 ));
            this.fadeTween.onComplete.addOnce(this.fadeDone, this);
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
        }

        private onDragStop(e: Cargo): void {
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
            this.releasePoint = this.position.clone();
            this.moveBackAnim = 0;
            this.moveBackTween = this.game.add.tween(this).to({ moveBackAnim: 1 }, 300, Phaser.Easing.Quadratic.In, true);
        }

        /**
         * Scales and moves the cargo based on the given variables from the grid.
         * @param x The centerX position in the grid.
         * @param y The centerY position in the grid.
         * @param width The desired width of the cargo in the grid.
         * @param height The desired height of the cargo in the grid.
         */
        public resize(x: number, y: number, width: number, height: number): void {
            this.gridPoint.setTo(x, y);
            if (!this.isDragging && (this.moveBackTween === null || !this.moveBackTween.isRunning)) {
                this.x = x;
                this.y = y;
            }
            this.width = width;
            this.scale.y = this.scale.x;
            if (this.height > height) {
                this.height = height;
                this.scale.x = this.scale.y;
            }
        }

        private get moveBackAnim(): number {
            return this.moveBackNormal;
        }

        private set moveBackAnim(normal: number) {
            this.moveBackNormal = normal;
            let offset: Phaser.Point = new Phaser.Point(this.gridPoint.x - this.releasePoint.x, this.gridPoint.y - this.releasePoint.y);
            this.position.setTo(this.releasePoint.x + offset.x * normal, this.releasePoint.y + offset.y * normal);
        }

        private get fadeAnim(): number {
            return this.fadeNormal;
        }

        private set fadeAnim(normal: number) {
            this.fadeNormal = normal;
            let offset: Phaser.Point = new Phaser.Point(this.fadeTarget.centerX - this.releasePoint.x, this.fadeTarget.centerY - this.releasePoint.y);
            this.position.setTo(this.releasePoint.x + offset.x * normal, this.releasePoint.y + offset.y * normal);
            this.alpha = 1 - normal;
        }

        /**
         * Returns the type of this wagon.
         */
        public get cargoType(): CargoTypes {
            return this.cargo;
        }
    }
}
