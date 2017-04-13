module ExamAssignmentMA {
    export class CargoFactory {
        private game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        public getCargo(type: CargoTypes): Cargo {
            return new Cargo(this.game, type);
        }
    }
}
