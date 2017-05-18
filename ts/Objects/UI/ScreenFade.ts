module ExamAssignmentMA {
    /**
     * A fullscreen fade from transparent to black or back.
     */
    export class ScreenFade extends Phaser.Image {

        private readonly fadeTime: number = 175;
        private fadeTween: Phaser.Tween;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, Images.WhitePixel);
            this.tint = 0x0;
            this.alpha = 0;
        }

        public fadeIn(callback: Function = null, context: any = null): void {
            this.stopFade();
            this.alpha = 0;
            this.fadeTween = this.game.add.tween(this).to({ alpha: 1 }, this.fadeTime, Phaser.Easing.Quadratic.In, true);
            if (callback) {
                this.fadeTween.onComplete.addOnce(callback, context);
            }
        }

        public fadeOut(callback: Function = null, context: any = null): void {
            this.stopFade();
            this.alpha = 1;
            this.fadeTween = this.game.add.tween(this).to({ alpha: 0 }, this.fadeTime, Phaser.Easing.Quadratic.Out, true);
            if (callback) {
                this.fadeTween.onComplete.addOnce(callback, context);
            }
        }

        private stopFade(): void {
            if (this.fadeTween && this.fadeTween.isRunning) {
                this.fadeTween.stop();
            }
        }

        public resize(): void {
            this.width = this.game.width;
            this.height = this.game.height;
        }
    }
}
