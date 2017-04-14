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
            // Pivots
            this.background.anchor.set(0.5, 1);
            this.platform.anchor.set(0.5, 0);

            this.resize();
            this.start();
        }

        private onCargoDropped(cargo: Cargo): void {
            if (this.train.isOnDropPoint(<Phaser.Point>cargo.worldPosition)) {
                this.train.activeWagon.dropCargo(cargo);
            } else {
                cargo.moveBack();
            }
        }

        private onTimeOut(): void {
            this.game.state.start(GameOver.Name, true);
        }

        public resize(): void {
            // Background positioning
            this.background.y = this.game.height * 0.35;
            this.background.x = this.game.width * 0.5;
            // Background height scaling
            this.background.height = this.game.height * 0.35;
            this.background.scale.x = this.background.scale.y;
            // Background width scaling
            if (this.background.width < this.game.width) {
                this.background.width = this.game.width;
                this.background.scale.y = this.background.scale.x;
            }

            // Platform positioning
            this.platform.y = this.background.bottom;
            this.platform.x = this.game.width * 0.5;
            // Platform height scaling
            this.platform.height = this.game.height * 0.65;
            this.platform.scale.x = this.platform.scale.y;
            // Platform width scaling
            if (this.platform.width < this.game.width) {
                this.platform.width = this.game.width;
                this.platform.scale.y = this.platform.scale.x;
            }

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
