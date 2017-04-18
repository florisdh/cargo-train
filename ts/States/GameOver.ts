module ExamAssignmentMA {
    export class GameOver extends Phaser.State {

        public static Name: string = 'gameover';
        public name: string = GameOver.Name;
        public game: Phaser.Game;
        private scoreText: Phaser.Text;
        private gameOverImg: Phaser.Image;
        private touchOverlay: Phaser.Image;

        public init(sessionData: SessionData): void {
            this.gameOverImg = new Phaser.Image(this.game, 0, 0, Images.WhitePixel);
            this.scoreText = new Phaser.Text(this.game, 0, 0, sessionData.score.toString());
            this.touchOverlay = new Phaser.Image(this.game, 0, 0, Images.WhitePixel);

            this.game.add.existing(this.gameOverImg);
            this.game.add.existing(this.scoreText);
            this.game.add.existing(this.touchOverlay);

            this.touchOverlay.alpha = 0;
            this.touchOverlay.inputEnabled = true;
            this.touchOverlay.events.onInputUp.addOnce(this.onClickedTouchOverlay, this);

            this.scoreText.anchor.set(0.5, 0.5);

            this.resize();
        }

        public setScore(amount: number): void {
            this.scoreText.text = amount.toString();
        }

        public onClickedTouchOverlay(): void {
            this.game.state.start(GamePlay.Name);
        }

        public resize(): void {
            this.gameOverImg.width = this.game.width;
            this.gameOverImg.height = this.game.height;

            this.scoreText.fontSize = this.game.width * 0.1;
            this.scoreText.x = this.game.width * 0.5;
            this.scoreText.y = this.game.height * 0.5;

            this.touchOverlay.width = this.game.width;
            this.touchOverlay.height = this.game.height;

            console.log('resize gameover');
        }

    }
}
