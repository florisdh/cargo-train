module ExamAssignmentMA {
    export class GamePlay extends Phaser.State {
        public static Name: string = 'gameplay';
        public name: string = GamePlay.Name;
        public game: Phaser.Game;

        private background: Phaser.Image;
        private train: Train;

        public init(): void {
            this.background = this.game.add.image(0, 0, Images.WhitePixel);
            this.train = new Train(this.game);
            this.resize();
            this.start();
        }

        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;
            this.train.resize();
        }

        private start(): void {
            this.train.reset(2);
            this.train.start();
        }
    }
}
