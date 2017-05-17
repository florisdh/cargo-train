module ExamAssignmentMA {
    /**
     * The state that combines all game logics and assets.
     */
    export class GamePlay extends Phaser.State {

        public static Name: string = 'gameplay';
        private session: SessionData;
        private environment: Environment;
        private timeIndicator: TimeIndicator;
        private train: Train;
        private cargo: CargoPlatform;
        private wagonIndicator: WagonIndicator;
        private tutorial: IngameTutorial;
        private screenFade: ScreenFade;
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

            this.environment = new Environment(this.game);

            this.train = new Train(this.game);
            this.train.wagonCompleted.add(this.moveToNext, this);

            this.cargo = new CargoPlatform(this.game);
            this.cargo.cargoAdded.add(this.cargoGridAdded, this);
            this.cargo.cargoRemoved.add(this.cargoGridRemoved, this);

            this.timeIndicator = new TimeIndicator(this.game);
            this.timeIndicator.timeOut.addOnce(this.onTimeOut, this);

            this.wagonIndicator = new WagonIndicator(this.game);

            this.correct = this.game.add.sound(Sounds.CorrectCargo, 1, false);
            this.incorrect = this.game.add.sound(Sounds.IncorrectCargo, 1, false);

            this.tutorial = new IngameTutorial(this.game);

            this.screenFade = new ScreenFade(this.game);

            this.game.add.existing(this.timeIndicator);
            this.game.add.existing(this.cargo);
            this.game.add.existing(this.wagonIndicator);
            this.game.add.existing(this.tutorial);
            this.game.add.existing(this.screenFade);

            this.resize();
            this.screenFade.fadeOut(this.startRound, this);
        }

        private startRound(): void {
            this.train.reset(this.session.getTrainLength());
            this.cargo.reset();
            this.moveToNext();
            this.completedWagons = 0;
            this.wagonIndicator.setWagonAmount(this.train.totalWagons);
        }

        private stop(): void {
            this.train.wagonCompleted.remove(this.moveToNext, this);
            this.cargo.cargoAdded.remove(this.cargoGridAdded, this);
            this.cargo.cargoRemoved.remove(this.cargoGridRemoved, this);
            this.timeIndicator.timeOut.remove(this.onTimeOut, this);
        }

        private onRoundDone(): void {
            this.session.nextRound();
            this.startRound();
            // TODO: Show intermission
        }

        private moveToNext(): void {
            let wagon: Wagon = this.train.moveToNext();

            if (wagon) {
                if (wagon.type === WagonTypes.CargoWagon) {
                    let requiredCargo: CargoTypes[] = (<CargoWagon>wagon).setRandomCargo(this.session.getCargoAmount());
                    this.cargo.createNext().spawnCargo(requiredCargo);

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

                if (wagon.type !== WagonTypes.Locomotive) {
                    this.cargo.moveToNext();
                }
            }

            this.environment.moveToNext();
            this.tutorial.setActiveWagon(wagon);
        }

        private cargoGridAdded(cargo: CargoGrid): void {
            cargo.cargoDropped.add(this.onCargoDropped, this);
            this.tutorial.setActiveGrid(cargo);
        }

        private cargoGridRemoved(cargo: CargoGrid): void {
            cargo.cargoDropped.remove(this.onCargoDropped, this);
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
                    this.tutorial.resetIdleCheck();
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
            this.stop();
            this.screenFade.fadeIn(() => {
                this.game.state.start(GameOver.Name, true, false, this.session);
            });
        }

        /**
         * Resizes all game elements based on the screen size.
         */
        public resize(): void {
            this.environment.resize();
            this.train.y = this.environment.platformY;
            this.train.resize();
            this.cargo.resize();
            let topUiY: number = this.game.height * 0.05;
            this.timeIndicator.resize(topUiY);
            this.wagonIndicator.resize(topUiY);
            this.tutorial.resize();
            this.screenFade.resize();
        }
    }
}
