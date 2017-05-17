module ExamAssignmentMA {
    /**
     * Introduction screen, introducing the player to the IP and the art style.
     */
    export class Splash extends Phaser.State {

        public static Name: string = 'splash';
        private bg: Phaser.Image;
        private screenFade: ScreenFade;

        /**
         * Adding all assets that are required for this state.
         */
        public init(): void {
            this.bg = this.game.add.image(0, 0, Images.MA_Logo);
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
            this.screenFade.resize();
        }
    }
}
