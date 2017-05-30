module ExamAssignmentMA {
    /**
     * The last wagon on the train.
     */
    export class Caboose extends Wagon {

        private waitTimer: Phaser.TimerEvent;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game, Images.Caboose);
            this.moveInDone.addOnce(this.onMoveInDone, this);
            //this.easeIn = Phaser.Easing.Linear.None;
            this.easeOut = Phaser.Easing.Linear.None;
            this.resize();
        }

        private onMoveInDone(): void {
            // Timer
            if (this.waitTimer) {
                this.game.time.events.remove(this.waitTimer);
                this.waitTimer = null;
            }
            this.waitTimer = this.game.time.events.add(1000, this.timerDone, this);
        }

        private timerDone(): void {
            this.objectiveDone.dispatch(this);
            if (this.waitTimer) {
                this.game.time.events.remove(this.waitTimer);
                this.waitTimer = null;
            }
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.Caboose;
        }
    }
}
