module ExamAssignmentMA {
    export class Tutorial extends Phaser.State {
        public static Name: string = 'tutorial';
        public name: string = Tutorial.Name;
        public game: Phaser.Game;

        public init(): void {
            console.log('init tutorial');
            this.resize();
        }

        public resize(): void {
            console.log('resize tutorial');
        }
    }
}
