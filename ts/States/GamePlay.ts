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
            this.background.anchor.set(0.5, 1);

            this.platform = this.game.add.image(0, 0, Images.Platform_01);
            this.platform.anchor.set(0.5, 0);

            this.train = new Train(this.game);
            this.train.wagonAdded.add(this.onWagonAdded, this);

            this.cargo = new CargoGrid(this.game);
            this.cargo.cargoDropped.add(this.onCargoDropped, this);

            this.timeIndicator = new Timer(this.game);
            this.timeIndicator.timeOut.addOnce(this.onTimeOut);
            this.timeIndicator.timeOut.addOnce(this.onTimeOut);

            this.game.add.existing(this.timeIndicator);
            this.game.add.existing(this.cargo);

            this.resize();
            this.startRound();
        }

        private onWagonAdded(wagon: Wagon): void {
            if (wagon.type === WagonTypes.CargoWagon) {
                // TODO: calculate required cargo based on round etc
                let requiredCargo: CargoTypes[] = [CargoTypes.Circle, CargoTypes.Cube, CargoTypes.Triangle];
                (<CargoWagon>wagon).setRequestedCargo(requiredCargo);
                this.cargo.spawnCargo(requiredCargo);

                // TODO: calculate variable timing based on round etc
                wagon.moveInDone.addOnce(() => {
                    this.timeIndicator.start(5000);
                });
            } else if (wagon.type === WagonTypes.Caboose) {
                this.timeIndicator.stop();
                wagon.moveOutDone.addOnce(this.onRoundDone, this);
            }
        }

        private onCargoDropped(cargo: Cargo): void {
            if (this.train.isOnDropPoint(<Phaser.Point>cargo.worldPosition) && this.train.activeWagon.type === WagonTypes.CargoWagon) {
                (<CargoWagon>this.train.activeWagon).dropCargo(cargo);
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
            this.platform.width = this.game.width;

            this.train.y = this.platform.y;
            this.train.resize();
            this.cargo.resize();
            this.timeIndicator.resize();
        }

        private startRound(): void {
            this.train.reset(2);
            this.train.start();
            console.log('start');
        }

        private onRoundDone(): void {
            // TODO: Show intermission
            this.startRound();
        }
    }
}
