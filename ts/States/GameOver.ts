module ExamAssignmentMA {
    /**
     * Gameover screen, showing the player the score he reached.
     */
    export class GameOver extends Phaser.State {

        public static Name: string = 'gameover';
        private scoreText: Phaser.Text;
        private scoreValueText: Phaser.Text;
        private background: Phaser.Image;
        private foreground: Phaser.Image;
        private retryButton: Phaser.Image;
        private screenFade: ScreenFade;
        private soundEffect: Phaser.Sound;

        /**
         * Adding all assets that are required for this state.
         * @param sessionData The data containing the score for the last session.
         */
        public init(sessionData: SessionData): void {
            this.background = new Phaser.Image(this.game, 0, 0, Images.GameOverBG);
            this.foreground = new Phaser.Image(this.game, 0, 0, Images.GameOverFG);
            this.scoreText = new Phaser.Text(this.game, 0, 0, 'SCORE');
            this.scoreValueText = new Phaser.Text(this.game, 0, 0, sessionData.currentMoney.toString());
            this.retryButton = new Phaser.Image(this.game, 0, 0, Images.RetryButton);

            this.game.add.existing(this.background);
            this.game.add.existing(this.foreground);
            this.game.add.existing(this.scoreText);
            this.game.add.existing(this.scoreValueText);
            this.game.add.existing(this.retryButton);

            this.foreground.anchor.setTo(0.5);

            this.retryButton.inputEnabled = true;
            this.retryButton.events.onInputDown.addOnce(this.onRetryDown, this);
            this.retryButton.events.onInputUp.addOnce(this.onRetryUp, this);

            this.scoreText.anchor.set(0.5, 0.5);
            this.scoreValueText.anchor.set(0.5, 0.5);
            this.retryButton.anchor.set(0.5, 0.5);

            this.screenFade = new ScreenFade(this.game);
            this.add.existing(this.screenFade);

            this.resize();
            this.screenFade.fadeOut();

            this.soundEffect = this.soundEffect = this.game.add.sound(Sounds.GameOver, 2, false);
            this.soundEffect.play();
        }

        private onRetryDown(): void {
            this.retryButton.tint = 0xCCCCCC;
        }

        private onRetryUp(): void {
            this.retryButton.inputEnabled = false;
            this.retryButton.tint = 0xFFFFFF;
            this.screenFade.fadeIn(() => {
                this.game.state.start(GamePlay.Name);
            });
        }

        /**
         * Resizes all elements based on the screen size.
         */
        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;

            this.foreground.x = this.game.world.centerX;
            this.foreground.y = this.game.world.centerY;
            this.foreground.height = this.game.height;
            this.foreground.scale.x = this.foreground.scale.y;
            if (this.foreground.width > this.game.width * 0.95) {
                this.foreground.width = this.game.width * 0.95;
                this.foreground.scale.y = this.foreground.scale.x;
            }

            this.scoreText.fontSize = this.foreground.width * 0.125;
            this.scoreText.x = this.foreground.left + this.foreground.width * 0.5;
            this.scoreText.y = this.foreground.top + this.foreground.height * 0.12;

            this.scoreValueText.fontSize = this.foreground.width * 0.1;
            this.scoreValueText.x = this.foreground.left + this.foreground.width * 0.5;
            this.scoreValueText.y = this.foreground.top + this.foreground.height * 0.375;

            this.retryButton.x = this.foreground.left + this.foreground.width * 0.5;
            this.retryButton.y = this.foreground.top + this.foreground.height * 0.865;
            this.retryButton.width = this.foreground.width * 0.361;
            this.retryButton.scale.y = this.retryButton.scale.x;

            this.screenFade.resize();
        }
    }
}
