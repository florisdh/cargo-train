module ExamAssignmentMA {
    /**
     * The tutorial shown in game, shown when the player idles too long.
     */
    export class IngameTutorial extends Phaser.Group {

        private readonly inactivityDelay: number = 6000;
        private inactivityTimer: Phaser.TimerEvent;
        private activeWagon: Wagon;
        private activeGrid: CargoGrid;

        constructor(game: Phaser.Game) {
            super(game);
            this.activeWagon = null;
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
        }

        private stopIdleCheck(): void {
            if (this.inactivityTimer) {
                this.game.time.events.remove(this.inactivityTimer);
                this.inactivityTimer = null;
            }
        }

        private idleTimedOut(): void {
            console.log('tutorial should be shown now');
        }

        /**
         * Resizes all game elements based on the screen size.
         */
        public resize(): void {
            // Do some resizing
        }
    }
}
