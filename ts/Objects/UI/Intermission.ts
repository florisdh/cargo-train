module ExamAssignmentMA {
    /**
     * The intermission screen logic.
     */
    export class Intermission extends Phaser.Group {

        public intermissionDone: Phaser.Signal;
        // Clipboard
        private moveNormal: number;
        private clipboardTween: Phaser.Tween;
        private clipboard: Phaser.Image;
        private screenOverlay: Phaser.Image;
        // Text
        private continueTextNormal: number;
        private continueTextTween: Phaser.Tween;
        private continueText: Phaser.Text;
        private speedBonusText: Phaser.Text;
        private accuracyBonusText: Phaser.Text;
        private speedBonus: number = 1;
        private accuracyBonus: number;
        // Rating
        private starsAmount: number = 3;
        private starIsAnimating: boolean = false;
        private starTween: Phaser.Tween;
        private starNormal: number;
        private starScale: number = 0.6;
        private starImgFull: Phaser.Image;
        private starsToPlace: Phaser.Image[];
        private ratingSpeedStars: Phaser.Image[];
        private ratingAccuracyStars: Phaser.Image[];
        private shakeTimer: Phaser.TimerEvent;

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

            // Continue Text
            this.continueText = new Phaser.Text(this.game, 0, 0, '~  Tap to continue  ~', {
                font: '21pt Arial',
                fontStyle: 'italic',
                fill: '#000000',
                boundsAlignH: 'middle',
                boundsAlignV: 'middle'
            });
            this.continueText.anchor.setTo(0.5, 0.5);
            this.continueText.alpha = 0;
            this.clipboard.addChild(this.continueText);
            this.continueText.setTextBounds(
                this.clipboard.x,
                this.clipboard.height / 2 * 0.5 / this.clipboard.scale.y,
                this.continueText.width, this.continueText.height
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

            // Empty star frame positioning
            for (let i: number = 0; i < this.starsAmount; i++) {
                let heightPercAcc: number = 0.155;
                let heightPercSpeed: number = -0.145;
                this.ratingSpeedStars[i].x = this.ratingAccuracyStars[i].x = i * (this.clipboard.width / 2) / 4 / this.clipboard.scale.x;
                this.ratingAccuracyStars[i].y = -(this.clipboard.height / 2 * heightPercAcc) / this.clipboard.scale.y;
                this.ratingSpeedStars[i].y = -(this.clipboard.height / 2 * heightPercSpeed) / this.clipboard.scale.y;
            }

            // Full star
            this.starImgFull = new Phaser.Image(this.game, 0, 0, Images.RatingStarFull);
            this.starImgFull.anchor.setTo(0.5, 0.5);
            this.starImgFull.visible = false;
            this.clipboard.addChild(this.starImgFull);
            this.starsToPlace = [];

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
            if (this.clipboardTween && this.clipboardTween.isRunning) {
                this.clipboardTween.stop();
            }
            this.moveAnim = 0;
            this.clipboardTween = this.game.add.tween(this).to({ moveAnim: 1 }, 1000, Phaser.Easing.Bounce.Out, true);
            this.clipboardTween.onComplete.addOnce(this.onCompletedClipboardAnim, this, 0, session);
            this.clipboard.visible = true;

            // Set star frames
            this.showEmptyStars();
        }

        private onCompletedClipboardAnim(): void {
            // Enable input overlay
            this.screenOverlay.visible = true;
            // Calc info needed for clipboard
            this.calculateRating();
        }

        private get continueTextAnim(): number {
            return this.continueTextNormal;
        }

        private set continueTextAnim(value: number) {
            this.continueTextNormal = value;
            this.continueText.alpha = 0.30 + 0.40 * value;
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
            this.clipboardTween = this.game.add.tween(this).to({ moveAnim: 0 }, 500, Phaser.Easing.Back.In, true);
            this.clipboardTween.onComplete.addOnce(this.onIntermissionClosed, this);
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

            this.placeAchievedStars();
        }

        /**
         * Calls the animation for each achieved star (Loops till all placed)
         */
        private placeAchievedStars(): void {
            // Call the animation
            if (this.starsToPlace.length > 0 && this.starIsAnimating === false) {
                this.animateStarTowards(this.starsToPlace[0], 250);
            }
        }

        private animateStarTowards(spot: Phaser.Image, delay: number): void {
            let animationSpeed: number = 350;

            // Reset star
            this.starImgFull.visible = false;
            this.starImgFull.scale.x = this.starScale * 10;
            this.starImgFull.scale.y = this.starImgFull.scale.x;
            this.starImgFull.x = spot.x;
            this.starImgFull.y = spot.y;
            this.starAnim = 1;

            if (this.starTween && this.starTween.isRunning) {
                this.starTween.stop();
            }

            // Tween star scale
            this.starIsAnimating = true;
            this.starTween = this.game.add.tween(this).to({ starAnim: 0 }, animationSpeed, Phaser.Easing.Quintic.Out, true, delay);
            this.starTween.onComplete.addOnce(() => { this.starTweenDone(spot); }, this);
            this.starTween.onStart.addOnce(() => { this.starImgFull.visible = true; }, this);

            // Timer for impact effects
            if (this.shakeTimer) {
                this.game.time.events.remove(this.shakeTimer);
                this.shakeTimer = null;
            }
            this.shakeTimer = this.game.time.events.add(animationSpeed + 85, this.shakeTimedOut, this);
        }

        private shakeTimedOut(): void {
            this.game.camera.shake(0.03, 30, true, Phaser.Camera.SHAKE_BOTH);
        }

        private get starAnim(): number {
            return this.starNormal;
        }

        private set starAnim(norm: number) {
            this.starNormal = norm;
            this.starImgFull.scale.x = this.starScale * (20 * norm + 1);
            this.starImgFull.scale.y = this.starImgFull.scale.x;
        }

        private starTweenDone(spot: Phaser.Image): void {
            spot.loadTexture(Images.RatingStarFull);
            this.starsToPlace.splice(this.starsToPlace.indexOf(spot), 1);
            this.starIsAnimating = false;

            // Place next star if available
            if (this.starsToPlace.length > 0) {
                this.placeAchievedStars();
            } else {
                this.onDonePlacingStars();
            }
        }

        private onDonePlacingStars(): void {
            // ContinueText tween
            if (this.continueTextTween && this.continueTextTween.isRunning) {
                this.continueTextTween.stop();
            }
            this.continueTextTween = this.game.add.tween(this).to({ continueTextAnim: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

            // Enable input to Continue
            this.screenOverlay.inputEnabled = true;
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
            if (!this.clipboardTween || !this.clipboardTween.isRunning) {
                this.moveAnim = this.moveAnim;
            }

            this.screenOverlay.x = this.game.width / 2;
            this.screenOverlay.y = this.game.height / 2;
            this.screenOverlay.width = this.game.width;
            this.screenOverlay.height = this.game.height;
        }
    }
}
