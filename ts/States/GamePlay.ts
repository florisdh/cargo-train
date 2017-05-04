module ExamAssignmentMA {
    /**
     * The state that combines all game logics and assets.
     */
    export class GamePlay extends Phaser.State {

        public static Name: string = 'gameplay';
        private session: SessionData;
        private background: Phaser.Image;
        private platform: Phaser.Image;
        private timeIndicator: TimeIndicator;
        private train: Train;
        private cargo: CargoGrid;
        private wagonIndicator: WagonIndicator;
        private completedWagons: number;
        private correct: Phaser.Sound;
        private incorrect: Phaser.Sound;

        /**
         * Adds all game assets and sets up all game elements.
         * @param session The data containing the current sessions score.
         */
        public init(session?: SessionData): void {
            if (session) {
                this.session = session;
            } else {
                this.session = new SessionData(0, 0);
            }

            this.background = this.game.add.image(0, 0, Images.Background_01);
            this.background.anchor.set(0.5, 1);

            this.platform = this.game.add.image(0, 0, Images.Platform_01);
            this.platform.anchor.set(0.5, 0);

            this.train = new Train(this.game);
            this.train.wagonAdded.add(this.onWagonAdded, this);

            this.cargo = new CargoGrid(this.game);
            this.cargo.cargoDropped.add(this.onCargoDropped, this);

            this.timeIndicator = new TimeIndicator(this.game);
            this.timeIndicator.timeOut.addOnce(this.onTimeOut, this);

            this.wagonIndicator = new WagonIndicator(this.game);

            this.correct = this.game.add.sound(Sounds.correct, 100, false);
            this.incorrect = this.game.add.sound(Sounds.incorrect, 100, false);

            this.game.add.existing(this.timeIndicator);
            this.game.add.existing(this.cargo);
            this.game.add.existing(this.wagonIndicator);

            this.resize();
            this.startRound();
        }

        private onWagonAdded(wagon: Wagon): void {
            if (wagon.type === WagonTypes.CargoWagon) {
                let requiredCargo: CargoTypes[] = (<CargoWagon>wagon).setRandomCargo(this.session.getCargoAmount());
                this.cargo.spawnCargo(requiredCargo);

                wagon.moveInDone.addOnce(() => {
                    this.timeIndicator.start(this.session.getWagonTime(requiredCargo.length));
                });
                wagon.objectiveDone.addOnce(() => {
                    this.timeIndicator.stop();
                    this.session.nextWagon();
                    this.completedWagons++;
                    this.wagonIndicator.setWagonAmount(this.train.totalWagons - this.completedWagons);
                });
            } else if (wagon.type === WagonTypes.Caboose) {
                this.timeIndicator.stop();
                wagon.moveOutDone.addOnce(this.onRoundDone, this);
            }
        }

        /**
         * Handles the drop of the cargo, validated the drop point and tries to put it in the wagon.
         * @param cargo The cargo being dropped.
         */
        private onCargoDropped(cargo: Cargo): void {
            if (this.train.activeWagon.type === WagonTypes.CargoWagon && this.train.isOnDropPoint(<Phaser.Point>cargo.worldPosition)) {
                let activeWagon: CargoWagon = <CargoWagon>this.train.activeWagon;
                if (activeWagon.dropCargo(cargo)) {
                    cargo.fadeOut(activeWagon);
                    this.correct.play();
                } else {
                    this.shakeScreen();
                    cargo.moveBack();
                    this.timeIndicator.damageTime(1000);
                    this.incorrect.play();
                }
            } else {
                cargo.moveBack();
            }

        }

        private shakeScreen(): void {
            this.game.camera.shake(0.05, 50, true, Phaser.Camera.SHAKE_HORIZONTAL);
        }

        private onTimeOut(): void {
            this.game.state.start(GameOver.Name, true, false, this.session);
        }

        /**
         * Resizes all game elements based on the screen size.
         */
        public resize(): void {
            let bgPerc: number = 0.4;
            let ptfrmPerc: number = 0.6;

            // Background positioning
            this.background.y = this.game.height * bgPerc;
            this.background.x = this.game.width * 0.5;
            // Background height scaling
            this.background.height = this.game.height * bgPerc;
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
            this.platform.height = this.game.height * ptfrmPerc;
            this.platform.width = this.game.width;

            this.train.y = this.platform.y;
            this.train.resize();
            this.cargo.resize();
            let topUiY: number = this.game.height * 0.05;
            this.timeIndicator.resize(topUiY);
            this.wagonIndicator.resize(topUiY);
        }

        private startRound(): void {
            this.train.reset(this.session.getTrainLength());
            this.train.start();
            this.completedWagons = 0;
            this.wagonIndicator.setWagonAmount(this.train.totalWagons);
        }

        private onRoundDone(): void {
            this.session.nextRound();
            this.startRound();
            // TODO: Show intermission
        }
    }
}
