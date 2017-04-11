module ExamAssignmentMA {
    export class Train extends Phaser.Group {
        public wagonAdded: Phaser.Signal;
        private factory: WagonFactory;
        private wagons: Wagon[];
        private wagonCounter: number;
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

        public spawnNext(): Wagon {
            let type: WagonTypes = WagonTypes.NormalWagon;
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

        public resize(): void {
            for (let i: number = 0; i < this.wagons.length; i++) {
                this.wagons[i].resize();
            }
        }
    }
}
