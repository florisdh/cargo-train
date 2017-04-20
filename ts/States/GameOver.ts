module ExamAssignmentMA {
    export class GameOver extends Phaser.State {

        public static Name: string = 'gameover';
        public name: string = GameOver.Name;
        public game: Phaser.Game;
        private scoreText: Phaser.Text;
        private scoreValueText: Phaser.Text;
        private gameOverImg: Phaser.Image;
        private retryButton: Phaser.Image;

        public init(sessionData: SessionData): void {
            this.gameOverImg = new Phaser.Image(this.game, 0, 0, Images.GameOverBG);
            this.scoreText = new Phaser.Text(this.game, 0, 0, 'SCORE');
            this.scoreValueText = new Phaser.Text(this.game, 0, 0, sessionData.score.toString());
            this.retryButton = new Phaser.Image(this.game, 0, 0, Images.RetryButton);

            this.game.add.existing(this.gameOverImg);
            this.game.add.existing(this.scoreText);
            this.game.add.existing(this.scoreValueText);
            this.game.add.existing(this.retryButton);

            this.retryButton.inputEnabled = true;
            this.retryButton.events.onInputUp.addOnce(this.onClickedRetry, this);

            this.scoreText.anchor.set(0.5, 0.5);
            this.scoreValueText.anchor.set(0.5, 0.5);
            this.retryButton.anchor.set(0.5, 0.5);

            this.resize();
        }

        private onClickedRetry(): void {
            this.game.state.start(GamePlay.Name);
        }

        public setScore(amount: number): void {
            this.scoreValueText.text = amount.toString();
        }

        public resize(): void {
            this.gameOverImg.width = this.game.width;
            this.gameOverImg.height = this.game.height;

            this.scoreText.fontSize = this.game.width * 0.125;
            this.scoreText.x = this.game.width * 0.5;
            this.scoreText.y = this.game.height * 0.175;

            this.scoreValueText.fontSize = this.game.width * 0.1;
            this.scoreValueText.x = this.game.width * 0.5;
            this.scoreValueText.y = this.game.height * 0.4;

            this.retryButton.x = this.game.width * 0.5;
            this.retryButton.y = this.game.height * 0.815;
            this.retryButton.width = this.game.width * 0.361;
            this.retryButton.scale.y = this.retryButton.scale.x;
        }

    }
}
