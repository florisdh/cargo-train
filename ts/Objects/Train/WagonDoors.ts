module ExamAssignmentMA {
    export class WagonDoors extends Phaser.Group {
        public closed: Phaser.Signal;
        private openTween: Phaser.Tween;
        private openNormal: number;
        private leftDoor: Phaser.Image;
        private rightDoor: Phaser.Image;
        private wagon: Wagon;

        constructor(game: Phaser.Game, wagon: Wagon) {
            super(game);
            this.wagon = wagon;
            this.openNormal = 0;
            this.closed = new Phaser.Signal();
            this.leftDoor = this.game.add.image(0, 0, Images.LeftDoor, null, this);
            this.rightDoor = this.game.add.image(0, 0, Images.RightDoor, null, this);
            this.rightDoor.scale = this.leftDoor.scale;
            this.leftDoor.anchor.setTo(1, 1);
            this.rightDoor.anchor.setTo(0, 1);
        }

        public open(): void {
            if (this.openTween && this.openTween.isRunning) {
                this.openTween.stop();
            }
            this.openTween = this.game.add.tween(this).to({ openAnim: 1 }, 500, Phaser.Easing.Quadratic.In, true);
        }

        public close(): void {
            if (this.openTween && this.openTween.isRunning) {
                this.openTween.stop();
            }
            this.openTween = this.game.add.tween(this).to({ openAnim: 0 }, 500, Phaser.Easing.Quadratic.In, true);
            this.openTween.onComplete.addOnce(this.onClosed, this);
        }

        private onClosed(): void {
            this.closed.dispatch();
        }

        public resize(): void {
            this.x = this.wagon.width * 0.492 / this.wagon.scale.x;
            this.y = this.wagon.height * -0.1 / this.wagon.scale.y;
            this.leftDoor.height = this.wagon.height * 0.5 / this.wagon.scale.y;
            this.leftDoor.scale.x = this.leftDoor.scale.y;
            this.openAnim = this.openNormal;
        }

        private get openAnim(): number {
            return this.openNormal;
        }

        private set openAnim(value: number) {
            this.openNormal = value;
            this.rightDoor.x = this.wagon.width * 0.1 * value / this.wagon.scale.x;
            this.leftDoor.x = -this.rightDoor.x;
        }
    }
}
