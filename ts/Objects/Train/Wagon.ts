module ExamAssignmentMA {
    export class Wagon extends Phaser.Image {

        constructor(game: Phaser.Game) {
            super(game, 0, 0, Images.Wagon);
        }

        public resize(): void {
            this.width = this.game.width;
            this.scale.y = this.scale.x;
        }

    }
}
