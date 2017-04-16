module ExamAssignmentMA {
    export class Locomotive extends Wagon {
        constructor(game: Phaser.Game) {
            super(game);
            this.moveInDone.addOnce(this.onMoveInDone, this);
            this.resize();
        }

        private onMoveInDone(): void {
            // Show IP, etc
            this.objectiveDone.dispatch(this);
        }

        public get type(): WagonTypes {
            return WagonTypes.Locomotive;
        }
    }
}
