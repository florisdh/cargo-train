module ExamAssignmentMA {
    export class Locomotive extends Wagon {
        constructor(game: Phaser.Game) {
            super(game);
        }

        public get type(): WagonTypes {
            return WagonTypes.Locomotive;
        }
    }
}
