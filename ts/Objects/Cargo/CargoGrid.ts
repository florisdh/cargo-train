module ExamAssignmentMA {
    export class CargoGrid extends Phaser.Group {
        public cargoDropped: Phaser.Signal;
        private readonly xAmount: number = 4;
        private readonly yAmount: number = 4;
        private readonly marginNormal: number = 0.1;
        private cargo: Cargo[];
        private factory: CargoFactory;

        constructor(game: Phaser.Game) {
            super(game);
            this.cargo = [];
            this.factory = new CargoFactory(game);
            this.cargoDropped = new Phaser.Signal();
        }

        public spawnCargo(required: CargoTypes[]): void {
            let maxItems: number = this.xAmount * this.yAmount;
            let items: CargoTypes[] = [];

            // Spawn random items
            let randomItems: number = maxItems - required.length;
            for (let i: number = 0; i < randomItems; i++) {
                items.push(<CargoTypes>this.game.rnd.integerInRange(0, 2));
            }

            // Spawn required items on random positions in array
            for (let i: number = 0; i < required.length; i++) {
                items.splice(this.game.rnd.integerInRange(0, items.length), 0, <CargoTypes>required[i]);
            }

            items.forEach(this.addCargo, this);
            this.resize();
        }

        private addCargo(type: CargoTypes): void {
            let cargo: Cargo = this.factory.getCargo(type);
            this.add(cargo);
            this.cargo.push(cargo);
            cargo.dropped.add(this.onCargoDropped, this);
        }

        private onCargoDropped(cargo: Cargo, position: Phaser.Point): void {
            this.cargoDropped.dispatch(cargo, position);
        }

        public resize(): void {
            this.y = this.game.height * 0.45;
            let spacingX: number = this.game.width * (1 - this.marginNormal * 2) / this.xAmount;
            let spacingY: number = (this.game.height - this.y) * (1 - this.marginNormal * 2) / this.yAmount;
            for (let y: number = 0; y < this.yAmount; y++) {
                for (let x: number = 0; x < this.xAmount; x++) {
                    let cargo: Cargo = this.cargo[x + y * this.xAmount];
                    if (cargo) {
                        cargo.left = this.game.width * this.marginNormal + spacingX * x;
                        cargo.top = this.game.height * this.marginNormal + spacingY * y;
                        cargo.width = spacingX;
                        cargo.scale.y = cargo.scale.x;
                        if (cargo.height > spacingY) {
                            cargo.height = spacingY;
                            cargo.scale.x = cargo.scale.y;
                        }
                    }
                }
            }
        }
    }
}
