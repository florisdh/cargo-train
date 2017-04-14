module ExamAssignmentMA {
    export class Cargo extends Phaser.Image {
        public dropped: Phaser.Signal;
        private isDragging: boolean;
        private moveBackTween: Phaser.Tween;
        private moveBackNormal: number;
        private gridPoint: Phaser.Point;
        private releasePoint: Phaser.Point;

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
            this.anchor.setTo(0.5);
            this.dropped = new Phaser.Signal();
            this.inputEnabled = true;
            this.input.enableDrag(false, true);
            this.events.onDragStart.add(this.onDragStart, this);
            this.events.onDragStop.add(this.onDragStop, this);
            this.moveBackNormal = 0;
            this.isDragging = false;
            this.gridPoint = this.position.clone();
            this.releasePoint = null;
            this.moveBackTween = null;
        }

        private onDragStart(e: Cargo): void {
            console.log(e.worldPosition);
            this.isDragging = true;
        }

        private onDragStop(e: Cargo): void {
            this.dropped.dispatch(this);
            this.isDragging = false;
        }

        public moveBack(): void {
            if (this.moveBackTween && this.moveBackTween.isRunning) {
                this.moveBackTween.stop();
            }
            this.moveBackNormal = 0;
            this.releasePoint = this.position.clone();
            this.moveBackTween = this.game.add.tween(this).to({ moveBackAnim: 1 }, 300, Phaser.Easing.Quadratic.In, true);
        }

        public resize(x: number, y: number, width: number, height: number): void {
            this.gridPoint.setTo(x, y);
            if (!this.isDragging && (this.moveBackTween === null || !this.moveBackTween.isRunning)) {
                this.x = x;
                this.y = y;
            }
            this.width = width;
            this.scale.y = this.scale.x;
            if (this.height > height) {
                this.height = height;
                this.scale.x = this.scale.y;
            }
        }

        private get moveBackAnim(): number {
            return this.moveBackNormal;
        }

        private set moveBackAnim(normal: number) {
            this.moveBackNormal = normal;
            let offset: Phaser.Point = new Phaser.Point(this.gridPoint.x - this.releasePoint.x, this.gridPoint.y - this.releasePoint.y);
            this.position.setTo(this.releasePoint.x + offset.x * normal, this.releasePoint.y + offset.y * normal);
        }
    }
}
