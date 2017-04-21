module ExamAssignmentMA {
    /**
     * The factory creating wagons based on the type given.
     */
    export class WagonFactory {

        private game: Phaser.Game;

        /**
         * @param game The active game instance where the wagons should be added to.
         */
        constructor(game: Phaser.Game) {
            this.game = game;
        }

        /**
         * Creates a wagon based on the given type.
         * @param type The type of wagon to create.
         */
        public getWagon(type: WagonTypes): Wagon {
            let wagon: Wagon = null;
            switch (type) {
                case WagonTypes.Locomotive:
                    wagon = new Locomotive(this.game);
                    break;
                case WagonTypes.CargoWagon:
                    wagon = new CargoWagon(this.game);
                    break;
                case WagonTypes.Caboose:
                    wagon = new Caboose(this.game);
                    break;
                default:
                    break;
            }
            return wagon;
        }
    }
}
