module ExamAssignmentMA {
    /**
     * The indicator showing the cargo required for this wagon.
     */
    export class CargoIndicator extends Phaser.Group {

        public wagonFilled: Phaser.Signal;
        private requestedCargo: CargoIcon[];
        private background: Phaser.Image;
        private iconMask: Phaser.Graphics;
        private moveNextNormal: number;
        private moveNextTween: Phaser.Tween;
        private pulsateTween: Phaser.Tween;
        private scaleTween: Phaser.Tween;
        private glowImage: Phaser.Image;
        private initialCargoScale: number;
        private pulseAnimValue: number;
        private scaleAnimValue: number;
        private activeCargoScale: number;
        private inactiveCargoScale: number;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.requestedCargo = [];
            this.background = new Phaser.Image(this.game, 0, 0, Images.CargoIndicatorContainer);
            this.background.anchor.setTo(0.5);
            this.iconMask = new Phaser.Graphics(game);
            this.moveNextNormal = 0;
            this.wagonFilled = new Phaser.Signal();
            this.moveNextTween = null;
            this.pulsateTween = null;
            this.scaleTween = null;
            this.glowImage = new Phaser.Image(this.game, 0, 0, Images.GlowImage);
            this.add(this.background);
            this.add(this.iconMask);
            this.add(this.glowImage);

            // Setting values
            this.initialCargoScale = 0; //this.inactiveCargoScale;
            this.activeCargoScale = 0.725;
            this.inactiveCargoScale = 0.6;
        }

        /**
         * Sets the required cargo.
         * @param cargoType The required cargo for this wagon to be completed.
         */
        public setRequestedCargo(cargoTypes: CargoTypes[]): void {
            cargoTypes.forEach(this.determineRequestedCargo, this);
        }

        private determineRequestedCargo(cargoType: CargoTypes): void {
            let cargoIcon: CargoIcon = new CargoIcon(this.game, cargoType);
            this.add(cargoIcon);
            this.requestedCargo.push(cargoIcon);
            this.resizeCargo();
        }

        /**
         * Resizes all elements in this object.
         */
        public resize(): void {
            let wagonWidth: number = this.parent.width / this.parent.scale.x,
                wagonHeight: number = this.parent.height / this.parent.scale.y;
            this.x = wagonWidth * 0.5;
            this.y = wagonHeight * -0.825;
            this.background.width = wagonWidth * 0.6;
            this.background.height = this.background.width * 0.2;
            this.iconMask.beginFill(0, 0);
            this.iconMask.drawRect(0, 0, this.background.width, this.background.height);
            this.iconMask.endFill();
            this.iconMask.x = this.background.left;
            this.iconMask.y = this.background.top;

            this.resizeCargo();
        }

        private resizeCargo(): void {
            for (let i: number = 0; i < this.requestedCargo.length; i++) {
                if (i === 0) {
                    //if (this.moveNextTween != null && !this.moveNextTween.isRunning) {
                        this.requestedCargo[i].height = this.background.height * this.activeCargoScale;
                    //}
                } else {
                    this.requestedCargo[i].height = this.background.height * this.inactiveCargoScale;
                }

                this.requestedCargo[i].scale.x = this.requestedCargo[i].scale.y;
                this.requestedCargo[i].mask = this.iconMask;
                this.requestedCargo[i].x = this.calculateCargoPosition(i, this.requestedCargo[i].width);
            }

            if (this.requestedCargo.length > 0) {
                this.initialCargoScale = this.requestedCargo[0].scale.x;
                this.glowImage.x = this.requestedCargo[0].x;
                this.glowImage.y = this.requestedCargo[0].y;
            }
        }

        /**
         * Starts a tween on the first cargo icon in the CargoIndicator bar
         */
        public setFirstCargoEffect(): void {
            if (this.pulsateTween && this.pulsateTween.isRunning) {
                this.pulsateTween.stop();
            }
            this.pulseAnim = 0;
            this.pulsateTween = this.game.add.tween(this).to({ pulseAnim: 1 }, 750, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
        }

        private get pulseAnim(): number {
            return this.pulseAnimValue;
        }

        private set pulseAnim(normValue: number) {
            if (this.requestedCargo.length <= 0) {
                return;
            }

            this.pulseAnimValue = normValue;
            this.requestedCargo[0].scale.x = this.initialCargoScale * (1 + normValue * 0.1);
            this.requestedCargo[0].scale.y = this.initialCargoScale * (1 + normValue * 0.1);
        }
        
        private calculateCargoPosition(index: number, cargoWidth: number): number {
            return -(this.background.width * 0.375) + ((index + this.moveNextNormal) * (cargoWidth + this.background.width * 0.05));
        }

        /**
         * Validates if the dropped cargo was currently needed.
         * @param cargo The cargo being dropped.
         */
        public dropCargo(cargo: Cargo): boolean {
            if (this.requestedCargo.length > 0 && this.requestedCargo[0].cargoType === cargo.cargoType) {
                this.requestedCargo[0].fadeDestroy();
                this.requestedCargo.splice(0, 1);

                if (this.requestedCargo.length === 0) {
                    this.wagonFilled.dispatch(this);
                } else {
                    this.moveNextNormal += 1;
                    if (this.moveNextTween && this.moveNextTween.isRunning) {
                        this.moveNextTween.stop();
                    }
                    this.moveNextTween = this.game.add.tween(this).to({ moveNextAnim: 0 }, 500, Phaser.Easing.Quadratic.In, true, 200);
                    this.moveNextTween.onComplete.addOnce(this.setFirstCargoEffect, this);
                }

                return true;
            }
            return false;
        }

        private get moveNextAnim(): number {
            return this.moveNextNormal;
        }

        private set moveNextAnim(normal: number) {
            this.moveNextNormal = normal;
            for (let i: number = 0; i < this.requestedCargo.length; i++) {
                this.requestedCargo[i].x = this.calculateCargoPosition(i, this.requestedCargo[i].width);
            }

            let scaleDiff: number = this.activeCargoScale - this.inactiveCargoScale;
            let restValue: number = scaleDiff * normal;
            let scaleValue: number = this.activeCargoScale - restValue;

            this.requestedCargo[0].height = this.background.height * scaleValue;
            this.requestedCargo[0].scale.x = this.requestedCargo[0].scale.y;
        }
    }
}
