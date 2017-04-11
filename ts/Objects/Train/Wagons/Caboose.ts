module ExamAssignmentMA {
    export class Caboose extends Wagon {
        constructor(game: Phaser.Game) {
            super(game);
        }

        public get type(): WagonTypes {
            return WagonTypes.Caboose;
        }
    }
}
