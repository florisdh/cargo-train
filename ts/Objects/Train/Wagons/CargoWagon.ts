module ExamAssignmentMA {
    export class CargoWagon extends Wagon {
        private cargoIndicator: CargoIndicator;

        constructor(game: Phaser.Game) {
            super(game);
            this.cargoIndicator = new CargoIndicator(this.game);
            this.cargoIndicator.wagonFilled.add(this.onWagonFilled, this);
            this.addChild(this.cargoIndicator);
            this.resize();
        }

        public setRequestedCargo(cargo: CargoTypes[]): void {
            this.cargoIndicator.setRequestedCargo(cargo);
        }

        private onWagonFilled(): void {
            this.objectiveDone.dispatch(this);
        }

        public resize(): void {
            super.resize();
            this.cargoIndicator.resize();
        }

        public dropCargo(cargo: Cargo): void {
            if (this.isIdle && this.cargoIndicator.dropCargo(cargo)) {
                cargo.fadeOut(this);
            } else {
                cargo.moveBack();
            }
        }

        public get type(): WagonTypes {
            return WagonTypes.CargoWagon;
        }
    }
}
