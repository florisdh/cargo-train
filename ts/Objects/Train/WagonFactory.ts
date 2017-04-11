module ExamAssignmentMA {
    export class WagonFactory {
        private game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        public getWagon(type: WagonTypes): Wagon {
            // Todo: return specific wagon based on type
            return new Wagon(this.game);
        }
    }
}
