module ExamAssignmentMA {
    /**
     * Tutorial screen, showing the player how the game works.
     */
    export class Tutorial extends Phaser.State {

        public static Name: string = 'tutorial';
        private tutorialFrame1: Phaser.Image;
        private tutorialFrame2: Phaser.Image;
        private screenFade: ScreenFade;

        /**
         * Adding all assets that are required for this state.
         */
        public init(): void {
            this.tutorialFrame1 = this.game.add.image(0, 0, Images.TutorialFrame1);
            this.tutorialFrame1.events.onInputUp.addOnce(() => { this.onClickedFrame(1); }, this);
            this.tutorialFrame1.inputEnabled = false;

            this.tutorialFrame2 = this.game.add.image(0, 0, Images.TutorialFrame2);
            this.tutorialFrame2.events.onInputUp.addOnce(() => { this.onClickedFrame(2); }, this);
            this.tutorialFrame2.inputEnabled = false;
            this.tutorialFrame2.alpha = 0;

            this.screenFade = new ScreenFade(this.game);
            this.game.add.existing(this.screenFade);
            this.screenFade.fadeOut(() => {
                this.tutorialFrame1.inputEnabled = true;
            });

            this.resize();
        }

        private onClickedFrame(frame: number): void {
            if (frame === 1) {
                this.tutorialFrame1.inputEnabled = false;
                this.screenFade.fadeIn(() => {
                    this.tutorialFrame1.kill();
                    this.tutorialFrame2.alpha = 1;
                    this.screenFade.fadeOut(() => { this.tutorialFrame2.inputEnabled = true; });
                });
            } else if (frame === 2) {
                this.tutorialFrame2.inputEnabled = false;
                this.screenFade.fadeIn(() => {
                    this.tutorialFrame2.kill();
                    this.game.state.start(GamePlay.Name);
                });
            }
        }

        /**
         * Scaling all assets in this state based on the screen size.
         */
        public resize(): void {
            this.tutorialFrame1.width = this.game.width;
            this.tutorialFrame1.height = this.game.height;
            this.tutorialFrame2.width = this.game.width;
            this.tutorialFrame2.height = this.game.height;

            this.screenFade.resize();
        }
    }
}
