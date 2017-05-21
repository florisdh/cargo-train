module ExamAssignmentMA {
    /**
     * Container of the CargoGrids, handles their movement and states.
     */
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

        /**
         * Empties the array containing the cargo
         */
        public reset(): void {
            this.cargo = [ null ];
        }

        /**
         * Creates a new CargoGrid, and adds and fills the cargo array.
         */
        public createNext(): CargoGrid {
            let newCargo: CargoGrid = new CargoGrid(this.game);
            this.add(newCargo);
            this.cargo.push(newCargo);
            this.cargoAdded.dispatch(newCargo);
            newCargo.x = this.game.width; // Out of screen until positioned
            return newCargo;
        }

        /**
         * Tweens the movement of the cargo
         */
        public moveToNext(): void {
            if (this.moveTween && this.moveTween.isRunning) {
                this.moveTween.stop();
            }
            this.moveNormal = 0;
            this.moveTween = this.game.add.tween(this).to({ moveAnim: -1 }, 1000, Phaser.Easing.Back.InOut, true, 100);
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
                removing.destroy(true);
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
