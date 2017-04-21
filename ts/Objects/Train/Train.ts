module ExamAssignmentMA {
    /**
     * The train object, handing and containing all wagons.
     */
    export class Train extends Phaser.Group {

        public wagonAdded: Phaser.Signal;
        private readonly dropMarginNormal: number = 0.1;
        private factory: WagonFactory;
        private wagons: Wagon[];
        private wagonCounter: number;
        private trainLength: number;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.wagonAdded = new Phaser.Signal();
            this.factory = new WagonFactory(this.game);
            this.wagons = [];
            this.wagonCounter = 0;
            this.trainLength = 0;
        }

        /**
         * Starts the train to spawn the first wagons.
         */
        public start(): void {
            this.spawnNext();
        }

        private spawnNext(): Wagon {
            let type: WagonTypes = WagonTypes.CargoWagon;
            if (this.wagonCounter === 0) {
                type = WagonTypes.Locomotive;
            } else if (this.wagonCounter === this.trainLength + 1) {
                type = WagonTypes.Caboose;
            }
            let wagon: Wagon = this.factory.getWagon(type);
            wagon.objectiveDone.addOnce(this.wagonObjectiveDone, this);
            wagon.moveIn();
            this.wagons.push(wagon);
            this.add(wagon);
            this.wagonAdded.dispatch(wagon);
            this.wagonCounter++;
            return wagon;
        }

        private wagonObjectiveDone(wagon: Wagon): void {
            // Spawn next
            if (wagon.type !== WagonTypes.Caboose) {
                this.spawnNext();
            }

            // Move out
            wagon.moveOut();
            wagon.moveOutDone.addOnce(() => {
                this.removeWagon(wagon);
            });
        }

        private removeWagon(wagon: Wagon): void {
            let index: number = this.wagons.indexOf(wagon);
            if (index >= 0) {
                this.remove(wagon);
                this.wagons.splice(index, 1);
            }
        }

        /**
         * Resets the train and sets the amount of wagons.
         * @param maxLength The amount of wagons to be added. (excluding the locomotive and caboose)
         */
        public reset(maxLength: number): void {
            for (let i: number = 0; i < this.wagons.length; i++) {
                this.remove(this.wagons[i]);
            }
            this.wagons = [];
            this.wagonCounter = 0;
            this.trainLength = maxLength;
        }

        /**
         * Checks if the given global position is on the current wagons drop point.
         * @param point The global position to check at.
         */
        public isOnDropPoint(point: Phaser.Point): boolean {
            let activeWagon: Wagon = this.activeWagon;
            return point.x > this.x + activeWagon.left + activeWagon.width * this.dropMarginNormal &&
                point.x < this.x + activeWagon.left + activeWagon.width * (1 - this.dropMarginNormal) &&
                point.y > this.y + activeWagon.top + activeWagon.height * this.dropMarginNormal &&
                point.y < this.y + activeWagon.top + activeWagon.height * (1 - this.dropMarginNormal);
        }

        /**
         * Resizes all wagons relative to the screen size.
         */
        public resize(): void {
            for (let i: number = 0; i < this.wagons.length; i++) {
                this.wagons[i].resize();
            }
        }

        /**
         * Returns the active wagons.
         */
        public get activeWagon(): Wagon {
            return this.wagons[this.wagons.length - 1];
        }

        /**
         * Returns the amount of wagons in the current train.
         */
        public get totalWagons(): number {
            return this.trainLength;
        }
    }
}
