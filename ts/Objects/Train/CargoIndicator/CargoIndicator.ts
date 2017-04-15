module ExamAssignmentMA {
    export class CargoIndicator extends Phaser.Group {
        private requestedCargo: CargoIcon[];
        private background: Phaser.Image;
        public wagonFilled: Phaser.Signal;

        constructor(game: Phaser.Game) {
            super(game);
            this.requestedCargo = [];
            this.background = new Phaser.Image(this.game, 0, 0, Images.WhitePixel);
            this.background.anchor.setTo(0.5);
            this.add(this.background);
            this.wagonFilled = new Phaser.Signal();
        }

        public setRequestedCargo(cargoType: CargoTypes[]): void {
            cargoType.forEach(this.determineRequestedCargo, this);
        }

        private determineRequestedCargo(cargoType: CargoTypes): void {
            let cargoIcon: CargoIcon = new CargoIcon(this.game, cargoType);
            this.add(cargoIcon);
            this.requestedCargo.push(cargoIcon);
            this.resizeCargo();
        }

        public resize(): void {
            let wagonWidth: number = this.parent.width / this.parent.scale.x,
                wagonHeight: number = this.parent.height / this.parent.scale.y;
            this.x = wagonWidth * 0.5;
            this.y = wagonHeight * -0.8;
            this.background.width = wagonWidth * 0.4;
            this.background.height = this.background.width * 0.2;
            this.resizeCargo();
        }

        private resizeCargo(): void {
            for (let i: number = 0; i < this.requestedCargo.length; i++) {
                this.requestedCargo[i].activeCargo = i === 0;
                this.requestedCargo[i].height = this.background.height * 0.8;
                this.requestedCargo[i].scale.x = this.requestedCargo[i].scale.y;
                this.requestedCargo[i].x = - (this.background.width * 0.4) + (i * (this.requestedCargo[i].width + this.game.width * 0.005));
            }
        }

        public dropCargo(cargo: Cargo): void {
            if (this.requestedCargo.length > 0 && this.requestedCargo[0].cargoType === cargo.cargoType) {
                this.requestedCargo[0].destroy();
                this.requestedCargo.splice(0, 1);
                this.resizeCargo();
                if (this.requestedCargo.length === 0) {
                    this.wagonFilled.dispatch(this);
                }
            } else {
                cargo.moveBack();
            }
        }
    }
}
