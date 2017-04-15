module ExamAssignmentMA {
    export class Wagon extends Phaser.Image {
        public moveInDone: Phaser.Signal;
        public moveOutDone: Phaser.Signal;
        public objectiveDone: Phaser.Signal;
        private moveTween: Phaser.Tween;
        private moveNormal: number;
        private cargoIndicator: CargoIndicator;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, Images.Wagon);
            this.anchor.setTo(0, 1);
            this.moveTween = null;
            this.moveAnim = 1;
            this.moveInDone = new Phaser.Signal();
            this.moveOutDone = new Phaser.Signal();
            this.objectiveDone = new Phaser.Signal();
            this.cargoIndicator = new CargoIndicator(this.game);
            this.cargoIndicator.wagonFilled.add(this.onWagonFilled, this);
            this.cargoIndicator.setRequestedCargo([CargoTypes.Circle, CargoTypes.Cube, CargoTypes.Triangle]);
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
            this.width = this.game.width;
            this.scale.y = this.scale.x;
            if (this.moveTween === null || this.moveTween.isRunning) {
                this.moveAnim = this.moveNormal;
            }
            this.cargoIndicator.resize();
        }

        public moveIn(): void {
            if (this.moveTween != null && this.moveTween.isRunning) {
                this.moveTween.stop();
                this.moveTween = null;
            }
            this.moveTween = this.game.add.tween(this).to({ moveAnim: 0 }, 1000, Phaser.Easing.Quadratic.InOut, true);
            this.moveTween.onComplete.addOnce(() => {
                this.moveInDone.dispatch(this);
            });
        }

        public moveOut(): void {
            if (this.moveTween != null && this.moveTween.isRunning) {
                this.moveTween.stop();
                this.moveTween = null;
            }
            this.moveTween = this.game.add.tween(this).to({ moveAnim: -1 }, 1000, Phaser.Easing.Quadratic.InOut, true);
        }

        public dropCargo(cargo: Cargo): void {
            this.cargoIndicator.dropCargo(cargo);
        }

        private get moveAnim(): number {
            return this.moveNormal;
        }

        private set moveAnim(value: number) {
            this.moveNormal = value;
            this.x = this.game.width * value;
        }

        public get type(): WagonTypes {
            return WagonTypes.NormalWagon;
        }
    }
}
