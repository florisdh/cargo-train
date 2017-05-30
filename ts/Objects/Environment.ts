module ExamAssignmentMA {
    /**
     * Contains the background images and parallax layers of the in-game scene.
     */
    export class Environment extends Phaser.Group {
        private readonly bgPercentage: number = 0.4;

        /* Tilescale has to be set relative to image resolution because pixi
           overrides the normal width/height behaviour of images in tileSprite
           and makes it 'impossible' to set width/height of the sprite in it.
        */
        private readonly bgWidth: number = 720;
        private readonly bgHeight: number = 435;
        private readonly platformWidth: number = 720;
        private readonly platformHeight: number = 753;
        private readonly platformBackWidth: number = 720;
        private readonly platformBackHeight: number = 92;

        private readonly bgParallax: number = 0.2;
        private readonly platformParallax: number = 1;
        private readonly platformBackParallax: number = 0.9;

        private background: Phaser.TileSprite;
        private platform: Phaser.TileSprite;
        private platformBack: Phaser.TileSprite;
        private moveTween: Phaser.Tween;
        private moveLeftNormal: number;
        private targetOffset: number = 0;

        /**
         * @param game The active game instance to be added to.
         */
        constructor(game: Phaser.Game) {
            super(game);

            this.background = this.game.add.tileSprite(0, 0, 0, 0, Images.Background_01);
            this.platformBack = this.game.add.tileSprite(0, 0, 0, 0, Images.PlatformBack_01);
            this.platform = this.game.add.tileSprite(0, 0, 0, 0, Images.Platform_01);
            this.moveLeftNormal = 0;
        }

        /**
         * Moves the backgrounds while applying parallax.
         */
        public moveToNext(forceLinear: boolean): void {
            if (this.moveTween && this.moveTween.isRunning) {
                this.moveTween.stop();
            }
            this.targetOffset++;
            this.moveLeftNormal = 1;
            this.moveTween = this.game.add.tween(this).to({ moveAnim: 0 }, 1000, forceLinear ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.InOut, true);
        }

        /**
         * Resizes the tilable sprites for supporting different screen resolutions.
         */
        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height * this.bgPercentage;

            if (this.background.height / this.bgHeight * this.bgWidth >= this.game.width) {
                // Background is scaled on desired height
                this.background.tileScale.x = this.background.tileScale.y = this.background.height / this.bgHeight;
                this.background.tilePosition.y = 0;
            } else {
                // Background is too short horizontally -> make it overflow vertically up
                this.background.tileScale.x = this.background.tileScale.y = this.background.width / this.bgWidth;
                this.background.tilePosition.y = (this.background.height - this.bgHeight * this.background.tileScale.y) / this.background.tileScale.y;
            }

            this.platform.y = this.background.bottom;
            this.platform.width = this.game.width;
            this.platform.height = this.game.height - this.platform.y;
            this.platform.tileScale.x = this.platform.width / this.platformWidth;
            this.platform.tileScale.y = this.platform.height / this.platformHeight;

            this.platformBack.width = this.game.width;
            this.platformBack.tileScale.x = this.platformBack.width / this.platformBackWidth;
            this.platformBack.tileScale.y = this.platformBack.tileScale.x;
            this.platformBack.height = this.platformBack.tileScale.y * this.platformBackHeight;
            this.platformBack.y = this.platform.y - this.platformBack.height;

            // Reposition
            if (!this.moveTween || !this.moveTween.isRunning) {
                this.moveAnim = this.moveAnim;
            }
        }

        private get moveAnim(): number {
            return this.moveLeftNormal;
        }

        private set moveAnim(value: number) {
            this.moveLeftNormal = value;
            this.background.tilePosition.x = (this.background.width - this.bgWidth * this.background.tileScale.x) / this.background.tileScale.x / 2 + // Center first
                this.background.width / this.background.tileScale.x * (this.targetOffset - this.moveLeftNormal) * -this.bgParallax;
            this.platform.tilePosition.x = this.platform.width / this.platform.tileScale.x * (this.targetOffset - this.moveLeftNormal) * -this.platformParallax;
            this.platformBack.tilePosition.x = this.platformBack.width / this.platformBack.tileScale.x * (this.targetOffset - this.moveLeftNormal) * -this.platformBackParallax;
        }

        /**
         * Returns the platform sprite´s Y position.
         */
        public get platformY(): number {
            return this.platform.y;
        }
    }
}
