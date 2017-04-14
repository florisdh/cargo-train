module ExamAssignmentMA {
    export class GamePlay extends Phaser.State {

        public static Name: string = 'gameplay';
        public name: string = GamePlay.Name;
        public game: Phaser.Game;

        private background: Phaser.Image;
        private platform: Phaser.Image;
        private timeIndicator: Timer;
        private train: Train;
        private cargo: CargoGrid;

        public init(): void {
            this.background = this.game.add.image(0, 0, Images.Background_01);
            this.platform = this.game.add.image(0, 0, Images.Platform_01);

            this.train = new Train(this.game);
            this.cargo = new CargoGrid(this.game);
            this.cargo.cargoDropped.add(this.onCargoDropped, this);
            this.timeIndicator = new Timer(this.game);

            this.game.add.existing(this.cargo);
            this.game.add.existing(this.timeIndicator);

            // Events
            this.timeIndicator.timeOut.addOnce(this.onTimeOut);

            this.resize();
            this.start();
        }

        private onCargoDropped(cargo: Cargo, position: Phaser.Point): void {
            console.log('dropped on wagon', this.train.isOnDropPoint(position));
        }

        private onTimeOut(): void {
            this.game.state.start(GameOver.Name, true);
        }

        public resize(): void {
            this.background.width = this.game.width;
            this.background.scale.y = this.background.scale.x;

            this.platform.width = this.game.width;
            this.platform.scale.y = this.platform.scale.x;
            this.platform.y = 0.5 * this.game.height;

            this.train.resize();
            this.cargo.resize();
            this.timeIndicator.resize();
        }

        private start(): void {
            this.train.reset(2);
            this.train.start();
            this.cargo.spawnCargo([CargoTypes.Circle]);
        }
    }
}
