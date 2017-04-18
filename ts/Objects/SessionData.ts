module ExamAssignmentMA {
    export class SessionData {
        public round: number;
        public score: number;

        constructor(round: number, score: number) {
            this.round = round;
            this.score = score;
        }

        public nextRound(): void {
            this.round++;
            this.score += 50;
        }

        public nextWagon(): void {
            this.score += 100;
        }
    }
}
