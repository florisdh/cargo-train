module ExamAssignmentMA {
    export class WagonIndicator extends Phaser.Group {
        private indicatorImage: Phaser.Image;
        private indicatorText: Phaser.Text;

        constructor(game: Phaser.Game) {
            super(game);
            this.indicatorImage = new Phaser.Image(this.game, 0, 0, Images.WagonCounter);
            this.indicatorImage.anchor.setTo(0.5, 0.5);
            this.indicatorText = new Phaser.Text(this.game, 0, 0, '0', { font: '30pt Arial', fill: '#791909'} );
            this.indicatorText.anchor.setTo(0.5, 0.5);
            this.add(this.indicatorImage);
            this.add(this.indicatorText);
        }

        public setWagonIndicator(currentWagonNumber: number): void {
            console.log(currentWagonNumber);
            this.indicatorText.setText(currentWagonNumber.toString());
        }

        public resize(timerX: number, timerY: number): void {
            this.indicatorImage.scale.setTo(this.game.width / 720);
            this.indicatorImage.x = timerX / 4.5;
            this.indicatorImage.centerY = timerY;
            this.indicatorText.x = this.indicatorImage.x;
            this.indicatorText.y = this.indicatorImage.y;
            this.indicatorText.fontSize = this.indicatorImage.width / 2;
        }
    }
}
