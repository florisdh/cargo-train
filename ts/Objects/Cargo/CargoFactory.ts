module ExamAssignmentMA {
    /**
     * The factory creating cargo based on the type given.
     */
    export class CargoFactory {

        private game: Phaser.Game;

        /**
         * @param game The active game instance where the cargo should be added to.
         */
        constructor(game: Phaser.Game) {
            this.game = game;
        }

        /**
         * Creates cargo based on the given type.
         * @param type The type of cargo to create.
         */
        public getCargo(type: CargoTypes): Cargo {
            return new Cargo(this.game, type);
        }
    }
}
