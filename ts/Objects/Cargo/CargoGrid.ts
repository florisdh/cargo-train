module ExamAssignmentMA {
    export class CargoGrid extends Phaser.Group {
        private readonly xAmount: number = 4;
        private readonly yAmount: number = 4;
        private readonly marginNormal: number = 0.1;
        private cargo: Cargo[];
        private factory: CargoFactory;

        constructor(game: Phaser.Game) {
            super(game);
            this.cargo = [];
            this.factory = new CargoFactory(game);
        }

        public spawnCargo(required: CargoTypes[]): void {
            let maxItems: number = this.xAmount * this.yAmount;

            // Spawn random items
            let randomItems: number = maxItems - required.length;
            let items: Cargo[] = [];
            let cargo: Cargo;
            for (let i: number = 0; i < randomItems; i++) {
                cargo = this.factory.getCargo(this.game.rnd.integerInRange(0, 2));
                this.add(cargo);
                items.push(cargo);
            }

            // Spawn required items on random positions in array
            for (let i: number = 0; i < required.length; i++) {
                cargo = this.factory.getCargo(<CargoTypes>required[i]);
                this.add(cargo);
                items.splice(this.game.rnd.integerInRange(0, items.length), 0, cargo);
            }

            this.cargo = items;
            this.resize();
        }

        public resize(): void {
            console.log('res cargoGrid', this.cargo.length);
            this.y = this.game.height * 0.45;
            let spacingX: number = this.game.width * (1 - this.marginNormal * 2) / this.xAmount;
            let spacingY: number = (this.game.height - this.y) * (1 - this.marginNormal * 2) / this.yAmount;
            for (let y: number = 0; y < this.yAmount; y++) {
                for (let x: number = 0; x < this.xAmount; x++) {
                    let cargo: Cargo = this.cargo[x + y * this.xAmount];
                    if (cargo) {
                        cargo.x = this.game.width * this.marginNormal + spacingX * x;
                        cargo.y = this.game.height * this.marginNormal + spacingY * y;
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
