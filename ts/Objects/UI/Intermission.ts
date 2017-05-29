module ExamAssignmentMA {
    /**
     * The intermission screen logic.
     */
    export class Intermission extends Phaser.Group {

        public intermissionDone: Phaser.Signal;

        private backgroundWidth: number;
        private backgroundHeight: number;

        private moveNormal: number;
        private tween: Phaser.Tween;
        private clipboard: Phaser.Image;
        private screenOverlay: Phaser.Image;

        private speedBonusText: Phaser.Text;
        private accuracyBonusText: Phaser.Text;
        private speedBonus: number = 1;
        private accuracyBonus: number;

        private starsAmount: number = 3;
        private starScale: number = 0.6;
        private starFull: Phaser.Image;
        private ratingSpeedStars: Phaser.Image[];
        private ratingAccuracyStars: Phaser.Image[];

        constructor(game: Phaser.Game) {
            super(game);
            this.intermissionDone = new Phaser.Signal();

            // Clipboard
            this.clipboard = this.game.add.image(0, 0, Images.IntermissionScreen);
            this.clipboard.anchor.setTo(0.5, 0.5);
            this.clipboard.visible = false;

            // Screen overlay
            this.screenOverlay = this.game.add.image(0, 0, Images.WhitePixel);
            this.screenOverlay.anchor.setTo(0.5, 0.5);
            this.screenOverlay.alpha = 0;
            this.screenOverlay.inputEnabled = true;
            this.screenOverlay.events.onInputUp.add(this.closeIntermission, this);
            this.screenOverlay.visible = false;
            this.add(this.screenOverlay);

            // Text
            this.speedBonusText = new Phaser.Text(this.game, 0, 0, 'Speed', {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'left',
                boundsAlignV: 'middle'
            });
            this.speedBonusText.anchor.setTo(0.0, 0.5);
            this.clipboard.addChild(this.speedBonusText);

            this.accuracyBonusText = new Phaser.Text(this.game, 0, 0, 'Accuracy', {
                font: '25pt Arial',
                fill: '#791909',
                boundsAlignH: 'left',
                boundsAlignV: 'middle'
            });
            this.accuracyBonusText.anchor.setTo(0.0, 0.5);
            this.clipboard.addChild(this.accuracyBonusText);

            // Stars
            this.starFull = new Phaser.Image(this.game, 0, 0, Images.RatingStarFull);

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
            this.clipboard.scale.setTo(0);
            this.clipboard.visible = true;
            this.tween = this.game.add.tween(this).to({ moveAnim: 1 }, 1000, Phaser.Easing.Bounce.Out, true);
            this.tween.onComplete.addOnce(this.onCompletedAnim, this, 0, session);

            // Set stars
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
            this.resize();
        }

        /**
         * Closes the intermission clipboard popup.
         */
        public closeIntermission(): void {
            // Disable input overlay
            this.screenOverlay.visible = false;

            // Close clipboard
            this.tween = this.game.add.tween(this).to({ moveAnim: 0 }, 750, Phaser.Easing.Back.In, true);
            this.tween.onComplete.addOnce(this.intermissionDone.dispatch, this);
        }

        // Todo: Rework for star tween
        private calculateRating(): void {
            if (this.speedBonus >= 50) {
                this.placeRatingStar(this.speedBonusText, 3, this.ratingSpeedStars);
            } else if (this.speedBonus >= 25) {
                this.placeRatingStar(this.speedBonusText, 2, this.ratingSpeedStars);
            } else {
                this.placeRatingStar(this.speedBonusText, 1, this.ratingSpeedStars);
            }

            if (this.accuracyBonus >= 90) {
                this.placeRatingStar(this.accuracyBonusText, 3, this.ratingAccuracyStars);
            } else if (this.accuracyBonus >= 60) {
                this.placeRatingStar(this.accuracyBonusText, 2, this.ratingAccuracyStars);
            } else {
                this.placeRatingStar(this.accuracyBonusText, 1, this.ratingAccuracyStars);
            }
        }

        // Todo: Rework for star tween
        private placeRatingStar(text: Phaser.Text, amount: number, stars: Phaser.Image[]): void {
            switch (amount) {
                default:
                    stars[0].loadTexture(Images.RatingStarEmpty);
                    stars[1].loadTexture(Images.RatingStarEmpty);
                    stars[2].loadTexture(Images.RatingStarEmpty);
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
                //stars[i].position.setTo(this.clipboard.x + (i * (stars[i].width + (this.game.width * 0.01))), text.worldPosition.y);
                this.game.add.tween(stars[i]).to({ alpha: 1.0 }, 50, Phaser.Easing.Linear.None, true);
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
            this.backgroundWidth = this.clipboard.width;
            this.backgroundHeight = this.clipboard.height;

            this.clipboard.x = this.game.width / 2;
            this.clipboard.y = this.game.height / 2;
            this.clipboard.width = this.game.width * 0.95;
            if (this.clipboard.height > this.game.height) {
                this.clipboard.height = this.game.height;
            }
            this.clipboard.scale.y = this.clipboard.scale.x;

            this.screenOverlay.x = this.game.width / 2;
            this.screenOverlay.y = this.game.height / 2;
            this.screenOverlay.width = this.game.width;
            this.screenOverlay.height = this.game.height;

            // Text
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

            // Stars
            for (let i: number = 0; i < this.starsAmount; i++) {
                let heightPercAcc: number = 0.155;
                let heightPercSpeed: number = -0.145;
                this.ratingSpeedStars[i].x = this.ratingAccuracyStars[i].x = i * (this.clipboard.width / 2) / 4 / this.clipboard.scale.x;
                this.ratingAccuracyStars[i].y = -(this.clipboard.height / 2 * heightPercAcc) / this.clipboard.scale.y;
                this.ratingSpeedStars[i].y = -(this.clipboard.height / 2 * heightPercSpeed) / this.clipboard.scale.y;
            }
        }
    }
}
