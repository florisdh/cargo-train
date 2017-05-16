module ExamAssignmentMA {
    /**
     * The state that will apply the settings and load all required assets.
     */
    export class Boot extends Phaser.State {

        public static Name: string = 'boot';

        /**
         * This will setup all preferred phaser settings.
         */
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
                }, this);
            }
        }

        /**
         * This will load all assets that are required in this game.
         */
        public preload(): void {
            this.game.load.onLoadComplete.addOnce(this.onLoaded, this);

            // Load all lose images
            let i: number;
            for (i = 0; i < Images.PreloadList.length; i++) {
                this.game.load.image(Images.PreloadList[i], 'assets/images/' + Images.PreloadList[i]);
            }

            // Load all atlases
            for (i = 0; i < Atlases.PreloadList.length; i++) {
                this.game.load.atlas(Atlases.PreloadList[i], 'assets/atlases/' + Atlases.PreloadList[i] + '.png', 'assets/atlases/' + Atlases.PreloadList[i] + '.json');
            }

            // Load all sounds
            Sounds.PreloadList.forEach((assetName: string) => {
                if (this.game.device.iOS) {
                    this.game.load.audio(assetName, ['assets/sounds/' + assetName + '.m4a']);
                }
                this.game.load.audio(assetName, ['assets/sounds/' + assetName + '.ogg', 'assets/sounds/' + assetName + '.mp3']);
            });

            // Load all spines
            for (let i: number = 0; i < Spines.PreloadList.length; i++) {
                (<PhaserSpine.SpineGame>this.game).load.spine(Spines.PreloadList[i], 'assets/spine/' + Spines.PreloadList[i] + '.json');
            }
        }

        /**
         * Start the first screen state that will show after load.
         */
        private onLoaded(): void {
            this.game.state.start(Splash.Name);
        }
    }
}
