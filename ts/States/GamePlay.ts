module ExamAssignmentMA {
    export class GamePlay extends Phaser.State {
        public static Name: string = 'gameplay';
        public name: string = GamePlay.Name;
        public game: Phaser.Game;

        private background: Phaser.Image;
        private train: Train;
        private cargo: Cargo;

        public init(): void {
            this.background = this.game.add.image(0, 0, Images.WhitePixel);
            this.train = new Train(this.game);
            this.cargo = new Cargo(this.game, CargoTypes.Circle);
            this.game.add.existing(this.cargo);
            this.resize();
            this.start();
        }

        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;
            this.train.resize();
            this.cargo.resize();
        }

        private start(): void {
            this.train.reset(2);
            this.train.start();
        }
    }
}
