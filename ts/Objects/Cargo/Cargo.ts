module ExamAssignmentMA {
    export class Cargo extends Phaser.Image {
        constructor(game: Phaser.Game, type: CargoTypes) {
            let image: string = null;
            switch (type) {
                case CargoTypes.Circle:
                    image = Images.CargoCircle;
                    break;
                case CargoTypes.Cube:
                    image = Images.CargoCube;
                    break;
                case CargoTypes.Triangle:
                    image = Images.CargoTriangle;
                    break;
                default:
                    break;
            }
            super(game, 0, 0, image);
        }

        public resize(): void {
            console.log('res cargo');
        }
    }
}
