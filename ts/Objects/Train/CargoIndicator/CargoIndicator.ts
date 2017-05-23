module ExamAssignmentMA {
    /**
     * The indicator showing the cargo required for this wagon.
     */
    export class CargoIndicator extends Phaser.Group {

        public wagonFilled: Phaser.Signal;
        private requestedCargo: CargoIcon[];
        private background: Phaser.Image;
        private iconMask: Phaser.Graphics;
        // Cargo movement
        private moveNextNormal: number;
        private moveNextTween: Phaser.Tween;
        // Pulsate and scaling tweens
        private pulsateTween: Phaser.Tween;
        private scaleTween: Phaser.Tween;
        private pulseAnimValue: number;
        private initialCargoScale: number;
        private activeCargoScale: number;
        private inactiveCargoScale: number;
        // Highlight
        private highlightFadeTween: Phaser.Tween;
        private highlightImage: Phaser.Image;
        private highlightImageBaseAlpha: number;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.requestedCargo = [];
            this.wagonFilled = new Phaser.Signal();

            // Graphics
            this.iconMask = new Phaser.Graphics(game);
            this.background = new Phaser.Image(this.game, 0, 0, Images.CargoIndicatorContainer);
            this.background.anchor.setTo(0.5);
            this.highlightImage = new Phaser.Image(this.game, 0, 0, Images.WhitePixel);
            this.highlightImage.anchor = new Phaser.Point(0.5, 0.5);

            // Tweens
            this.moveNextTween = null;
            this.pulsateTween = null;
            this.scaleTween = null;
            this.highlightFadeTween = null;

            this.add(this.background);
            this.add(this.iconMask);
            this.add(this.highlightImage);

            // Setting values
            this.moveNextNormal = 0;
            this.initialCargoScale = 0;
            this.activeCargoScale = 0.725;      // 72.5%
            this.inactiveCargoScale = 0.6;      // 60%
            this.highlightImageBaseAlpha = 0.3; // 30%
            this.highlightImage.alpha = 0;
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
        public resize(wagonWidth: number, wagonHeight: number): void {
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
                    this.requestedCargo[i].height = this.background.height * this.activeCargoScale;
                } else {
                    this.requestedCargo[i].height = this.background.height * this.inactiveCargoScale;
                }

                this.requestedCargo[i].scale.x = this.requestedCargo[i].scale.y;
                this.requestedCargo[i].mask = this.iconMask;
                this.requestedCargo[i].x = this.calculateCargoPosition(i, this.requestedCargo[i].width);
            }

            if (this.requestedCargo.length > 0) {
                this.initialCargoScale = this.requestedCargo[0].scale.x;
                this.highlightImage.x = this.requestedCargo[0].x;
                this.highlightImage.y = this.requestedCargo[0].y;
            }
        }

        /**
         * Starts a tween on the first cargo icon in the CargoIndicator bar
         */
        public setActiveCargoEffect(): void {
            if (this.requestedCargo.length <= 0) {
                return;
            }

            this.setCargoPulsate();
            this.setCargoHighlight(this.requestedCargo[0].cargoType);
        }

        private setCargoPulsate(): void {
            // Pulsate tween
            if (this.pulsateTween && this.pulsateTween.isRunning) {
                this.pulsateTween.stop();
            }
            this.pulseAnim = 0;
            this.pulsateTween = this.game.add.tween(this).to({ pulseAnim: 1 }, 750, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
        }

        /**
         * Replaces the highlight image to the correct type and colors it accordingly while also starting its tween.
         * @param cargoType The type of the active cargo to set the highlight for
         */
        private setCargoHighlight(cargoType: CargoTypes): void {
            let imgPath: string;
            let colorTint: number;

            // Get the right cargo highlight sprite
            switch (cargoType) {
                case CargoTypes.CubeRed:
                case CargoTypes.CubeYellow:
                case CargoTypes.CubeBlue:
                    imgPath = Images.CargoHighlightCube;
                    break;
                case CargoTypes.CircleRed:
                case CargoTypes.CircleYellow:
                case CargoTypes.CircleBlue:
                    imgPath = Images.CargoHighlightCircle;
                    break;
                case CargoTypes.TriangleRed:
                case CargoTypes.TriangleYellow:
                case CargoTypes.TriangleBlue:
                    imgPath = Images.CargoHighlightTriangle;
                    break;
                default:
                    break;
            }

            // Get the right cargo color
            switch (cargoType) {
                case CargoTypes.CubeRed:
                case CargoTypes.CircleRed:
                case CargoTypes.TriangleRed:
                    colorTint = 0xff0000;
                    break;
                case CargoTypes.CubeYellow:
                case CargoTypes.CircleYellow:
                case CargoTypes.TriangleYellow:
                    colorTint = 0xffee00;
                    break;
                case CargoTypes.TriangleBlue:
                case CargoTypes.CubeBlue:
                case CargoTypes.CircleBlue:
                    colorTint = 0x0000ff;
                    break;
                default:
                    break;
            }

            // Set values
            this.highlightImage.loadTexture(imgPath);
            this.highlightImage.tint = colorTint;
            this.highlightImage.x = this.requestedCargo[0].centerX;
            this.highlightImage.y = this.requestedCargo[0].centerY;
            this.highlightImage.scale.x = this.requestedCargo[0].scale.x * 1.075;
            this.highlightImage.scale.y = this.highlightImage.scale.x;

            // Highlight tween
            if (this.highlightFadeTween && this.highlightFadeTween.isRunning) {
                this.highlightFadeTween.stop();
            }
            this.highlightFadeTween = this.game.add.tween(this.highlightImage).to({ alpha: this.highlightImageBaseAlpha }, 500, Phaser.Easing.Quadratic.In, true);
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

                // Fade out completed Cargo
                this.requestedCargo[0].fadeDestroy();

                // Fade out Highlight tween
                if (this.highlightFadeTween && this.highlightFadeTween.isRunning) {
                    this.highlightFadeTween.stop();
                }
                this.highlightFadeTween = this.game.add.tween(this.highlightImage).to({ alpha: 0 }, 200, Phaser.Easing.Quadratic.In, true);

                // Stop pulsate tween
                if (this.pulsateTween && this.pulsateTween.isRunning) {
                    this.pulsateTween.stop();
                    this.pulseAnim = 0;
                }

                // Remove completed cargo from array
                this.requestedCargo.splice(0, 1);

                // Check if wagon is done
                if (this.requestedCargo.length === 0) {
                    this.wagonFilled.dispatch(this);
                } else {
                    // Move in next cargo
                    this.moveNextNormal += 1;
                    if (this.moveNextTween && this.moveNextTween.isRunning) {
                        this.moveNextTween.stop();
                    }
                    this.moveNextTween = this.game.add.tween(this).to({ moveNextAnim: 0 }, 500, Phaser.Easing.Quadratic.In, true, 200);
                    this.moveNextTween.onComplete.addOnce(this.setActiveCargoEffect, this);
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

            // Reposition the Cargo based on the normal
            for (let i: number = 0; i < this.requestedCargo.length; i++) {
                this.requestedCargo[i].x = this.calculateCargoPosition(i, this.requestedCargo[i].width);
            }

            // Scale the Cargo based on the normal
            if (this.requestedCargo.length > 0) {
                let scaleDiff: number = this.activeCargoScale - this.inactiveCargoScale;
                let restValue: number = scaleDiff * normal;
                let scaleValue: number = this.activeCargoScale - restValue;

                this.requestedCargo[0].height = this.background.height * scaleValue;
                this.requestedCargo[0].scale.x = this.requestedCargo[0].scale.y;
            }
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

            this.highlightImage.scale.x = this.requestedCargo[0].scale.x * 1.075;
            this.highlightImage.scale.y = this.highlightImage.scale.x;
        }

        public get nextType(): CargoTypes {
            return this.requestedCargo.length > 0 ? this.requestedCargo[0].cargoType : CargoTypes.None;
        }
    }
}
