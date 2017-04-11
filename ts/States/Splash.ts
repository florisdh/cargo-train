module ExamAssignmentMA {
    export class Splash extends Phaser.State {
        public static Name: string = 'splash';
        public name: string = Splash.Name;
        public game: Phaser.Game;
        private bg: Phaser.Image;

        public init(): void {
            this.bg = this.game.add.image(0, 0, Images.MA_Logo);
            this.resize();

            // Skip state for now
            this.game.state.start(Tutorial.Name);
        }

        public resize(): void {
            this.bg.width = this.game.width;
            this.bg.scale.y = this.bg.scale.x;
        }
    }
}
