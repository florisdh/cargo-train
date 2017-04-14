module ExamAssignmentMA {
    export class Wagon extends Phaser.Image {
        public moveInDone: Phaser.Signal;
        public moveOutDone: Phaser.Signal;
        public objectiveDone: Phaser.Signal;
        private moveTween: Phaser.Tween;
        private moveNormal: number;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, Images.Wagon);
            this.moveTween = null;
            this.moveAnim = 1;
            this.moveInDone = new Phaser.Signal();
            this.moveOutDone = new Phaser.Signal();
            this.objectiveDone = new Phaser.Signal();

            this.inputEnabled = true;
            this.events.onInputUp.add(() => {
                this.objectiveDone.dispatch(this);
            });
        }

        public resize(): void {
            this.width = this.game.width;
            this.scale.y = this.scale.x;
            if (this.moveTween === null || this.moveTween.isRunning) {
                this.moveAnim = this.moveNormal;
            }
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
            // TODO: Check for active cargo goal
            // TODO: Push cargo back
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
