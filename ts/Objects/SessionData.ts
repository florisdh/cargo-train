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

        public getTrainLength(): number {
            return Math.min(10, 2 + this.round);
        }

        public getWagonTime(cargoAmount: number): number {
            return cargoAmount * (500 + 200 * Math.max(0, 20 - this.round));
        }
    }
}
