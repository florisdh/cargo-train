module ExamAssignmentMA {
    export class GamePlay extends Phaser.State {
        public static Name: string = 'gameplay';
        public name: string = GamePlay.Name;
        public game: Phaser.Game;

        private background: Phaser.Image;
        private timeIndicator: Timer;
        private train: Train;
        private cargo: CargoGrid;

        public init(): void {
            this.background = this.game.add.image(0, 0, Images.WhitePixel);
            this.train = new Train(this.game);

            this.cargo = new CargoGrid(this.game);
            this.timeIndicator = new Timer(this.game);
            this.game.add.existing(this.cargo);
            this.game.add.existing(this.timeIndicator);

            // Events
            this.timeIndicator.timeOut.addOnce(this.onTimeOut);

            this.resize();
            this.start();
        }

        private onTimeOut(): void {
            this.game.state.start(GameOver.Name, true);
        }

        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;

            this.train.resize();
            this.cargo.resize();
            this.timeIndicator.resize();
        }

        private start(): void {
            this.train.reset(2);
            this.train.start();
            this.cargo.spawnCargo([ CargoTypes.Circle ]);
        }
    }
}
