module ExamAssignmentMA {
    export class WagonFactory {
        private game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        public getWagon(type: WagonTypes): Wagon {
            let wagon: Wagon = null;
            switch (type) {
                case WagonTypes.Locomotive:
                    wagon = new Locomotive(this.game);
                    break;
                case WagonTypes.NormalWagon:
                    wagon = new Wagon(this.game);
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
