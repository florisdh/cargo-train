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
            this.wagonDoors = new WagonDoors(this.game, this);
            this.glow = this.game.add.image(0, 0, Images.WagonGlow);
            this.glowTween = null;

            this.addChild(this.cargoIndicator);
            this.addChild(this.glow);
            this.addChild(this.wagonDoors);

            this.cargoIndicator.wagonFilled.add(this.onWagonFilled, this);
            this.moveInDone.add(this.movedIn, this);

            this.glow.anchor.set(0.5, 0.5);
            this.enableGlow(CargoTypes.CircleBlue);
            this.resize();
        }

        private movedIn(): void {
            this.cargoIndicator.setActiveCargoEffect();
            this.wagonDoors.open();
        }

        private enableGlow(cargoType: CargoTypes): void {
            let colorTint: number;

            // Todo: Check if cargo is correct on hover, then apply either green or red to the tint.
            colorTint = 0x00ff00;

            //this.glow.tint = colorTint;
            this.glowFade = 0.8;
            this.glowTween = this.game.add.tween(this).to({ glowFade: 1 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
        }

        private disableGlow(): void {
            if (this.glowTween && this.glowTween.isRunning) {
                this.glowTween.stop();
            }
        }

        /**
         * Sets the required cargo randomly with an amount specified.
         * @param amount The amount of random generated cargo to use.
         */
        public setRandomCargo(amount: number): CargoTypes[] {
            let randomCargo: CargoTypes[] = [];
            for (let i: number = 0; i < amount; i++) {
                randomCargo.push(<CargoTypes>Math.floor(Math.random() * 8));
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
            //Temp call
            this.disableGlow();

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
            this.cargoIndicator.resize();
            this.wagonDoors.resize();

            this.glow.x = this.width * 0.49; // 49%
            this.glow.y = -(this.height * 0.3475); // 34.75%
            this.glow.scale.x = this.glow.scale.y;
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

        private get glowFade(): number {
            return this.glowFadeValue;
        }

        private set glowFade(normal: number) {
            this.glow.alpha = normal;
        }
    }
}
