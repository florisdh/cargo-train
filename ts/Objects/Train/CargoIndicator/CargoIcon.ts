module ExamAssignmentMA {
    export class CargoIcon extends Phaser.Image {
        public cargoType: CargoTypes;

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

        public set activeCargo(value: boolean) {
            this.tint = value ? 0xCCFF00 : 0xCC0000;
        }
    }
}
