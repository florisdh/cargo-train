module ExamAssignmentMA {
    /**
     * The tutorial shown in game, shown when the player idles too long.
     */
    export class IngameTutorial extends Phaser.Group {

        private readonly inactivityDelay: number = 4000;
        private inactivityTimer: Phaser.TimerEvent;
        private activeWagon: Wagon;
        private activeGrid: CargoGrid;
        private tutorialHand: Phaser.Image;
        private handTween: Phaser.Tween;
        private handTimeout: Phaser.TimerEvent;
        private handNormal: number;
        private handTargetCargo: Cargo;

        constructor(game: Phaser.Game) {
            super(game);
            this.activeWagon = null;
            this.tutorialHand = this.game.add.image(0, 0, Images.TutorialHandActive, null, this);
            this.tutorialHand.anchor.setTo(0.1, 0);
            this.tutorialHand.rotation = -Math.PI / 8;
            this.tutorialHand.alpha = 0;
            this.handNormal = 0;
        }

        /**
         * Set the active wagon to use for the tutorial.
         * @param wagon The wagon to use.
         */
        public setActiveWagon(wagon: Wagon): void {
            this.activeWagon = wagon;
            this.stopIdleCheck();
            if (wagon && wagon.type === WagonTypes.CargoWagon) {
                wagon.moveInDone.addOnce(this.resetIdleCheck, this);
            }
        }

        /**
         * Set the active grid of cargo to use for the tutorial.
         * @param grid The grid to use.
         */
        public setActiveGrid(grid: CargoGrid): void {
            this.activeGrid = grid;
        }

        /**
         * Stops the current delay and starts the check again if the wagon and grid are specified.
         */
        public resetIdleCheck(): void {
            this.stopIdleCheck();
            if (this.activeWagon && this.activeWagon.type === WagonTypes.CargoWagon && this.activeGrid) {
                this.inactivityTimer = this.game.time.events.add(this.inactivityDelay, this.idleTimedOut, this);
            }
            this.stopTutorialHand();
        }

        private stopIdleCheck(): void {
            if (this.inactivityTimer) {
                this.game.time.events.remove(this.inactivityTimer);
                this.inactivityTimer = null;
            }
        }

        private idleTimedOut(): void {
            this.startTutorialHand();
        }

        private startTutorialHand(): void {
            this.stopTutorialHand();
            this.handTargetCargo = this.activeGrid.getCargo((<CargoWagon>this.activeWagon).nextCargoType);
            if (!this.handTargetCargo) {
                console.log('failed to find cargo type');
                return;
            }
            this.handAnimation = 0;
            this.handDown = false;
            this.handTween = this.game.add.tween(this.tutorialHand).to({ alpha: 0.9 }, 500, Phaser.Easing.Quadratic.In, true);
            this.handTween.onComplete.addOnce(() => {
                this.handTimeout = this.game.time.events.add(500, () => {
                    this.handDown = true;
                });
                this.handTween = this.game.add.tween(this).to({ handAnimation: 1 }, 1000, Phaser.Easing.Quadratic.InOut, true, 1000);
                this.handTween.onComplete.addOnce(() => {
                    this.handDown = false;
                    this.handTween = this.game.add.tween(this.tutorialHand).to({ alpha: 0 }, 500, Phaser.Easing.Quadratic.In, true, 500);
                });
            });
        }

        private stopTutorialHand(): void {
            if (this.handTween && this.handTween.isRunning) {
                this.handTween.stop();
            }
            if (this.handTimeout) {
                this.game.time.events.remove(this.handTimeout);
            }
            this.tutorialHand.alpha = 0;
        }

        /**
         * Resizes all game elements based on the screen size.
         */
        public resize(): void {
            // Do some resizing
        }

        private get handAnimation(): number {
            return this.handNormal;
        }

        private set handAnimation(value: number) {
            this.handNormal = value;
            let start: Phaser.Point = <Phaser.Point>this.handTargetCargo.worldPosition;
            let offset: Phaser.Point = new Phaser.Point(this.activeWagon.centerX - start.x, this.activeWagon.y + this.activeWagon.height * 0.8 - start.y);
            this.tutorialHand.position.setTo(start.x + offset.x * value, start.y + offset.y * value);
        }

        private set handDown(value: boolean) {
            this.tutorialHand.loadTexture(value ? Images.TutorialHandActive : Images.TutorialHandIdle);
        }
    }
}
