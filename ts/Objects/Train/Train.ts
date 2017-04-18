module ExamAssignmentMA {
    export class Train extends Phaser.Group {
        public wagonAdded: Phaser.Signal;
        private readonly dropMarginNormal: number = 0.1;
        private factory: WagonFactory;
        private wagons: Wagon[];
        private wagonCounter: number;
        //TO DO: FIX MISSPELLING
        private trianLength: number;

        constructor(game: Phaser.Game) {
            super(game);
            this.wagonAdded = new Phaser.Signal();
            this.factory = new WagonFactory(this.game);
            this.wagons = [];
            this.wagonCounter = 0;
            this.trianLength = 0;
        }

        public start(): void {
            this.spawnNext();
        }

        private spawnNext(): Wagon {
            let type: WagonTypes = WagonTypes.CargoWagon;
            if (this.wagonCounter === 0) {
                type = WagonTypes.Locomotive;
            } else if (this.wagonCounter === this.trianLength + 1) {
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

        public removeWagon(wagon: Wagon): void {
            let index: number = this.wagons.indexOf(wagon);
            if (index >= 0) {
                this.remove(wagon);
                this.wagons.splice(index, 1);
            }
        }

        public reset(maxLength: number): void {
            for (let i: number = 0; i < this.wagons.length; i++) {
                this.remove(this.wagons[i]);
            }
            this.wagons = [];
            this.wagonCounter = 0;
            this.trianLength = maxLength;
        }

        public isOnDropPoint(point: Phaser.Point): boolean {
            let activeWagon: Wagon = this.activeWagon;
            return point.x > this.x + activeWagon.left + activeWagon.width * this.dropMarginNormal &&
                point.x < this.x + activeWagon.left + activeWagon.width * (1 - this.dropMarginNormal) &&
                point.y > this.y + activeWagon.top + activeWagon.height * this.dropMarginNormal &&
                point.y < this.y + activeWagon.top + activeWagon.height * (1 - this.dropMarginNormal);
        }

        public resize(): void {
            for (let i: number = 0; i < this.wagons.length; i++) {
                this.wagons[i].resize();
            }
        }

        public get activeWagon(): Wagon {
            return this.wagons[this.wagons.length - 1];
        }

        public get trainLength(): number {
            return this.trianLength;
        }
    }
}
