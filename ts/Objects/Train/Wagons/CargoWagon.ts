module ExamAssignmentMA {
    /**
     * The wagon that needs cargo to finish its objective.
     */
    export class CargoWagon extends Wagon {

        private cargoIndicator: CargoIndicator;
        private wagonDoors: WagonDoors;
        private glow: Phaser.Image;
        private glowTween: Phaser.Tween;
        private glowFadeValue: number;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game, Images.Wagon);

            this.cargoIndicator = new CargoIndicator(this.game);
            this.wagonDoors = new WagonDoors(this.game);
            this.glow = this.game.add.image(0, 0, Images.WagonGlow);
            this.glowTween = null;
            this.glow.anchor.set(0.5, 1);

            this.add(this.cargoIndicator);
            this.add(this.glow);
            this.add(this.wagonDoors);

            this.cargoIndicator.wagonFilled.add(this.onWagonFilled, this);
            this.moveInDone.add(this.movedIn, this);

            this.glowAnim = 0;
            this.resize();
        }

        private movedIn(): void {
            this.cargoIndicator.setActiveCargoEffect();
            this.wagonDoors.open();
        }

        public enableGlow(cargoType: CargoTypes): void {
            if (this.glowTween && this.glowTween.isRunning) {
                this.glowTween.stop();
            }
            this.glowAnim = 0;
            this.glowTween = this.game.add.tween(this).to({ glowAnim: 1 }, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
        }

        public disableGlow(): void {
            if (this.glowTween && this.glowTween.isRunning) {
                this.glowTween.stop();
            }
            this.glowAnim = 0;
        }

        /**
         * Sets the required cargo randomly with an amount specified.
         * @param amount The amount of random generated cargo to use.
         */
        public setRandomCargo(amount: number): CargoTypes[] {
            let randomCargo: CargoTypes[] = [];
            for (let i: number = 0; i < amount; i++) {
                randomCargo.push(<CargoTypes>Math.floor(1 + Math.random() * 8));
            }
            this.setRequestedCargo(randomCargo);
            return randomCargo;
        }

        /**
         * Sets the cargo needed to finish its objective.
         * @param cargo The required cargo.
         */
        public setRequestedCargo(cargo: CargoTypes[]): void {
            this.cargoIndicator.setRequestedCargo(cargo);
        }

        private onWagonFilled(): void {
            if (this.glowEnabled) {
                this.disableGlow();
            }

            this.wagonDoors.close();
            this.wagonDoors.closed.addOnce(() => {
                this.objectiveDone.dispatch(this);
            });
        }

        /**
         * Resizes all elements in this object.
         * @param y The y axis where the top ui elements should center to.
         */
        public resize(): void {
            super.resize();
            this.cargoIndicator.resize(this.wagonImage.width, this.wagonImage.height);
            this.wagonDoors.resize(this.wagonImage.width, this.wagonImage.height);

            this.glow.height = this.wagonImage.height * 0.49;
            this.glow.scale.x = this.glow.scale.y;
            this.glow.x = this.wagonImage.width * 0.489;
            this.glow.y = -this.wagonImage.height * 0.1;
        }

        /**
         * Checks if the cargo is correct, returns the result
         * @param cargo
         */
        public dropCargo(cargo: Cargo): boolean {
            return (this.isIdle && this.cargoIndicator.dropCargo(cargo));
        }

        /**
         * Returns the type of this wagon.
         */
        public get type(): WagonTypes {
            return WagonTypes.CargoWagon;
        }

        private get glowAnim(): number {
            return this.glowFadeValue;
        }

        private set glowAnim(normal: number) {
            this.glowFadeValue = normal;
            this.glow.alpha = normal;
        }

        public get glowEnabled(): boolean {
            return this.glowTween && this.glowTween.isRunning;
        }

        public get nextCargoType(): CargoTypes {
            return this.cargoIndicator.nextType;
        }
    }
}
