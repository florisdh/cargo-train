module ExamAssignmentMA {
    export class CargoIndicator extends Phaser.Group {
        private requestedCargo: CargoIcon[];
        private background: Phaser.Image;
        public wagonFilled: Phaser.Signal;

        constructor(game: Phaser.Game) {
            super(game);
            this.requestedCargo = [];
            this.background = new Phaser.Image(this.game, 0, 0, Images.WhitePixel);
            this.background.anchor.setTo(0.5, 0.5);
            this.add(this.background);
            this.wagonFilled = new Phaser.Signal();
        }

        public setRequestedCargo(cargoType: CargoTypes[]): void {
            cargoType.forEach(this.determineRequestedCargo, this);
        }

        private determineRequestedCargo(cargoType: CargoTypes): void {
            let imageName: string;
            switch (cargoType) {
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
            let image: Phaser.Image = new Phaser.Image(this.game, 0, 0, imageName);
            image.anchor.setTo(0.5, 0.5);
            this.add(image);
            let cargoIcon: CargoIcon = new CargoIcon(cargoType, image);
            this.requestedCargo.push(cargoIcon);
            this.resize();
        }

        public resize(): void {
            this.background.width = this.game.width * 0.4;
            this.background.height = this.background.width * 0.2;
            this.x = this.game.width / 2;
            this.y = this.game.height * 0.1;
            for (let i: number = 0; i < this.requestedCargo.length; i++) {
                if (i === 0) {
                    this.requestedCargo[i].icon.tint = 0xCCFF00;
                } else {
                    this.requestedCargo[i].icon.tint = 0xCC0000;
                }
                this.requestedCargo[i].icon.height = this.background.height * 0.8;
                this.requestedCargo[i].icon.scale.x = this.requestedCargo[i].icon.scale.y;
                this.requestedCargo[i].icon.x = - (this.background.width * 0.4) + (i * (this.requestedCargo[i].icon.width + this.game.width * 0.005));
            }
        }

        public dropCargo(cargo: Cargo): void {
            if (this.requestedCargo.length > 0 && this.requestedCargo[0].cargoType === cargo.cargoType) {
                this.requestedCargo[0].icon.destroy();
                this.requestedCargo.splice(0, 1);
                if (this.requestedCargo.length === 0) {
                    this.wagonFilled.dispatch(this);
                }
                this.resize();
            } else {
                cargo.moveBack();
            }
        }
    }
}
