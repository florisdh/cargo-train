﻿module ExamAssignmentMA {
    export class GameOver extends Phaser.State {
        public static Name: string = 'gameover';
        public name: string = GameOver.Name;
        public game: Phaser.Game;

        public init(): void {
            this.resize();
        }

        public resize(): void {
            console.log('resize gameover');
        }
    }
}