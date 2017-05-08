module ExamAssignmentMA {
    /**
     * The wagon that needs cargo to finish it objective.
     */
    export class CargoWagon extends Wagon {

        private cargoIndicator: CargoIndicator;
        private wagonDoors: WagonDoors;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.cargoIndicator = new CargoIndicator(this.game);
            this.wagonDoors = new WagonDoors(this.game, this);
            this.cargoIndicator.wagonFilled.add(this.onWagonFilled, this);
            this.addChild(this.cargoIndicator);
            this.addChild(this.wagonDoors);
            this.moveInDone.add(this.movedIn, this);
            this.resize();
        }

        private movedIn(): void {
            this.cargoIndicator.setFirstCargoEffect();
            this.wagonDoors.open();
        }

        /**
         * Sets the required cargo randomly with an amount specified.
         * @param amount The amount of random generated cargo to use.
         */
        public setRandomCargo(amount: number): CargoTypes[] {
            let randomCargo: CargoTypes[] = [];
            for (let i: number = 0; i < amount; i++) {
                randomCargo.push(<CargoTypes>Math.floor(Math.random() * 8));
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
            this.wagonDoors.close();
            this.wagonDoors.closed.addOnce(() => {
                this.objectiveDone.dispatch(this);
            });
        }

        /**
         * Resizes all elements in this object.
         * @param y The y axis where the top ui elements should center to.
         */
        public resize(): void {
            super.resize();
            this.cargoIndicator.resize();
            this.wagonDoors.resize();
        }

        /**
         * Checks if the cargo is correct, returns the result
         * @param cargo
         */
        public dropCargo(cargo: Cargo): boolean {
            return (this.isIdle && this.cargoIndicator.dropCargo(cargo));
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.CargoWagon;
        }
    }
}
