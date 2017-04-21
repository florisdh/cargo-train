module ExamAssignmentMA {
    /**
     * The wagon that needs cargo to finish it objective.
     */
    export class CargoWagon extends Wagon {

        private cargoIndicator: CargoIndicator;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.cargoIndicator = new CargoIndicator(this.game);
            this.cargoIndicator.wagonFilled.add(this.onWagonFilled, this);
            this.addChild(this.cargoIndicator);
            this.resize();
        }

        /**
         * Sets the required cargo randomly with an amount specified.
         * @param amount The amount of random generated cargo to use.
         */
        public setRandomCargo(amount: number): CargoTypes[] {
            let randomCargo: CargoTypes[] = [];
            for (let i: number = 0; i < amount; i++) {
                randomCargo.push(<CargoTypes>Math.floor(Math.random() * 3));
            }
            this.setRequestedCargo(randomCargo);
            return randomCargo;
        }

        /**
         * Sets the cargo needed to finish it objective.
         * @param cargo The required cargo.
         */
        public setRequestedCargo(cargo: CargoTypes[]): void {
            this.cargoIndicator.setRequestedCargo(cargo);
        }

        private onWagonFilled(): void {
            this.objectiveDone.dispatch(this);
        }

        /**
         * Resizes all elements in this object.
         * @param y The y axis where the top ui elements should center to.
         */
        public resize(): void {
            super.resize();
            this.cargoIndicator.resize();
        }

        /**
         * Attempts to put the cargo in the wagon.
         * @param cargo
         */
        public dropCargo(cargo: Cargo): void {
            if (this.isIdle && this.cargoIndicator.dropCargo(cargo)) {
                cargo.fadeOut(this);
            } else {
                cargo.moveBack();
            }
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.CargoWagon;
        }
    }
}
