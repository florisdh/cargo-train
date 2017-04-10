module ExamAssignmentMA {
    export class GamePlay extends Phaser.State {
        public static Name: string = 'gameplay';
        public name: string = GamePlay.Name;
        public game: Phaser.Game;

        public init(): void {
            console.log('init gameplay');
            this.resize();
        }

        public resize(): void {
            console.log('resize gameplay');
        }
    }
}
