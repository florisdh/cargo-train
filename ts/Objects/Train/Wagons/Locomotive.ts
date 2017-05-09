module ExamAssignmentMA {
    /**
     * The first wagon to be be added when a train spawns.
     */
    export class Locomotive extends Wagon {

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game, Images.Wagon);
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
            return WagonTypes.Locomotive;
        }
    }
}
