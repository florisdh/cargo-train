module ExamAssignmentMA {
    export class Tutorial extends Phaser.State {
        public static Name: string = 'tutorial';
        public name: string = Tutorial.Name;
        public game: Phaser.Game;

        public init(): void {
            this.resize();

            // Skip state for now
            this.game.state.start(GamePlay.Name);
        }

        public resize(): void {
            console.log('resize tutorial');
        }
    }
}
