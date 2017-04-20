module ExamAssignmentMA {
    export class WagonIndicator extends Phaser.Group {
        private indicatorImage: Phaser.Image;
        private indicatorText: Phaser.Text;

        constructor(game: Phaser.Game) {
            super(game);
            this.indicatorImage = new Phaser.Image(this.game, 0, 0, Images.WagonCounter);
            this.indicatorImage.anchor.setTo(0.5);
            this.indicatorText = new Phaser.Text(this.game, 0, 0, '0', {
                font: '30pt Arial',
                fill: '#791909',
                boundsAlignH: 'center',
                boundsAlignV: 'middle'
            });
            this.add(this.indicatorImage);
            this.add(this.indicatorText);
        }

        public setWagonAmount(amount: number): void {
            this.indicatorText.text = amount.toString();
        }

        public resize(y: number): void {
            this.x = this.y = y;
            this.indicatorImage.scale.setTo(this.game.width / 720);
            this.indicatorText.fontSize = this.indicatorImage.width * 0.55;
            this.indicatorText.setTextBounds(this.indicatorImage.left,
                this.indicatorImage.top,
                this.indicatorImage.width,
                this.indicatorImage.height);
        }
    }
}
