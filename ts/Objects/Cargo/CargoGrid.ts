module ExamAssignmentMA {
    /**
     * A container for the cargo on the platform, aligning it in a grid.
     */
    export class CargoGrid extends Phaser.Group {

        public cargoDropped: Phaser.Signal;
        private readonly xAmount: number = 4;
        private readonly yAmount: number = 4;
        private readonly marginNormalX: number = 0.075;
        private readonly marginNormalTop: number = 0.1;
        private readonly marginNormalBottom: number = 0.15;
        private cargo: Cargo[];
        private factory: CargoFactory;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.cargo = [];
            this.factory = new CargoFactory(game);
            this.cargoDropped = new Phaser.Signal();
        }
        /**
         * Spawns the requested cargo on the grid.
         * @param required The cargo to be spawned on the grid.
         */
        public spawnCargo(required: CargoTypes[]): void {
            if (this.cargo.length > 0) {
                this.clearCargo();
            }

            let maxItems: number = this.xAmount * this.yAmount;
            let items: CargoTypes[] = [];

            // Spawn random items
            let randomItems: number = maxItems - required.length;
            for (let i: number = 0; i < randomItems; i++) {
                items.push(<CargoTypes>this.game.rnd.integerInRange(0, 7));
            }

            // Spawn required items on random positions in array
            for (let i: number = 0; i < required.length; i++) {
                items.splice(this.game.rnd.integerInRange(0, items.length), 0, <CargoTypes>required[i]);
            }

            items.forEach(this.addCargo, this);
            this.resize();
        }

        private clearCargo(): void {
            while (this.cargo.length > 0) {
                this.removeCargoAt(0);
            }
        }

        private addCargo(type: CargoTypes): void {
            let cargo: Cargo = this.factory.getCargo(type);
            this.add(cargo);
            this.cargo.push(cargo);
            cargo.dropped.add(this.onCargoDropped, this);
            cargo.removed.add(this.onCargoRemoved, this);
        }

        private onCargoRemoved(cargo: Cargo): void {
            let index: number = this.cargo.indexOf(cargo);
            if (index >= 0) {
                this.removeCargoAt(index);
            }
        }

        private removeCargoAt(index: number): void {
            let cargo: Cargo = this.cargo[index];
            this.cargo.splice(index, 1);
            cargo.dropped.remove(this.onCargoDropped, this);
            cargo.removed.remove(this.onCargoRemoved, this);
            this.remove(cargo);
        }

        private onCargoDropped(cargo: Cargo, position: Phaser.Point): void {
            this.cargoDropped.dispatch(cargo);
        }

        /**
         * Resizes all cargo on the grid.
         */
        public resize(): void {
            this.y = this.game.height * 0.35;
            let spacingX: number = this.game.width * (1 - this.marginNormalX * 2) / this.xAmount;
            let spacingY: number = (this.game.height - this.y) * (1 - this.marginNormalBottom - this.marginNormalBottom) / this.yAmount;
            for (let y: number = 0; y < this.yAmount; y++) {
                for (let x: number = 0; x < this.xAmount; x++) {
                    let cargo: Cargo = this.cargo[x + y * this.xAmount];
                    if (cargo) {
                        cargo.resize(
                            this.game.width * this.marginNormalX + spacingX * (x + 0.5),
                            this.game.height * this.marginNormalTop + spacingY * (y + 0.5),
                            spacingX, spacingY);
                    }
                }
            }
        }
    }
}
