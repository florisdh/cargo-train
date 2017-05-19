module ExamAssignmentMA {
    /**
     * Handles the doors of the wagon it is on.
     */
    export class WagonDoors extends Phaser.Group {
        public closed: Phaser.Signal;
        private openTween: Phaser.Tween;
        private openNormal: number;
        private leftDoor: Phaser.Image;
        private rightDoor: Phaser.Image;

        constructor(game: Phaser.Game) {
            super(game);
            this.openNormal = 0;
            this.closed = new Phaser.Signal();
            this.leftDoor = this.game.add.image(0, 0, Images.LeftDoor, null, this);
            this.rightDoor = this.game.add.image(0, 0, Images.RightDoor, null, this);
            this.rightDoor.scale = this.leftDoor.scale;
            this.leftDoor.anchor.setTo(1, 1);
            this.rightDoor.anchor.setTo(0, 1);
        }

        /**
         * Opens both of the doors using a tween.
         */
        public open(): void {
            if (this.openTween && this.openTween.isRunning) {
                this.openTween.stop();
            }
            this.openTween = this.game.add.tween(this).to({ openAnim: 1 }, 500, Phaser.Easing.Quadratic.In, true);
        }

        /**
         * Closes both of the doors using a tween and calls the onClosed method.
         */
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

        /**
         * Resizes the doors relative to the wagon width, height and scale.
         */
        public resize(wagonWidth: number, wagonHeight: number): void {
            this.x = wagonWidth * 0.492;
            this.y = wagonHeight * -0.1;
            this.leftDoor.height = wagonHeight * 0.5;
            this.leftDoor.scale.x = this.leftDoor.scale.y;
            this.openAnim = this.openNormal;
        }

        private get openAnim(): number {
            return this.openNormal;
        }

        private set openAnim(value: number) {
            this.openNormal = value;
            this.rightDoor.x = this.leftDoor.width * 0.8 * value;
            this.leftDoor.x = -this.rightDoor.x;
        }
    }
}
