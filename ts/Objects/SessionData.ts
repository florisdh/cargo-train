module ExamAssignmentMA {
    /**
     * The data containing info about the current play session.
     */
    export class SessionData {

        private round: number;
        private score: number;
        private speed: number;
        private accuracy: number;
        //private pickedUpCargo: number;

        /**
         * @param round The starting round.
         * @param score The starting score.
         */
        constructor(round: number, score: number) {
            this.round = round;
            this.score = score;
        }

        /**
         * Increases the round and score.
         */
        public nextRound(): void {
            this.round++;
            this.score += 50;
        }

        /**
         * Increased the score.
         */
        public nextWagon(): void {
            this.score += 100;
        }

        /**
         * Calculates the length of the train in the current round.
         */
        public getTrainLength(): number {
            return Math.min(10, 2 + this.round);
        }

        /**
         * Calculates the time for the current wagon in the current round.
         */
        public getWagonTime(cargoAmount: number): number {
            return cargoAmount * Math.max(500, 5000 * Math.pow(0.9, this.round));
        }

        /**
         * Calculates the amount of cargo for the current wagon in the current round.
         */
        public getCargoAmount(): number {
            return 2 + this.round + Math.floor(2 * Math.random());
        }

        /**
         * Returns the current round.
         */
        public get currentRound(): number {
            return this.round;
        }

        /**
         * Returns the current score.
         */
        public get currentScore(): number {
            return this.score;
        }

        /**
         * Returns the speed of the current round.
         */
        public get currentSpeed(): number {
            return this.speed;
        }

        /**
         * Returns the accuracy of the current round.
         */
        public get currentAccuracy(): number {
            return this.accuracy;
        }
    }
}
