module ExamAssignmentMA {
    /**
     * Introduction screen, introducing the player to the IP and the art style.
     */
    export class Splash extends Phaser.State {

        public static Name: string = 'splash';
        private bg: Phaser.Image;
        private logo: Phaser.Image;
        private logoTween: Phaser.Tween;
        private logoNormal: number;
        private screenFade: ScreenFade;

        /**
         * Adding all assets that are required for this state.
         */
        public init(): void {
            this.bg = this.game.add.image(0, 0, Images.SplashScreen);
            this.bg.events.onInputUp.add(this.onBgClicked, this);

            this.logo = this.game.add.image(0, 0, Images.Logo);
            this.logo.anchor.setTo(0.5, 0.5);
            this.logoAnim = 0;

            this.screenFade = new ScreenFade(this.game);
            this.game.add.existing(this.screenFade);
            this.screenFade.fadeOut(() => {
                this.bg.inputEnabled = true;
            });

            this.resize();
            this.startLogoAnim();
        }

        private startLogoAnim(): void {
            if (this.logoTween && this.logoTween.isRunning) {
                this.logoTween.stop();
            }
            this.logoAnim = 0;
            this.logoTween = this.game.add.tween(this).to({ logoAnim: 1 }, 1000, Phaser.Easing.Bounce.Out, true);
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
            this.bg.height = this.game.height;
            this.logo.width = this.game.width;
            this.logo.scale.y = this.logo.scale.x;
            this.logo.x = this.game.width / 2;
            this.logoAnim = this.logoAnim;
            this.screenFade.resize();
        }

        private get logoAnim(): number {
            return this.logoNormal;
        }

        private set logoAnim(normal: number) {
            this.logoNormal = normal;
            this.logo.y = normal * this.game.height * 0.7;
        }
    }
}
