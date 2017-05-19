module ExamAssignmentMA {
    /**
     * The first wagon to be be added when a train spawns.
     */
    export class Locomotive extends Wagon {

        private machinistArmImg: Phaser.Image;
        private dialogGraphic: Phaser.Image;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game, Images.Locomotive);
            this.moveInDone.addOnce(this.onMoveInDone, this);

            this.machinistArmImg = this.game.add.image(0, 0, Images.MachinistArm);
            this.machinistArmImg.anchor.set(0.5, 0.5);

            this.dialogGraphic = this.game.add.image(0, 0, Images.DialogCloud);
            this.dialogGraphic.anchor.set(1, 0);

            this.addChild(this.machinistArmImg);
            this.addChild(this.dialogGraphic);  // Currently disabled, waiting for new Dialog graphic

            this.resize();
        }

        public resize(): void {
            this.machinistArmImg.x = this.width * 0.672;
            this.machinistArmImg.y = -(this.height * 0.58);
            this.dialogGraphic.x = this.width * 0.775;
            this.dialogGraphic.y = -(this.height * 0.58);
        }

        private timer: Phaser.Timer;

        private onMoveInDone(): void {
            // Show IP, etc
            this.timer = new Phaser.Timer(this.game, true);
            this.timer.onComplete.addOnce(() => {
                this.objectiveDone.dispatch(this);
            });
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.Locomotive;
        }
    }
}
