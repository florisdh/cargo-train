module ExamAssignmentMA {
    export class Boot extends Phaser.State {
        public static Name: string = 'boot';
        public name: string = Boot.Name;
        public game: Phaser.Game;

        public init(): void {
            // Limit pointers
            this.game.input.maxPointers = 1;

            // Disable context menu
            this.game.canvas.oncontextmenu = function (e: Event): void {
                e.preventDefault();
            };

            // Handle resize
            this.scale.pageAlignVertically = true;
            if (this.game.device.desktop) {
                this.game.scale.windowConstraints.bottom = 'visual';
                this.scale.aspectRatio = 9 / 16;
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            } else {
                this.scale.forcePortrait = true;
                this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
                this.game.scale.onSizeChange.add(() => {
                    this.game.state.getCurrentState().resize();
                    console.log(this.game.scale);
                }, this);
            }
        }

        public preload(): void {
            this.game.load.onLoadComplete.addOnce(this.onLoaded, this);

            // Load all lose images
            let i: number;
            for (i = 0; i < Images.preloadList.length; i++) {
                this.game.load.image(Images.preloadList[i], 'assets/images/' + Images.preloadList[i] + '.png');
            }

            // Load all atlases
            for (i = 0; i < Atlases.preloadList.length; i++) {
                this.game.load.atlas(Atlases.preloadList[i], 'assets/atlases/' + Atlases.preloadList[i] + '.png', 'assets/atlases/' + Atlases.preloadList[i] + '.json');
            }

            // Load all sounds
            Sounds.preloadList.forEach((assetName: string) => {
                if (this.game.device.iOS) {
                    this.game.load.audio(assetName, ['assets/sound/' + assetName + '.m4a']);
                }
                this.game.load.audio(assetName, ['assets/sound/' + assetName + '.ogg', 'assets/sound/' + assetName + '.mp3']);
            });
        }

        private onLoaded(): void {
            this.game.state.start(Splash.Name);
        }
    }
}
