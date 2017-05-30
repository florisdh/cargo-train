module ExamAssignmentMA {
    /**
     * The intermission screen logic.
     */
    export class Intermission extends Phaser.Group {

        public intermissionDone: Phaser.Signal;

        private moveNormal: number;
        private tween: Phaser.Tween;
        private clipboard: Phaser.Image;
        private screenOverlay: Phaser.Image;

        private speedBonusText: Phaser.Text;
        private accuracyBonusText: Phaser.Text;
        private speedBonus: number = 1;
        private accuracyBonus: number;

        private starsAmount: number = 3;
        private starIsAnimating: boolean = false;
        private starTween: Phaser.Tween;
        private starNorm: number;
        private starScale: number = 0.6;
        private starFull: Phaser.Image;
        private starsToPlace: Phaser.Image[];
        private ratingSpeedStars: Phaser.Image[];
        private ratingAccuracyStars: Phaser.Image[];

        constructor(game: Phaser.Game) {
            super(game);
            this.intermissionDone = new Phaser.Signal();

            // Clipboard
            this.clipboard = this.game.add.image(0, 0, Images.IntermissionScreen);
            this.clipboard.anchor.setTo(0.5, 0.5);
            this.clipboard.visible = false;
            this.moveNormal = 0;

            // Screen overlay
            this.screenOverlay = this.game.add.image(0, 0, Images.WhitePixel);
            this.screenOverlay.anchor.setTo(0.5, 0.5);
            this.screenOverlay.alpha = 0;
            this.screenOverlay.events.onInputUp.add(this.closeIntermission, this);
            this.screenOverlay.visible = false;
            this.add(this.screenOverlay);

            // Speed Text
            this.speedBonusText = new Phaser.Text(this.game, 0, 0, 'Speed', {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'left',
                boundsAlignV: 'middle'
            });
            this.speedBonusText.anchor.setTo(0.0, 0.5);
            this.clipboard.addChild(this.speedBonusText);
            this.speedBonusText.setTextBounds(
                -this.clipboard.width * 0.3 / this.clipboard.scale.x,
                this.clipboard.height * 0.075 / this.clipboard.scale.y,
                this.clipboard.width * 0.3, this.speedBonusText.height
            );

            // Accuracy Text
            this.accuracyBonusText = new Phaser.Text(this.game, 0, 0, 'Accuracy', {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'left',
                boundsAlignV: 'middle'
            });
            this.accuracyBonusText.anchor.setTo(0.0, 0.5);
            this.clipboard.addChild(this.accuracyBonusText);
            this.accuracyBonusText.setTextBounds(
                -this.clipboard.width * 0.3 / this.clipboard.scale.x,
                -this.clipboard.height * 0.075 / this.clipboard.scale.y,
                this.clipboard.width * 0.3, this.accuracyBonusText.height
            );

            // Set empty star frames
            this.ratingSpeedStars = [];
            this.ratingAccuracyStars = [];
            for (let i: number = 0; i < this.starsAmount; i++) {
                let ratingStarAccuracy: Phaser.Image = new Phaser.Image(this.game, 0, 0, Images.RatingStarEmpty);
                let ratingStarSpeed: Phaser.Image = new Phaser.Image(this.game, 0, 0, Images.RatingStarEmpty);
                ratingStarAccuracy.anchor = ratingStarSpeed.anchor.setTo(0.5, 0.5);
                ratingStarAccuracy.visible = ratingStarSpeed.visible = false;
                ratingStarAccuracy.width = ratingStarSpeed.width = ratingStarSpeed.width * this.starScale;
                ratingStarAccuracy.scale.y = ratingStarSpeed.scale.y = ratingStarSpeed.scale.x;

                this.ratingAccuracyStars.push(ratingStarAccuracy);
                this.ratingSpeedStars.push(ratingStarSpeed);

                this.clipboard.addChild(ratingStarAccuracy);
                this.clipboard.addChild(ratingStarSpeed);
            }

            // Full Star
            this.starFull = new Phaser.Image(this.game, 0, 0, Images.RatingStarFull);
            this.starFull.anchor.setTo(0.5, 0.5);
            this.starFull.visible = false;
            this.clipboard.addChild(this.starFull);
            this.starsToPlace = [];

            // Empty Stars
            for (let i: number = 0; i < this.starsAmount; i++) {
                let heightPercAcc: number = 0.155;
                let heightPercSpeed: number = -0.145;
                this.ratingSpeedStars[i].x = this.ratingAccuracyStars[i].x = i * (this.clipboard.width / 2) / 4 / this.clipboard.scale.x;
                this.ratingAccuracyStars[i].y = -(this.clipboard.height / 2 * heightPercAcc) / this.clipboard.scale.y;
                this.ratingSpeedStars[i].y = -(this.clipboard.height / 2 * heightPercSpeed) / this.clipboard.scale.y;
            }

            //this.openIntermission(new SessionData(0, 0, 0, 0, 0, 0, 0, 0));
            this.resize();
        }

        /**
         * Opens the intermission clipboard.
         * @param session
         */
        public openIntermission(session: SessionData): void {
            // Calc values
            this.speedBonus = session.calcSpeedPerc();
            this.accuracyBonus = session.calcAccuracyPerc();

            // Open the clipboard
            this.moveAnim = 0;
            this.tween = this.game.add.tween(this).to({ moveAnim: 1 }, 1000, Phaser.Easing.Bounce.Out, true);
            this.tween.onComplete.addOnce(this.onCompletedAnim, this, 0, session);
            this.clipboard.visible = true;

            // Set star frames
            this.showEmptyStars();
        }

        private onCompletedAnim(): void {
            // Enable input overlay
            this.screenOverlay.visible = true;
            // Calc info needed for clipboard
            this.calculateRating();
        }

        private showEmptyStars(): void {
            for (let i: number = 0; i < this.starsAmount; i++) {
                this.ratingSpeedStars[i].visible = true;
                this.ratingAccuracyStars[i].visible = true;
            }
        }

        /**
         * Closes the intermission clipboard popup.
         */
        public closeIntermission(): void {
            // Disable input overlay
            this.screenOverlay.visible = false;

            // Close clipboard
            this.tween = this.game.add.tween(this).to({ moveAnim: 0 }, 500, Phaser.Easing.Back.In, true);
            this.tween.onComplete.addOnce(this.onIntermissionClosed, this);
        }

        private onIntermissionClosed(): void {
            this.clipboard.visible = false;
            this.intermissionDone.dispatch();
        }

        private calculateRating(): void {
            let amountOfStars: number;
            
            // Accuracy stars
            if (this.accuracyBonus >= 90) {
                amountOfStars = 3;
            } else if (this.accuracyBonus >= 60) {
                amountOfStars = 2;
            } else {
                amountOfStars = 1;
            }

            for (let i: number = 0; i < amountOfStars; i++) {
                this.starsToPlace.push(this.ratingAccuracyStars[i]);
            }

            // Speed stars
            if (this.speedBonus >= 50) {
                amountOfStars = 3;
            } else if (this.speedBonus >= 25) {
                amountOfStars = 2;
            } else {
                amountOfStars = 1;
            }

            for (let i: number = 0; i < amountOfStars; i++) {
                this.starsToPlace.push(this.ratingSpeedStars[i]);
            }

            this.placeStars();
        }

        private placeStars(): void {
            if (this.starsToPlace.length <= 0) {
                return null;
            }

            if (this.starsToPlace.length > 0 && this.starIsAnimating === false) {
                this.placeStar(this.starsToPlace[0], 0);
            }
        }

        private placeStar(spot: Phaser.Image, delay: number): void {
            // Set star on spot
            this.starFull.x = spot.x;
            this.starFull.y = spot.y;
            this.starAnim = 1;

            if (this.starTween && this.starTween.isRunning) {
                this.starTween.stop();
            }

            this.starIsAnimating = true;
            this.starTween = this.game.add.tween(this).to({ starAnim: 0 }, 400, Phaser.Easing.Quintic.Out, true, delay);
            this.starTween.onComplete.addOnce(() => { this.starTweenDone(spot) }, this);
            this.starFull.visible = true;
        }

        private get starAnim(): number {
            return this.starNorm;
        }

        private set starAnim(norm: number) {
            this.starNorm = norm;
            this.starFull.scale.x = this.starScale * (15 * norm + 1);
            this.starFull.scale.y = this.starFull.scale.x;
        }

        private starTweenDone(spot: Phaser.Image): void {
            console.log('starTweenDone');
            this.game.camera.shake(0.025, 25, true, Phaser.Camera.SHAKE_BOTH);
            spot.loadTexture(Images.RatingStarFull);
            this.starsToPlace.splice(this.starsToPlace.indexOf(spot), 1);
            this.starIsAnimating = false;

            // Reset and place next star
            if (this.starsToPlace.length > 0) {
                console.log('starsToPlace > 0');
                this.starFull.visible = false;
                this.starFull.scale.x = this.starScale * 10;
                this.starFull.scale.y = this.starFull.scale.x;
                this.placeStar(this.starsToPlace[0], 0);
            } else {
                this.screenOverlay.inputEnabled = true;
            }
        }

        private get moveAnim(): number {
            return this.moveNormal;
        }

        private set moveAnim(value: number) {
            this.moveNormal = value;

            this.clipboard.width = this.game.width * 0.95 * value;
            if (this.clipboard.height > this.game.height * 0.95) {
                this.clipboard.height = this.game.height * 0.95 * value;
            }
            this.clipboard.scale.y = this.clipboard.scale.x;
        }

        /**
         * Resizes the objects in the scene.
         */
        public resize(): void {
            this.clipboard.x = this.game.width / 2;
            this.clipboard.y = this.game.height / 2;
            if (!this.tween || !this.tween.isRunning) {
                this.moveAnim = this.moveAnim;
            }

            this.screenOverlay.x = this.game.width / 2;
            this.screenOverlay.y = this.game.height / 2;
            this.screenOverlay.width = this.game.width;
            this.screenOverlay.height = this.game.height;
        }
    }
}
