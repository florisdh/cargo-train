module ExamAssignmentMA {
    /**
     * The base class of all wagons.
     */
    export class Wagon extends Phaser.Image {

        public moveInDone: Phaser.Signal;
        public moveOutDone: Phaser.Signal;
        public objectiveDone: Phaser.Signal;
        private moveTween: Phaser.Tween;
        private moveNormal: number;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game, 0, 0, Images.Wagon);
            this.anchor.setTo(0, 1);
            this.moveTween = null;
            this.moveAnim = 1;
            this.moveInDone = new Phaser.Signal();
            this.moveOutDone = new Phaser.Signal();
            this.objectiveDone = new Phaser.Signal();
        }

        /**
         * Resizes all elements in this object.
         */
        public resize(): void {
            this.width = this.game.width;
            this.scale.y = this.scale.x;
            if (this.moveTween === null || this.moveTween.isRunning) {
                this.moveAnim = this.moveNormal;
            }
        }

        /**
         * Transitions the wagon into the screen.
         */
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

        /**
         * Transitions the wagon out of the screen.
         */
        public moveOut(): void {
            if (this.moveTween != null && this.moveTween.isRunning) {
                this.moveTween.stop();
                this.moveTween = null;
            }
            this.moveTween = this.game.add.tween(this).to({ moveAnim: -1 }, 1000, Phaser.Easing.Quadratic.InOut, true);
            this.moveTween.onComplete.addOnce(() => {
                this.moveOutDone.dispatch(this);
            });
        }

        private get moveAnim(): number {
            return this.moveNormal;
        }

        private set moveAnim(value: number) {
            this.moveNormal = value;
            this.x = this.game.width * value;
        }

        protected get isIdle(): boolean {
            return this.moveTween === null || !this.moveTween.isRunning;
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.None;
        }
    }
}
