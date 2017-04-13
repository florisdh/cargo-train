module ExamAssignmentMA {
    export class Cargo extends Phaser.Image {
        constructor(game: Phaser.Game, type: CargoTypes) {
            let image: string = null;
            switch (type) {
                case CargoTypes.Circle:
                    image = Images.CargoCircle;
                    break;
                case CargoTypes.Cube:
                    image = Images.CargoCube;
                    break;
                case CargoTypes.Triangle:
                    image = Images.CargoTriangle;
                    break;
                default:
                    break;
            }
            super(game, 0, 0, image);
            this.inputEnabled = true;
            this.input.enableDrag(false, true);
            this.events.onDragStart.add(this.onDragStart, this);
            this.events.onDragStop.add(this.onDragStop, this);
        }

        private onDragStart(e: Cargo): void {
            console.log(e.worldPosition);
        }
        
        private onDragStop(e: Cargo): void {
            console.log(e.worldPosition);
        }

        public resize(): void {
            console.log('res cargo');
        }
    }
}
