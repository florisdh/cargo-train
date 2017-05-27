module ExamAssignmentMA {
    /**
     * Introduction screen, introducing the player to the IP and the art style.
     */
    export class Splash extends Phaser.State {

        public static Name: string = 'splash';
        private bg: Phaser.Image;
        private logo: Phaser.Image;
        private screenFade: ScreenFade;

        /**
         * Adding all assets that are required for this state.
         */
        public init(): void {
            this.bg = this.game.add.image(0, 0, Images.SplashScreen);
            this.logo = this.game.add.image(this.game.width / 2, 0, Images.Logo);
            this.logo.anchor.setTo(0.5, 0.5);
            this.game.add.tween(this.logo).to({ y: this.game.height / 1.45 }, 1000, Phaser.Easing.Bounce.Out, true);
            this.bg.events.onInputUp.add(this.onBgClicked, this);
            this.screenFade = new ScreenFade(this.game);
            this.game.add.existing(this.screenFade);
            this.resize();

            this.screenFade.fadeOut(() => {
                this.bg.inputEnabled = true;
            });
        }

        private onBgClicked(): void {
            this.bg.inputEnabled = false;
            this.screenFade.fadeIn(() => {
                this.game.state.start(Tutorial.Name);
            });
        }

        /**
         * Scaling all assets in this state based on the screen size.
         */
        public resize(): void {
            this.bg.width = this.game.width;
            this.bg.scale.y = this.bg.scale.x;
            this.logo.width = this.game.width;
            this.logo.scale.y = this.logo.scale.x;
            this.screenFade.resize();
        }
    }
}
