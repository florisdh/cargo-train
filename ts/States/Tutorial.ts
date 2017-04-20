module ExamAssignmentMA {
    export class Tutorial extends Phaser.State {

        public static Name: string = 'tutorial';
        public name: string = Tutorial.Name;
        public game: Phaser.Game;
        private tutorialBG: Phaser.Image;

        public init(): void {
            this.tutorialBG = new Phaser.Image(this.game, 0, 0, Images.TutorialBG);

            this.game.add.existing(this.tutorialBG);

            this.tutorialBG.inputEnabled = true;
            this.tutorialBG.events.onInputUp.addOnce(this.onClickedTutorialBG, this);
            this.resize();
        }

        private onClickedTutorialBG(): void {
            this.game.state.start(GamePlay.Name);
        }

        public resize(): void {
            this.tutorialBG.width = this.game.width;
            this.tutorialBG.height = this.game.height;
        }
    }
}
