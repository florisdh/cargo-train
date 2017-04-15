module ExamAssignmentMA {
    export class Timer extends Phaser.Group {

        public timeOut: Phaser.Signal;
        private timerMask: Phaser.Graphics;
        private timeContainer: Phaser.Image;
        private timeFill: Phaser.Image;
        private timeTotal: number;
        private timeLeft: number;

        constructor(game: Phaser.Game) {
            super(game);

            this.timeOut = new Phaser.Signal();
            this.timerMask = new Phaser.Graphics(game);
            this.timeContainer = new Phaser.Image(game, 0, 0, Images.TimeContainer);
            this.timeContainer.anchor.setTo(0.5, 0.5);
            this.timeFill = new Phaser.Image(game, 0, 0, Images.TimeFill);
            this.timeFill.anchor.setTo(0.5, 0.5);

            this.add(this.timeContainer);
            this.add(this.timeFill);
            this.add(this.timerMask);

            this.timerMask.beginFill(0, 0);
            this.timerMask.drawRect(0, 0, 1, 1);
            this.timerMask.endFill();

            this.timeFill.mask = this.timerMask;

            // Debug time
            this.setTime(10000);
        }

        public setTime(time: number): void {
            this.timeTotal = time;
            this.timeLeft = time;
        }

        public update(): void {
            if (this.timeLeft > 0) {
                this.timeLeft -= this.game.time.elapsed;
                this.timerMask.scale.set(this.timeFill.width * (this.timeLeft / this.timeTotal), this.timeFill.height);

                if (this.timeLeft <= 0) {
                    this.timeOut.dispatch();
                }
            }
        }

        public resize(): void {
            this.x = this.game.width / 2;
            this.y = this.game.height * 0.05;
            this.scale.setTo(this.game.width / 720);
            this.timerMask.scale.set(this.timeFill.width * (this.timeLeft / this.timeTotal), this.timeFill.height);
            this.timerMask.x = this.timeFill.left;
            this.timerMask.y = this.timeFill.top;
        }

    }
}
