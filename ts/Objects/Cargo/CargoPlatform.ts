module ExamAssignmentMA {
    export class CargoPlatform extends Phaser.Group {

        public cargoAdded: Phaser.Signal;
        public cargoRemoved: Phaser.Signal;
        private cargo: CargoGrid[];
        private moveTween: Phaser.Tween;
        private moveNormal: number;

        constructor(game: Phaser.Game) {
            super(game);
            this.cargo = [];
            this.cargoAdded = new Phaser.Signal();
            this.cargoRemoved = new Phaser.Signal();
            this.moveNormal = 0;
        }

        public reset(): void {
            this.cargo = [ null ];
        }

        public createNext(): CargoGrid {
            let newCargo: CargoGrid = new CargoGrid(this.game);
            this.add(newCargo);
            this.cargo.push(newCargo);
            this.cargoAdded.dispatch(newCargo);
            newCargo.x = this.game.width; // Out of screen until positioned
            return newCargo;
        }

        public moveToNext(): void {
            if (this.moveTween && this.moveTween.isRunning) {
                this.moveTween.stop();
            }
            this.moveNormal = 0;
            this.moveTween = this.game.add.tween(this).to({ moveAnim: -1 }, 1000, Phaser.Easing.Quadratic.InOut, true);
            this.moveTween.onComplete.addOnce(this.moveComplete, this);
            console.log('moving out');
        }

        private moveComplete(): void {
            if (this.cargo.length <= 0) {
                return;
            }
            console.log('move complete', this);
            let removing: CargoGrid = this.cargo[0];
            this.cargo.splice(0, 1);
            if (removing) {
                console.log('removing cargoi');
                this.cargoRemoved.dispatch(removing);
            }
            this.moveNormal = 0;
        }

        public resize(): void {
            for (let i: number = 0; i < this.cargo.length; i++) {
                if (this.cargo[i]) {
                    this.cargo[i].resize();
                }
            }
            if (!this.moveTween || !this.moveTween.isRunning) {
                this.moveAnim = this.moveAnim;
            }
        }

        private get moveAnim(): number {
            return this.moveNormal;
        }

        private set moveAnim(value: number) {
            this.moveNormal = value;
            for (let i: number = 0; i < this.cargo.length; i++) {
                if (this.cargo[i]) {
                    this.cargo[i].x = (value + i) * this.game.width;
                }
            }
        }
    }
}
