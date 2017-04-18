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
            return cargoAmount * Math.max(500, 2500 - this.round * 400);
        }

        public getCargoAmount(): number {
            return 2 + this.round + Math.floor(2 * Math.random());
        }
    }
}
