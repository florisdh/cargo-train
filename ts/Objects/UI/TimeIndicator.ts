module ExamAssignmentMA {
    /**
     * The indicator displaying the amount of time left for the current wagon.
     */
    export class TimeIndicator extends Phaser.Group {

        private readonly damageAnimTime: number = 500;
        private readonly damageAnimDelay: number = 200;

        public timeOut: Phaser.Signal;
        private timeContainer: Phaser.Image;
        private damageMask: Phaser.Graphics;
        private damageFill: Phaser.Image;
        private timeMask: Phaser.Graphics;
        private timeFill: Phaser.Image;
        private timeTotal: number;
        private timeLeft: number;
        private started: boolean;
        private damageLeft: number;
        private damageTween: Phaser.Tween;
        private glowTween: Phaser.Tween;
        private soundEffect: Phaser.Sound;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);

            this.timeOut = new Phaser.Signal();
            this.timeContainer = new Phaser.Image(game, 0, 0, Images.TimeContainer);
            this.timeContainer.anchor.setTo(0.5, 0.5);

            this.timeMask = new Phaser.Graphics(game);
            this.timeFill = new Phaser.Image(game, 0, 0, Images.TimeFill);
            this.timeFill.anchor.setTo(0.5, 0.5);
            this.timeFill.tint = 0x55EE55;

            this.damageMask = new Phaser.Graphics(game);
            this.damageFill = new Phaser.Image(game, 0, 0, Images.TimeFill);
            this.damageFill.anchor.setTo(0.5, 0.5);
            this.damageFill.tint = 0xFF0000;
            this.damageLeft = 0;

            this.add(this.timeContainer);
            this.add(this.damageFill);
            this.add(this.damageMask);
            this.add(this.timeFill);
            this.add(this.timeMask);

            this.timeMask.beginFill(0, 0);
            this.timeMask.drawRect(0, 0, 1, 1);
            this.timeMask.endFill();
            this.timeFill.mask = this.timeMask;

            this.damageMask.beginFill(0, 0);
            this.damageMask.drawRect(0, 0, 1, 1);
            this.damageMask.endFill();
            this.damageFill.mask = this.damageMask;
            this.damageMask.position = this.timeMask.position;

            this.started = false;
            this.timeTotal = this.timeLeft = 1;

            this.soundEffect = this.game.add.sound(Sounds.TimeLow, 1, true);
        }

        /**
         * Starts the timer to decrease automatically.
         * @param time The total time it will take to empty the entire bar.
         */
        public start(time: number): void {
            // TODO: fade in
            this.started = true;
            this.timeTotal = this.timeLeft = time;
            this.timeFill.alpha = 1;
        }

        /**
         * Stops the timer.
         */
        public stop(): void {
            // TODO: fade out
            this.started = false;
            if (this.glowTween && this.glowTween.isRunning) {
                this.glowTween.stop();
            }
        }

        /**
         * Automatically decreases the time.
         */
        public update(): void {
            if (this.started && this.timeLeft > 0 && !this.damageTween) {
                this.timeLeft -= this.game.time.elapsed;
                this.scaleMasks();

                if (this.timeLeft <= 0) {
                    this.soundEffect.stop();
                    this.timeOut.dispatch();
                    return;
                }

                let leftScalar: number = this.timeLeft / this.timeTotal;
                if (leftScalar <= 0.5) {
                    //let amount: number = 1 - Math.max(0, scale - 0.25) / (0.4 - 0.25);
                    //this.timeFill.tint = Phaser.Color.interpolateColor(0x55EE55, 0xFF0000, 1.01, amount);

                    if (!this.glowTween) {
                        this.timeFill.alpha = 1;
                        this.glowTween = this.game.add.tween(this.timeFill).to({ alpha: 0.7 }, 500, Phaser.Easing.Quadratic.InOut, true, 0, 0, true);
                        this.glowTween.loop(true);
                        this.soundEffect.play();
                    }
                } else if (this.glowTween) {
                    this.glowTween.stop();
                    this.glowTween = null;
                    this.timeFill.alpha = 1;
                    this.soundEffect.stop();
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
            this.timeMask.x = this.timeFill.left;
            this.timeMask.y = this.timeFill.top;
            this.scaleMasks();
        }

        private scaleMasks(): void {
            this.timeMask.scale.set(this.timeFill.width * (this.timeLeft / this.timeTotal), this.timeFill.height);
        }

        /**
         * Calculates the damage, applies it and shows the visual damage feedback using a tween.
         * @param damage The amount of damage
         */
        public damageTime(damage: number): void {
            if (this.timeLeft <= 0) {
                return;
            }

            damage = damage + this.damageAnimTime + this.damageAnimDelay;
            this.timeLeft -= damage;
            this.damageAnim = this.damageLeft + damage;
            this.scaleMasks();

            if (this.damageTween && this.damageTween.isRunning) {
                this.damageTween.stop();
            }
            this.damageTween = this.game.add.tween(this).to({ damageAnim: 0 }, this.damageAnimTime, Phaser.Easing.Linear.None, true, 200);
            this.damageTween.onComplete.addOnce(() => {
                this.damageMask.scale.set(0, 0);
                if (this.timeLeft <= 0) {
                    this.timeOut.dispatch();
                }
                this.damageTween = null;
            });
        }

        private get damageAnim(): number {
            return this.damageLeft;
        }

        private set damageAnim(value: number) {
            this.damageLeft = value;
            this.damageMask.scale.set(this.damageFill.width * ((this.timeLeft + this.damageLeft) / this.timeTotal), this.damageFill.height);
        }

        /**
         * The total time on this indicator.
         */
        public get totalTime(): number {
            return this.timeTotal;
        }

        /**
         * The time left on this indicator.
         */
        public get remainingTime(): number {
            return this.timeLeft;
        }
    }
}
