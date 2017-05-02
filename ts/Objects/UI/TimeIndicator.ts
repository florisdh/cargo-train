﻿module ExamAssignmentMA {
    /**
     * The indicator displaying the amount of time left for the current wagon.
     */
    export class TimeIndicator extends Phaser.Group {

        public timeOut: Phaser.Signal;
        private timerMask: Phaser.Graphics;
        private timeContainer: Phaser.Image;
        private timeFill: Phaser.Image;
        private timeTotal: number;
        private timeLeft: number;
        private started: boolean;

        /**
         * @param game The active game instance to be added to.
         */
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
            this.started = false;
            this.timeTotal = this.timeLeft = 1;
        }

        /**
         * Starts the timer to decrease automatically.
         * @param time The total time it will take to empty the entire bar.
         */
        public start(time: number): void {
            // TODO: fade in
            this.started = true;
            this.timeTotal = this.timeLeft = time;
        }

        /**
         * Stops the timer.
         */
        public stop(): void {
            // TODO: fade out
            this.started = false;
        }

        /**
         * Automatically decreases the time.
         */
        public update(): void {
            if (this.started && this.timeLeft > 0) {
                this.timeLeft -= this.game.time.elapsed;
                this.timerMask.scale.set(this.timeFill.width * (this.timeLeft / this.timeTotal), this.timeFill.height);

                if (this.timeLeft <= 0) {
                    this.timeOut.dispatch();
                }
            }
        }

        /**
         * Resizes all elements in this object.
         * @param y The y axis where the top ui elements should center to.
         */
        public resize(y: number): void {
            this.x = this.game.width / 2;
            this.y = y;
            this.scale.setTo(this.game.width / 720);
            this.timerMask.scale.set(this.timeFill.width * (this.timeLeft / this.timeTotal), this.timeFill.height);
            this.timerMask.x = this.timeFill.left;
            this.timerMask.y = this.timeFill.top;
        }
    }
}