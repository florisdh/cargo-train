module ExamAssignmentMA {
    /**
     * The indicator showing the amount of wagons there still are to be done this round.
     */
    export class ScoreIndicator extends Phaser.Group {

        private indicatorImage: Phaser.Image;
        private text: Phaser.Text;
        private textMask: Phaser.Graphics;
        private hitNormal: number;
        private hitTween: Phaser.Tween;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.indicatorImage = this.game.add.image(0, 0, Images.ScoreIndicator);
            this.indicatorImage.anchor.setTo(0.5);
            let textStyle: any = {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'center',
                boundsAlignV: 'middle'
            };
            this.textMask = this.game.add.graphics(0, 0, this);
            this.text = this.game.add.text(0, 0, '0', textStyle);
            this.text.mask = this.textMask;
            this.add(this.indicatorImage);
            this.add(this.text);
            this.hitAnim = 0;
        }

        /**
         * Sets the amount to be shown on the indicator.
         * @param amount The amount of score you currently have.
         */
        public setScore(amount: number): void {
            this.text.text = amount.toString();

            if (this.hitTween && this.hitTween.isRunning) {
                this.hitTween.stop();
            }
            this.hitAnim = 0;
            this.hitTween = this.game.add.tween(this).to({ hitAnim: 1 }, 100, Phaser.Easing.Quadratic.InOut, true, 0, 0, true);
        }

        /**
         * Resizes all elements in this object.
         * @param y The y axis where the top ui elements should center to.
         */
        public resize(y: number): void {
            this.y = y;
            this.x = this.game.width * 0.11;
            this.indicatorImage.scale.setTo(this.game.width / 720);
            this.text.fontSize = this.indicatorImage.height * 0.6;
            this.hitAnim = this.hitAnim;
            this.text.setTextBounds(this.indicatorImage.left,
                this.indicatorImage.top,
                this.indicatorImage.width,
                this.indicatorImage.height * 1.15);
            this.textMask.beginFill(0, 1);
            this.textMask.drawRect(-this.indicatorImage.width / 2, -this.indicatorImage.height * 0.4, this.indicatorImage.width, this.indicatorImage.height * 0.75);
            this.textMask.endFill();
        }

        private get hitAnim(): number {
            return this.hitNormal;
        }

        private set hitAnim(value: number) {
            this.hitNormal = value;
            this.scale.setTo(1 + value * 0.05);
        }
    }
}
