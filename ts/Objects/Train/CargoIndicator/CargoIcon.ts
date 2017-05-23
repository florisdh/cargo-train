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
            let imageName: string, color: number;
            switch (type) {
                case CargoTypes.CircleRed:
                    imageName = Images.CargoIndicatorCircle;
                    color = 0xff0000;
                    break;
                case CargoTypes.CircleYellow:
                    imageName = Images.CargoIndicatorCircle;
                    color = 0xffee00;
                    break;
                case CargoTypes.CircleBlue:
                    imageName = Images.CargoIndicatorCircle;
                    color = 0x0000ff;
                    break;
                case CargoTypes.CubeRed:
                    imageName = Images.CargoIndicatorCube;
                    color = 0xff0000;
                    break;
                case CargoTypes.CubeYellow:
                    imageName = Images.CargoIndicatorCube;
                    color = 0xffee00;
                    break;
                case CargoTypes.CubeBlue:
                    imageName = Images.CargoIndicatorCube;
                    color = 0x0000ff;
                    break;
                case CargoTypes.TriangleRed:
                    imageName = Images.CargoIndicatorTriangle;
                    color = 0xff0000;
                    break;
                case CargoTypes.TriangleYellow:
                    imageName = Images.CargoIndicatorTriangle;
                    color = 0xffee00;
                    break;
                case CargoTypes.TriangleBlue:
                    imageName = Images.CargoIndicatorTriangle;
                    color = 0x0000ff;
                    break;
                default:
                    break;
            }
            super(game, 0, 0, imageName);
            this.tint = color;
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
    }
}
