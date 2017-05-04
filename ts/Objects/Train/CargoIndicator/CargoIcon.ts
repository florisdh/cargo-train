module ExamAssignmentMA {
    /**
     * The icon displaying the tiny version of cargo.
     */
    export class CargoIcon extends Phaser.Image {

        public cargoType: CargoTypes;
        private destroyTween: Phaser.Tween;

        /**
         * @param game The active game instance to be added to.
         * @param type The type of cargo to be displayed.
         */
        constructor(game: Phaser.Game, type: CargoTypes) {
            let imageName: string;
            switch (type) {
                case CargoTypes.CircleRed:
                    imageName = Images.CargoIndicatorCircleRed;
                    break;
                case CargoTypes.CircleGreen:
                    imageName = Images.CargoIndicatorCircleGreen;
                    break;
                case CargoTypes.CircleBlue:
                    imageName = Images.CargoIndicatorCircleBlue;
                    break;
                case CargoTypes.CubeRed:
                    imageName = Images.CargoIndicatorCubeRed;
                    break;
                case CargoTypes.CubeGreen:
                    imageName = Images.CargoIndicatorCubeGreen;
                    break;
                case CargoTypes.CubeBlue:
                    imageName = Images.CargoIndicatorCubeBlue;
                    break;
                case CargoTypes.TriangleRed:
                    imageName = Images.CargoIndicatorTriangleRed;
                    break;
                case CargoTypes.TriangleGreen:
                    imageName = Images.CargoIndicatorTriangleGreen;
                    break;
                case CargoTypes.TriangleBlue:
                    imageName = Images.CargoIndicatorTriangleBlue;
                    break;
                default:
                    break;
            }
            super(game, 0, 0, imageName);
            this.anchor.setTo(0.5);
            this.cargoType = type;
        }

        /**
         * Fades the graphic to transparent and destroys it afterwards.
         */
        public fadeDestroy(): void {
            if (this.destroyTween) {
                return;
            }
            this.destroyTween = this.game.add.tween(this).to({ alpha: 0 }, 200, Phaser.Easing.Quadratic.In, true);
            this.destroyTween.onComplete.addOnce(() => {
                this.destroy();
            });
        }

        /**
         * Sets wether the cargo is the active objective.
         */
        public set activeCargo(value: boolean) {
            //this.tint = value ? 0xCC0000 : 0x0;
            this.alpha = value ? 1 : 0.5;
        }
    }
}
