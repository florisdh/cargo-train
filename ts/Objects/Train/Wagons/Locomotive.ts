module ExamAssignmentMA {
    /**
     * The first wagon to be be added when a train spawns.
     */
    export class Locomotive extends Wagon {

        private machinistArmImg: Phaser.Image;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game, Images.Locomotive);
            this.moveInDone.addOnce(this.onMoveInDone, this);
            this.machinistArmImg = this.game.add.image(0, 0, Images.MachinistArm);

            this.resize();
        }

        public resize(): void {
            this.machinistArmImg.x = this.width * 0.6;
            this.machinistArmImg.y = this.height * 0.55;
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
