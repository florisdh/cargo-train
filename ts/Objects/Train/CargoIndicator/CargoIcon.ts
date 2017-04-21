module ExamAssignmentMA {
    /**
     * The icon displaying the tiny version of cargo.
     */
    export class CargoIcon extends Phaser.Image {

        public cargoType: CargoTypes;

        /**
         * @param game The active game instance to be added to.
         * @param type The type of cargo to be displayed.
         */
        constructor(game: Phaser.Game, type: CargoTypes) {
            let imageName: string;
            switch (type) {
                case CargoTypes.Circle:
                    imageName = Images.CargoIndicatorCircle;
                    break;
                case CargoTypes.Cube:
                    imageName = Images.CargoIndicatorCube;
                    break;
                case CargoTypes.Triangle:
                    imageName = Images.CargoIndicatorTriangle;
                    break;
                default:
                    break;
            }
            super(game, 0, 0, imageName);
            this.anchor.setTo(0.5);
            this.cargoType = type;
        }

        /**
         * Sets wether the cargo is the active objective.
         */
        public set activeCargo(value: boolean) {
            this.tint = value ? 0xCC0000 : 0x0;
            this.alpha = value ? 1 : 0.5;
        }
    }
}
