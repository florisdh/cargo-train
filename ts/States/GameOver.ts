module ExamAssignmentMA {
    export class GameOver extends Phaser.State {
        public static Name: string = 'gameover';
        public name: string = GameOver.Name;
        public game: Phaser.Game;

        public init(): void {
            this.resize();
            this.game.state.start(GamePlay.Name);
        }

        public resize(): void {
            console.log('resize gameover');
        }
    }
}
