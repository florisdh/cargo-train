module ExamAssignmentMA {
    export class Timer extends Phaser.Group {

        private timeContainer: Phaser.Image;
        private timeFill: Phaser.Image;

        constructor(game: Phaser.Game) {
            super(game);

            this.timeContainer = new Phaser.Image(game, 0, 0, Images.TimeContainer);
            this.timeContainer.anchor.setTo(0.5, 0.5);
            this.timeFill = new Phaser.Image(game, 0, 0, Images.TimeFill);
            this.timeFill.anchor.setTo(0.5, 0.5);

            this.add(this.timeContainer);
            this.add(this.timeFill);
            
            // Debug time
            this.setTime(5000);
        }

        public setTime(time: number): void {
            
        }

        public update(): void {
            
        }

        public resize(): void {
            this.x = this.game.width / 2;
            this.y = this.game.height * 0.05;
        }

    }
}
