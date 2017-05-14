module ExamAssignmentMA {
    export class Environment extends Phaser.Group {
        private readonly bgPercentage: number = 0.4;

        /* Tilescale has to be set relative to image resolution because pixi
           overrides the normal width/height behaviour of images in tileSprite
           and makes it 'inpossible' to set width/height of the sprite in it.
        */
        private readonly bgWidth: number = 720;
        private readonly bgHeight: number = 435;
        private readonly platformWidth: number = 720;
        private readonly platformHeight: number = 753;

        private readonly bgParallax: number = 0.2;
        private readonly platformParallax: number = 1;

        private background: Phaser.TileSprite;
        private platform: Phaser.TileSprite;
        private moveTween: Phaser.Tween;
        private moveLeftNormal: number;
        private targetOffset: number = 0;

        constructor(game: Phaser.Game) {
            super(game);

            this.background = this.game.add.tileSprite(0, 0, 0, 0, Images.Background_01);
            this.platform = this.game.add.tileSprite(0, 0, 0, 0, Images.Platform_01);
            this.moveLeftNormal = 0;
        }

        public moveToNext(): void {
            if (this.moveTween && this.moveTween.isRunning) {
                this.moveTween.stop();
            }
            this.targetOffset++;
            this.moveLeftNormal = 1;
            this.moveTween = this.game.add.tween(this).to({ moveAnim: 0 }, 1000, Phaser.Easing.Quadratic.InOut, true);
        }

        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height * this.bgPercentage;

            // Background is scaled on desired height
            if (this.background.height / this.bgHeight * this.bgWidth >= this.game.width) {
                this.background.tileScale.x = this.background.tileScale.y = this.background.height / this.bgHeight;
                this.background.tilePosition.y = 0;

                // Background is too short horizontally -> make it overflow vertically up
            } else {
                this.background.tileScale.x = this.background.tileScale.y = this.background.width / this.bgWidth;
                this.background.tilePosition.y = (this.background.height - this.bgHeight * this.background.tileScale.y) / this.background.tileScale.y;
            }

            this.platform.y = this.background.bottom;
            this.platform.width = this.game.width;
            this.platform.height = this.game.height - this.platform.y;
            this.platform.tileScale.x = this.platform.width / this.platformWidth;
            this.platform.tileScale.y = this.platform.height / this.platformHeight;

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
        }

        public get platformY(): number {
            return this.platform.y;
        }
    }
}
