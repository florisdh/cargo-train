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
        private totalPickedUpCargo: number;
        private correctPickedUpCargo: number;
        private totalTime: number;
        private leftoverTime: number;

        /**
         * @param round The starting round.
         * @param score The starting score.
         */
        constructor(round: number, money: number, speed: number, accuracy: number, totalPickedUpCargo: number, correctPickedUpCargo: number, totalTime: number, leftoverTime: number) {
            this.round = round;
            this.money = money;
            this.speed = speed;
            this.accuracy = accuracy;
            this.totalPickedUpCargo = totalPickedUpCargo;
            this.correctPickedUpCargo = correctPickedUpCargo;
            this.totalTime = totalTime;
            this.leftoverTime = leftoverTime;
            this.moneyChanged = new Phaser.Signal();
        }

        /**
         * Increases the round and score.
         */
        public nextRound(): void {
            this.round++;
            this.resetTimeAndPickups();
        }

        /**
         * Increased the score.
         */
        public nextWagon(): void {
            return;
        }

        public addMoney(value: number): void {
            this.money += value;
            this.moneyChanged.dispatch(this.money);
        }

        /**
         * Calculates the length of the train in the current round.
         */
        public getTrainLength(): number {
            return Math.min(10, Math.min(2 + this.round * 2, 20));
        }

        /**
         * Calculates the time for the current wagon in the current round.
         */
        public getWagonTime(cargoAmount: number): number {
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
         * Returns the current money.
         */
        public get currentMoney(): number {
            return this.money;
        }

        /**
         * Returns the speed of the current round.
         */
        public get currentSpeed(): number {
            console.log(this.leftoverTime);
            console.log(this.totalTime);
            this.speed = (this.leftoverTime / this.totalTime * 100);
            console.log(this.speed);
            return this.speed;
        }

        /**
         * Returns the accuracy of the current round.
         */
        public get currentAccuracy(): number {
            this.accuracy = (this.correctPickedUpCargo / this.totalPickedUpCargo * 100);
            return this.accuracy;
        }

        public setTotalPickedUpCargo(amount: number): void {
            this.totalPickedUpCargo += amount;
        }

        public setCorrectPickedUpCargo(amount: number): void {
            this.correctPickedUpCargo += amount;
        }

        public setTotalTime(amount: number): void {
            this.totalTime += amount;
        }

        public setLeftoverTime(amount: number): void {
            this.leftoverTime += amount;
            console.log(this.leftoverTime);
        }

        private resetTimeAndPickups(): void {
            this.totalPickedUpCargo = 0;
            this.correctPickedUpCargo = 0;
            this.totalTime = 0;
            this.leftoverTime = 0;
        }
    }
}
