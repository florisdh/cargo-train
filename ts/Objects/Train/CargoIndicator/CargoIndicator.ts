﻿module ExamAssignmentMA {
    /**
     * The indicator showing the cargo required for this wagon.
     */
    export class CargoIndicator extends Phaser.Group {

        public wagonFilled: Phaser.Signal;
        private requestedCargo: CargoIcon[];
        private background: Phaser.Image;
        private iconMask: Phaser.Graphics;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);
            this.requestedCargo = [];
            this.background = new Phaser.Image(this.game, 0, 0, Images.CargoIndicatorContainer);
            this.background.anchor.setTo(0.5);
            this.iconMask = new Phaser.Graphics(game);
            this.add(this.background);
            this.add(this.iconMask);
            this.wagonFilled = new Phaser.Signal();
        }

        /**
         * Sets the required cargo.
         * @param cargoType The required cargo for this wagon to be completed.
         */
        public setRequestedCargo(cargoType: CargoTypes[]): void {
            cargoType.forEach(this.determineRequestedCargo, this);
        }

        private determineRequestedCargo(cargoType: CargoTypes): void {
            let cargoIcon: CargoIcon = new CargoIcon(this.game, cargoType);
            this.add(cargoIcon);
            this.requestedCargo.push(cargoIcon);
            this.resizeCargo();
        }

        /**
         * Resizes all elements in this object.
         */
        public resize(): void {
            let wagonWidth: number = this.parent.width / this.parent.scale.x,
                wagonHeight: number = this.parent.height / this.parent.scale.y;
            this.x = wagonWidth * 0.5;
            this.y = wagonHeight * -0.8;
            this.background.width = wagonWidth * 0.4;
            this.background.height = this.background.width * 0.2;
            this.iconMask.beginFill(0, 0);
            this.iconMask.drawRect(0, 0, this.background.width, this.background.height);
            this.iconMask.endFill();
            this.iconMask.x = this.background.left;
            this.iconMask.y = this.background.top;
            this.resizeCargo();
        }

        private resizeCargo(): void {
            for (let i: number = 0; i < this.requestedCargo.length; i++) {
                this.requestedCargo[i].activeCargo = i === 0;
                this.requestedCargo[i].height = this.background.height * 0.8;
                this.requestedCargo[i].scale.x = this.requestedCargo[i].scale.y;
                this.requestedCargo[i].x = - (this.background.width * 0.375) + (i * (this.requestedCargo[i].width + this.game.width * 0.01));
                this.requestedCargo[i].mask = this.iconMask;
            }
        }

        /**
         * Validates if the dropped cargo was currently needed.
         * @param cargo The cargo being dropped.
         */
        public dropCargo(cargo: Cargo): boolean {
            if (this.requestedCargo.length > 0 && this.requestedCargo[0].cargoType === cargo.cargoType) {
                this.requestedCargo[0].destroy();
                this.requestedCargo.splice(0, 1);
                this.resizeCargo();
                if (this.requestedCargo.length === 0) {
                    this.wagonFilled.dispatch(this);
                }
                return true;
            }
            return false;
        }
    }
}
