module ExamAssignmentMA {
    /**
     * The data containing info about the current play session.
     */
    export class SessionData {

        public moneyChanged: Phaser.Signal;

        private round: number;
        private money: number;
        private speed: number;
        private accuracy: number;
        private droppedCargoAmount: number;
        private droppedCorrectCargoAmount: number;
        private totalTime: number;
        private leftoverTime: number;
        private wagonTimeLeftovers: number[];

        /**
         * @param round The starting round.
         * @param score The starting score.
         */
        constructor(round: number, money: number, speed: number, accuracy: number, totalPickedUpCargo: number, correctPickedUpCargo: number, totalTime: number, leftoverTime: number) {
            this.round = round;
            this.money = money;
            this.speed = speed;
            this.accuracy = accuracy;
            this.droppedCargoAmount = totalPickedUpCargo;
            this.droppedCorrectCargoAmount = correctPickedUpCargo;
            this.totalTime = totalTime;
            this.leftoverTime = leftoverTime;
            this.moneyChanged = new Phaser.Signal();
            this.wagonTimeLeftovers = [];
        }

        /**
         * Increases the round and score.
         */
        public nextRound(): void {
            this.round++;
            this.reset();
        }

        /**
         * Handles the data required for the end of round statistics.
         */
        public nextWagon(timeLeft: number, totalTime: number): void {
            // Add time left
            if (this.wagonTimeLeftovers) {
                this.wagonTimeLeftovers.push(timeLeft / totalTime * 100);
            }
        }

        /**
         * Increases the money by the given value.
         * @param value
         */
        public addMoney(value: number): void {
            this.money += value;
            this.moneyChanged.dispatch(this.money);
        }

        /**
         * Calculates the length of the train in the current round.
         */
        public calcTrainLength(): number {
            return Math.min(10, Math.min(2 + this.round * 2, 20));
        }

        /**
         * Calculates the time for the current wagon in the current round.
         */
        public calcWagonTime(cargoAmount: number): number {
            let perCargo: number;

            // First rounds should be easy
            if (this.round < 3) {
                perCargo = 6000 * Math.pow(0.7, this.round);
            } else {
                perCargo = Math.max(500, 3000 * Math.pow(0.6, Math.pow(0.5, this.round - 3)));
            }

            return cargoAmount * perCargo;
        }

        /**
         * Calculates the amount of cargo for the current wagon in the current round.
         */
        public calcCargoAmount(): number {
            return 2 + this.round + Math.floor(2 * Math.random());
        }

        /**
         * Calculates and returns the accuracy percentage of the current round.
         */
        public calcAccuracyPerc(): number {
            console.log('calcAccuracyPerc: ' + this.droppedCorrectCargoAmount / this.droppedCargoAmount * 100);
            return this.droppedCorrectCargoAmount / this.droppedCargoAmount * 100;
        }

        /**
         * Returns the current money.
         */
        public get currentMoney(): number {
            return this.money;
        }

        /**
         * Calculates and returns the speed percentage of the current round.
         */
        public calcSpeedPerc(): number {
            let totalPerc: number = 0;

            for (let i: number = 0; i < this.wagonTimeLeftovers.length; i++) {
                totalPerc += this.wagonTimeLeftovers[i];
            }

            console.log('calcSpeedPerc: ' + totalPerc / this.wagonTimeLeftovers.length);
            return totalPerc / this.wagonTimeLeftovers.length;
        }

        /**
         * Increments the data regarding the cargo drop accuracy.
         * @param correctCargo
         */
        public droppedCargo(correctCargo: boolean): void {
            this.droppedCargoAmount++;

            if (correctCargo) {
                this.droppedCorrectCargoAmount++;
            }
        }

        private reset(): void {
            this.droppedCargoAmount = 0;
            this.droppedCorrectCargoAmount = 0;
            this.wagonTimeLeftovers = [];
        }
    }
}
