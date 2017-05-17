module ExamAssignmentMA {
    /**
     * Tutorial screen, showing the player how the game works.
     */
    export class Tutorial extends Phaser.State {

        public static Name: string = 'tutorial';
        private tutorialBG: Phaser.Image;
        private screenFade: ScreenFade;

        /**
         * Adding all assets that are required for this state.
         */
        public init(): void {
            this.tutorialBG = new Phaser.Image(this.game, 0, 0, Images.TutorialBG);
            this.tutorialBG.events.onInputUp.addOnce(this.onClickedTutorialBG, this);
            this.game.add.existing(this.tutorialBG);

            this.screenFade = new ScreenFade(this.game);
            this.game.add.existing(this.screenFade);
            this.resize();
            this.screenFade.fadeOut(() => {
                this.tutorialBG.inputEnabled = true;
            });
        }

        private onClickedTutorialBG(): void {
            this.tutorialBG.inputEnabled = false;
            this.screenFade.fadeIn(() => {
                this.game.state.start(GamePlay.Name);
            });
        }

        /**
         * Scaling all assets in this state based on the screen size.
         */
        public resize(): void {
            this.tutorialBG.width = this.game.width;
            this.tutorialBG.height = this.game.height;
            this.screenFade.resize();
        }
    }
}
