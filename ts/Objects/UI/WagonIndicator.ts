module ExamAssignmentMA {
    /**
     * The indicator showing the amount of wagons there still are to be done this round.
     */
    export class WagonIndicator extends Phaser.Group {

        private indicatorImage: Phaser.Image;
        private indicatorText: Phaser.Text;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.indicatorImage = new Phaser.Image(this.game, 0, 0, Images.WagonIndicator);
            this.indicatorImage.anchor.setTo(0.5);
            this.indicatorText = new Phaser.Text(this.game, 0, 0, '0', {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'center',
                boundsAlignV: 'middle'
            });
            this.add(this.indicatorImage);
            this.add(this.indicatorText);
        }

        /**
         * Sets the amount to be shown on the indicator.
         * @param amount The amount of wagons still to be completed this round.
         */
        public setWagonAmount(amount: number): void {
            this.indicatorText.text = amount.toString();
        }

        /**
         * Resizes all elements in this object.
         * @param y The y axis where the top ui elements should center to.
         */
        public resize(y: number): void {
            this.y = y;
            this.x = this.game.width * 0.11;
            this.indicatorImage.scale.setTo(this.game.width / 720);
            this.indicatorText.fontSize = this.indicatorImage.width * 0.5;
            this.indicatorText.setTextBounds(this.indicatorImage.left,
                this.indicatorImage.top,
                this.indicatorImage.width,
                this.indicatorImage.height);
        }
    }
}
