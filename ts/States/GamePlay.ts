module ExamAssignmentMA {
    export class GamePlay extends Phaser.State {
        public static Name: string = 'gameplay';
        public name: string = GamePlay.Name;
        public game: Phaser.Game;

        private background: Phaser.Image;
        private wagon: Wagon;

        public init(): void {
            this.background = this.game.add.image(0, 0, Images.WhitePixel);
            this.wagon = new Wagon(this.game);
            this.game.add.existing(this.wagon);

            this.resize();
        }

        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;
            this.wagon.resize();
        }
    }
}
