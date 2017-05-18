﻿module ExamAssignmentMA {
    /**
     * The intermission screen logic.
     */
    export class IntermissionScreen extends Phaser.Group {

        public intermissionDone: Phaser.Signal;

        private background: Phaser.Image;
        private backgroundWidth: number;
        private backgroundHeight: number;
        private screenOverlay: Phaser.Image;
        //private currentRoundText: Phaser.Text;
        //private scoreTotalText: Phaser.Text;
        private speedBonusText: Phaser.Text;
        private accuracyBonusText: Phaser.Text;
        private tween: Phaser.Tween;
        private speedBonus: number = 1;
        private accuracyBonus: number = 99;
        private speedRatingStars: Phaser.Image[];
        private accuracyRatingStars: Phaser.Image[];

        constructor(game: Phaser.Game) {
            super(game);
            this.intermissionDone = new Phaser.Signal();

            this.background = new Phaser.Image(this.game, 0, 0, Images.IntermissionScreen);
            this.background.anchor.setTo(0.5, 0.5);
            this.background.visible = false;
            this.add(this.background);

            this.screenOverlay = new Phaser.Image(this.game, 0, 0, Images.WhitePixel);
            this.screenOverlay.anchor.setTo(0.5, 0.5);
            this.screenOverlay.alpha = 0;
            this.screenOverlay.inputEnabled = true;
            this.screenOverlay.events.onInputUp.add(this.closeIntermission, this);
            this.screenOverlay.visible = false;
            this.add(this.screenOverlay);

            /*this.currentRoundText = new Phaser.Text(this.game, 0, 0, 'Test', {
                font: '30pt Arial',
                fill: '#791909'
            });
            this.currentRoundText.anchor.setTo(0.5, 0.5);
            this.add(this.currentRoundText);
            this.background.addChild(this.currentRoundText);

            this.scoreTotalText = new Phaser.Text(this.game, 0, 0, 'Test', {
                font: '30pt Arial',
                fill: '#791909'
            });
            this.scoreTotalText.anchor.setTo(0.5, 0.5);
            this.add(this.scoreTotalText);
            this.background.addChild(this.scoreTotalText);*/

            this.speedBonusText = new Phaser.Text(this.game, 0, 0, 'Snelheid', {
                font: '25pt Arial',
                fill: '#791909'
            });
            this.speedBonusText.anchor.setTo(1.0, 0.5);
            this.add(this.speedBonusText);
            this.background.addChild(this.speedBonusText);

            this.accuracyBonusText = new Phaser.Text(this.game, 0, 0, 'Precisie', {
                font: '25pt Arial',
                fill: '#791909'
            });
            this.accuracyBonusText.anchor.setTo(1.0, 0.5);
            this.add(this.accuracyBonusText);
            this.background.addChild(this.accuracyBonusText);

            this.speedRatingStars = [];
            for (let i: number = 0; i < 3; i++) {
                let ratingStar: Phaser.Image = new Phaser.Image(this.game, 0, 0, null);
                this.speedRatingStars.push(ratingStar);
                this.speedRatingStars[i].alpha = 0.0;
                this.add(this.speedRatingStars[i]);
            }

            this.accuracyRatingStars = [];
            for (let i: number = 0; i < 3; i++) {
                let ratingStar: Phaser.Image = new Phaser.Image(this.game, 0, 0, null);
                this.accuracyRatingStars.push(ratingStar);
                this.accuracyRatingStars[i].alpha = 0.0;
                this.add(this.accuracyRatingStars[i]);
            }
        }

        public openIntermission(session: SessionData): void {
            //this.speedBonus = session.currentSpeed;
            //this.accuracyBonus = session.currentAccuracy;
            /*this.currentRoundText.text = 'Ronde ' + session.currentRound.toString() + ' volbracht!';
            this.scoreTotalText.text = session.currentScore.toString();*/
            this.game.time.events.add(Phaser.Timer.SECOND * 6, this.closeIntermission, this);
            this.background.scale.setTo(0);
            this.background.visible = true;
            this.screenOverlay.visible = true;
            this.tween = this.game.add.tween(this.background).to({ width: this.backgroundWidth, height: this.backgroundHeight }, 1000, Phaser.Easing.Bounce.Out, true);
            this.tween.onComplete.addOnce(this.calculateRating, this, 0, session);
        }

        private calculateRating(): void {
            if (this.speedBonus >= 95) {
                this.placeRatingStar(this.speedBonusText, 3, this.speedRatingStars);
            } else if (this.speedBonus >= 50) {
                this.placeRatingStar(this.speedBonusText, 2, this.speedRatingStars);
            } else {
                this.placeRatingStar(this.speedBonusText, 1, this.speedRatingStars);
            }
            if (this.accuracyBonus >= 95) {
                this.placeRatingStar(this.accuracyBonusText, 3, this.accuracyRatingStars);
            } else if (this.accuracyBonus >= 50) {
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
                stars[i].anchor.setTo(0.5, 0.5);
                stars[i].position.setTo(this.background.worldPosition.x + (i * (stars[i].width + (this.game.width * 0.01))), text.worldPosition.y);
                //stars[i].visible = true;
                this.game.add.tween(stars[i]).to({ alpha: 1.0 }, 50, Phaser.Easing.Linear.None, true);
            }
        }

        public closeIntermission(): void {
            this.screenOverlay.visible = false;
            for (let i: number = 0; i < this.speedRatingStars.length; i++) {
                this.game.add.tween(this.speedRatingStars[i]).to({ alpha: 0.0 }, 50, Phaser.Easing.Linear.None, true);
            }
            for (let i: number = 0; i < this.accuracyRatingStars.length; i++) {
                this.game.add.tween(this.accuracyRatingStars[i]).to({ alpha: 0.0 }, 50, Phaser.Easing.Linear.None, true);
            }
            this.game.time.events.removeAll();
            this.intermissionDone.dispatch();
            this.tween = this.game.add.tween(this.background).to({ width: 0, height: 0 }, 500, Phaser.Easing.Linear.None, true);
        }

        public resize(): void {
            this.background.x = this.game.width / 2;
            this.background.y = this.game.height / 2;
            this.background.width = this.game.width * 0.95;
            this.background.scale.y = this.background.scale.x;
            if (this.background.height > this.game.height) {
                this.background.height = this.game.height;
                this.background.scale.y = this.background.scale.x;
            }
            this.backgroundWidth = this.background.width;
            this.backgroundHeight = this.background.height;

            this.screenOverlay.x = this.game.width / 2;
            this.screenOverlay.y = this.game.height / 2;
            this.screenOverlay.width = this.game.width;
            this.screenOverlay.height = this.game.height;

            this.speedBonusText.y = this.background.anchor.y + (this.game.height * 0.1);
            this.speedBonusText.x = this.background.anchor.x - (this.game.width * 0.2);

            this.accuracyBonusText.y = this.background.anchor.y - (this.game.height * 0.1);
            this.accuracyBonusText.x = this.background.anchor.x - (this.game.width * 0.2);

            for (let i: number = 0; i < this.speedRatingStars.length; i++) {
                this.speedRatingStars[i].width = this.game.width * 0.03;
                this.speedRatingStars[i].scale.y = this.speedRatingStars[i].scale.x;
            }

            for (let i: number = 0; i < this.accuracyRatingStars.length; i++) {
                this.accuracyRatingStars[i].width = this.game.width * 0.03;
                this.accuracyRatingStars[i].scale.y = this.accuracyRatingStars[i].scale.x;
            }
        }
    }
}
