module ExamAssignmentMA {
    /**
     * The intermission screen logic.
     */
    export class Intermission extends Phaser.Group {

        public intermissionDone: Phaser.Signal;

        private clipboard: Phaser.Image;
        private backgroundWidth: number;
        private backgroundHeight: number;
        private screenOverlay: Phaser.Image;
        private speedBonusText: Phaser.Text;
        private accuracyBonusText: Phaser.Text;
        private tween: Phaser.Tween;
        private speedBonus: number = 1;
        private accuracyBonus: number;
        private speedRatingStars: Phaser.Image[];
        private accuracyRatingStars: Phaser.Image[];
        private moveNormal: number;

        constructor(game: Phaser.Game) {
            super(game);
            this.intermissionDone = new Phaser.Signal();

            this.clipboard = new Phaser.Image(this.game, 0, 0, Images.IntermissionScreen);
            this.clipboard.anchor.setTo(0.5, 0.5);
            this.clipboard.visible = false;
            this.add(this.clipboard);

            this.screenOverlay = new Phaser.Image(this.game, 0, 0, Images.WhitePixel);
            this.screenOverlay.anchor.setTo(0.5, 0.5);
            this.screenOverlay.alpha = 0;
            this.screenOverlay.inputEnabled = true;
            this.screenOverlay.events.onInputUp.add(this.closeIntermission, this);
            this.screenOverlay.visible = false;
            this.add(this.screenOverlay);

            this.speedBonusText = new Phaser.Text(this.game, 0, 0, 'Speed', {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'left',
                boundsAlignV: 'middle'
            });
            this.speedBonusText.anchor.setTo(0.0, 0.5);
            //this.add(this.speedBonusText);
            this.clipboard.addChild(this.speedBonusText);

            this.accuracyBonusText = new Phaser.Text(this.game, 0, 0, 'Accuracy', {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'left',
                boundsAlignV: 'middle'
            });
            this.accuracyBonusText.anchor.setTo(0.0, 0.5);
            //this.add(this.accuracyBonusText);
            this.clipboard.addChild(this.accuracyBonusText);

            this.speedRatingStars = [];
            for (let i: number = 0; i < 3; i++) {
                let ratingStar: Phaser.Image = new Phaser.Image(this.game, 0, 0, null);
                this.speedRatingStars.push(ratingStar);
                this.speedRatingStars[i].alpha = 0.0;
                this.speedRatingStars[i].anchor.setTo(0.5, 0.5);
                this.add(this.speedRatingStars[i]);
            }

            this.accuracyRatingStars = [];
            for (let i: number = 0; i < 3; i++) {
                let ratingStar: Phaser.Image = new Phaser.Image(this.game, 0, 0, null);
                this.accuracyRatingStars.push(ratingStar);
                this.accuracyRatingStars[i].alpha = 0.0;
                this.accuracyRatingStars[i].anchor.setTo(0.5, 0.5);
                this.add(this.accuracyRatingStars[i]);
            }
        }

        private clipboardTimer: Phaser.TimerEvent;

        /**
         * Opens the intermission clipboard.
         * @param session
         */
        public openIntermission(session: SessionData): void {
            this.speedBonus = session.calcSpeedPerc();
            this.accuracyBonus = session.calcAccuracyPerc();

            // Close timer
            this.clipboardTimer = this.game.time.events.add(6000, this.closeIntermission, this);
            this.clipboard.scale.setTo(0);
            this.clipboard.visible = true;

            // Open the popup
            this.tween = this.game.add.tween(this).to({ moveNormal: 1 }, 1000, Phaser.Easing.Bounce.Out, true);
            this.tween.onComplete.addOnce(this.onCompletedAnim, this, 0, session);
        }

        private onCompletedAnim(): void {
            // Enable input overlay
            this.screenOverlay.visible = true;
            // Calc info needed for clipboard
            this.calculateRating();
        }

        /**
         * Closes the intermission clipboard popup.
         */
        public closeIntermission(): void {
            // Disable input overlay
            this.screenOverlay.visible = false;

            // Tween out stars
            for (let i: number = 0; i < this.speedRatingStars.length; i++) {
                this.game.add.tween(this.speedRatingStars[i]).to({ alpha: 0.0 }, 50, Phaser.Easing.Linear.None, true);
            }
            for (let i: number = 0; i < this.accuracyRatingStars.length; i++) {
                this.game.add.tween(this.accuracyRatingStars[i]).to({ alpha: 0.0 }, 50, Phaser.Easing.Linear.None, true);
            }

            // Kill timer
            if (this.clipboardTimer) {
                this.game.time.events.remove(this.clipboardTimer);
            }

            // Close clipboard
            this.tween = this.game.add.tween(this).to({ moveAnim: 0 }, 1000, Phaser.Easing.Linear.None, true);
            this.intermissionDone.dispatch();
        }

        private get moveAnim(): number {
            return this.moveNormal;
        }

        private set moveAnim(value: number) {
            this.moveNormal = value;

            this.clipboard.width = this.game.width * 0.8 * value;
            this.clipboard.scale.y = this.clipboard.scale.x;

            if (this.clipboard.height > this.game.height * 0.8) {
                this.clipboard.height = this.game.height * 0.8 * value;
            }
        }

        private calculateRating(): void {
            if (this.speedBonus >= 50) {
                this.placeRatingStar(this.speedBonusText, 3, this.speedRatingStars);
            } else if (this.speedBonus >= 25) {
                this.placeRatingStar(this.speedBonusText, 2, this.speedRatingStars);
            } else {
                this.placeRatingStar(this.speedBonusText, 1, this.speedRatingStars);
            }
            if (this.accuracyBonus >= 90) {
                this.placeRatingStar(this.accuracyBonusText, 3, this.accuracyRatingStars);
            } else if (this.accuracyBonus >= 60) {
                this.placeRatingStar(this.accuracyBonusText, 2, this.accuracyRatingStars);
            } else {
                this.placeRatingStar(this.accuracyBonusText, 1, this.accuracyRatingStars);
            }
        }

        private placeRatingStar(text: Phaser.Text, amount: number, stars: Phaser.Image[]): void {
            switch (amount) {
                default:
                    console.log('Invalid amount');
                    break;
                case 1:
                    stars[0].loadTexture(Images.RatingStarFull);
                    stars[1].loadTexture(Images.RatingStarEmpty);
                    stars[2].loadTexture(Images.RatingStarEmpty);
                    break;
                case 2:
                    stars[0].loadTexture(Images.RatingStarFull);
                    stars[1].loadTexture(Images.RatingStarFull);
                    stars[2].loadTexture(Images.RatingStarEmpty);
                    break;
                case 3:
                    stars[0].loadTexture(Images.RatingStarFull);
                    stars[1].loadTexture(Images.RatingStarFull);
                    stars[2].loadTexture(Images.RatingStarFull);
                    break;
            }
            for (let i: number = 0; i < stars.length; i++) {
                stars[i].position.setTo(this.clipboard.x + (i * (stars[i].width + (this.game.width * 0.01))), text.worldPosition.y);
                this.game.add.tween(stars[i]).to({ alpha: 1.0 }, 50, Phaser.Easing.Linear.None, true);
            }
        }

        /**
         * Resizes the objects in the scene.
         */
        public resize(): void {
            this.clipboard.x = this.game.width / 2;
            this.clipboard.y = this.game.height / 2;
            this.clipboard.width = this.game.width * 0.95;
            this.clipboard.scale.y = this.clipboard.scale.x;
            if (this.clipboard.height > this.game.height) {
                this.clipboard.height = this.game.height;
                this.clipboard.scale.y = this.clipboard.scale.x;
            }
            this.backgroundWidth = this.clipboard.width;
            this.backgroundHeight = this.clipboard.height;

            this.screenOverlay.x = this.game.width / 2;
            this.screenOverlay.y = this.game.height / 2;
            this.screenOverlay.width = this.game.width;
            this.screenOverlay.height = this.game.height;
            this.speedBonusText.setTextBounds(
                -this.clipboard.width * 0.3 / this.clipboard.scale.x,
                this.clipboard.height * 0.075 / this.clipboard.scale.y,
                this.clipboard.width * 0.3, this.speedBonusText.height
            );

            this.accuracyBonusText.setTextBounds(
                -this.clipboard.width * 0.3 / this.clipboard.scale.x,
                -this.clipboard.height * 0.075 / this.clipboard.scale.y,
                this.clipboard.width * 0.3, this.accuracyBonusText.height
            );

            for (let i: number = 0; i < this.speedRatingStars.length; i++) {
                this.speedRatingStars[i].scale.setTo(this.game.width / 1080);

            }

            for (let i: number = 0; i < this.accuracyRatingStars.length; i++) {
                this.accuracyRatingStars[i].scale.setTo(this.game.width / 1080);
            }
        }
    }
}
