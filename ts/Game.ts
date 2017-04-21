module ExamAssignmentMA {
    /**
     * Main game class.
     */
    export class Game extends Phaser.Game {
        constructor() {
            super({
                enableDebug: false,
                width: 720,
                height: 1280,
                renderer: Phaser.AUTO,
                parent: 'content',
                transparent: true,
                antialias: true,
                preserveDrawingBuffer: false,
                physicsConfig: null,
                seed: '',
                state: null,
                forceSetTimeOut: false
            });

            // Add all states here
            this.state.add(Boot.Name, Boot, false);
            this.state.add(Splash.Name, Splash, false);
            this.state.add(Tutorial.Name, Tutorial, false);
            this.state.add(GamePlay.Name, GamePlay, false);
            this.state.add(GameOver.Name, GameOver, false);

            // Add all plugins here
            //Phaser.Device.whenReady(() => {
            //});
        }

        /**
         * Entry point of the application.
         */
        public start(): void {
            this.state.start(Boot.Name);
        }
    }
}
