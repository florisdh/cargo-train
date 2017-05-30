module ExamAssignmentMA {
    /**
     * The base class of all wagons.
     */
    export class Wagon extends Phaser.Group {

        public moveInDone: Phaser.Signal;
        public moveOutDone: Phaser.Signal;
        public objectiveDone: Phaser.Signal;
        protected wagonImage: Phaser.Image;
        private moveTween: Phaser.Tween;
        private moveNormal: number;
        protected easeIn: Function = Phaser.Easing.Quadratic.InOut;
        protected easeOut: Function = Phaser.Easing.Quadratic.InOut;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game, image: string) {
            super(game);
            this.wagonImage = this.game.add.image(0, 0, image, null, this);
            this.wagonImage.anchor.setTo(0, 1);
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
            this.wagonImage.width = this.game.width;
            this.wagonImage.scale.y = this.wagonImage.scale.x;
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
            this.moveTween = this.game.add.tween(this).to({ moveAnim: 0 }, 1000, this.easeIn, true);
            this.moveTween.onComplete.addOnce(() => {
                this.moveInDone.dispatch(this);
            });
        }

        /**
         * Transitions the wagon out of the screen.
         * @param forceLinear If the move tween should be overwritten to use a linear tween.
         */
        public moveOut(forceLinear: boolean = false): void {
            if (this.moveTween != null && this.moveTween.isRunning) {
                this.moveTween.stop();
                this.moveTween = null;
            }
            this.moveTween = this.game.add.tween(this).to({ moveAnim: -1 }, 1000, forceLinear ? Phaser.Easing.Linear.None : this.easeOut, true);
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
