module ExamAssignmentMA {
    /**
     * The last wagon on the train.
     */
    export class Caboose extends Wagon {

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game, Images.Caboose);
            this.moveInDone.addOnce(this.onMoveInDone, this);
            this.resize();
        }

        private onMoveInDone(): void {
            // Show IP, etc
            this.objectiveDone.dispatch(this);
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.Caboose;
        }
    }
}
