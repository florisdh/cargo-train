module ExamAssignmentMA {
    /**
     * The indicator showing the amount of wagons there still are to be done this round.
     */
    export class WagonIndicator extends Phaser.Group {

        private indicatorImage: Phaser.Image;
        private lastText: Phaser.Text;
        private nextText: Phaser.Text;
        private textMask: Phaser.Graphics;
        private moveNextNormal: number;
        private moveNextTween: Phaser.Tween;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.indicatorImage = this.game.add.image(0, 0, Images.WagonIndicator);
            this.indicatorImage.anchor.setTo(0.5);
            let textStyle: any = {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'center',
                boundsAlignV: 'middle'
            };
            this.textMask = this.game.add.graphics(0, 0, this);
            this.lastText = this.game.add.text(0, 0, '0', textStyle);
            this.lastText.mask = this.textMask;
            this.nextText = this.game.add.text(0, 0, '0', textStyle);
            this.nextText.mask = this.textMask;
            this.add(this.indicatorImage);
            this.add(this.lastText);
            this.add(this.nextText);
            this.moveNextAnim = 0;
        }

        /**
         * Sets the amount to be shown on the indicator.
         * @param amount The amount of wagons still to be completed this round.
         */
        public setWagonAmount(amount: number): void {
            // Switch text components
            let current: Phaser.Text = this.nextText;
            this.nextText = this.lastText;
            this.lastText = current;

            this.nextText.text = amount.toString();

            if (this.moveNextTween && this.moveNextTween.isRunning) {
                this.moveNextTween.stop();
            }
            this.moveNextAnim = 0;
            this.moveNextTween = this.game.add.tween(this).to({ moveNextAnim: 1 }, 500, Phaser.Easing.Quadratic.In, true);
        }

        /**
         * Resizes all elements in this object.
         * @param y The y axis where the top ui elements should center to.
         */
        public resize(y: number): void {
            this.y = y;
            this.x = this.game.width * (1 - 0.11);
            this.indicatorImage.scale.setTo(this.game.width / 720);
            this.lastText.fontSize = this.nextText.fontSize = this.indicatorImage.width * 0.375;
            this.moveNextAnim = this.moveNextAnim;
            this.textMask.beginFill(0, 1);
            this.textMask.drawRect(-this.indicatorImage.width / 2, -this.indicatorImage.height * 0.4, this.indicatorImage.width, this.indicatorImage.height * 0.75);
            this.textMask.endFill();
        }

        private get moveNextAnim(): number {
            return this.moveNextNormal;
        }

        private set moveNextAnim(value: number) {
            this.moveNextNormal = value;
            this.lastText.setTextBounds(this.indicatorImage.left,
                this.indicatorImage.top + this.indicatorImage.height * -value,
                this.indicatorImage.width,
                this.indicatorImage.height);
            this.nextText.setTextBounds(this.indicatorImage.left,
                this.indicatorImage.top + this.indicatorImage.height * (1 - value),
                this.indicatorImage.width,
                this.indicatorImage.height);
        }
    }
}
