module ExamAssignmentMA {
    export class Splash extends Phaser.State {
        public static Name: string = 'splash';
        public name: string = Splash.Name;
        public game: Phaser.Game;
        private bg: Phaser.Image;

        public init(): void {
            console.log('init splash');
            this.bg = this.game.add.image(0, 0, Images.MA_Logo);
            this.resize();
        }

        public resize(): void {
            this.bg.width = this.game.width;
            this.bg.scale.y = this.bg.scale.x;
        }
    }
}
