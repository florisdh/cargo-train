module ExamAssignmentMA {
    /**
     * The first wagon to be be added when a train spawns.
     */
    export class Locomotive extends Wagon {

        private machinistArmImg: Phaser.Image;
        private dialogGraphic: Phaser.Image;
        private hornTween: Phaser.Tween;
        private hornNormal: number;

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

            this.add(this.machinistArmImg, false, 0);
            this.addChild(this.dialogGraphic);

            this.hornNormal = 0;

            this.resize();
        }

        public resize(): void {
            super.resize();
            this.machinistArmImg.x = this.wagonImage.width * 0.6698;
            this.hornAnim = this.hornAnim;
            this.machinistArmImg.scale.setTo(this.wagonImage.scale.x);
            this.dialogGraphic.x = this.wagonImage.width * 0.775;
            this.dialogGraphic.y = -this.wagonImage.height * 0.58;
        }

        private horn(): void {
            if (this.hornTween && this.hornTween.isRunning) {
                this.hornTween.stop();
            }
            this.hornAnim = 0;
            this.hornTween = this.game.add.tween(this).to({ hornAnim: 1 }, 300, Phaser.Easing.Quadratic.InOut, true, 0, 1, true);
            this.hornTween.onComplete.addOnce(this.onHornComplete, this);
        }

        private onHornComplete(): void {
            this.objectiveDone.dispatch(this);
        }

        private onMoveInDone(): void {
            this.horn();
        }

        private get hornAnim(): number {
            return this.hornNormal;
        }

        private set hornAnim(value: number) {
            this.hornNormal = value;
            this.machinistArmImg.y = -this.wagonImage.height * (0.59 - 0.05 * value);
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.Locomotive;
        }
    }
}
