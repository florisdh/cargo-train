module ExamAssignmentMA {
    /**
     * The reference to all lose image files and container of all items to be preloaded.
     */
    export class Images {

        // Specify all images here
        public static WhitePixel: string = 'white.png';
        public static MA_Logo: string = 'ma.png';
        // Tutorial
        public static TutorialBG: string = 'tutorialGraphic.jpg';
        // InGame
        public static Wagon: string = 'wagonCutOff.png';
        public static CargoCircle: string = 'cargoPlaceholderCirkel.png';
        public static CargoCube: string = 'cargoPlaceholderCube.png';
        public static CargoTriangle: string = 'cargoPlaceholderTriangle.png';
        public static CargoIndicatorContainer: string = 'cargoIndicator.png';
        public static CargoIndicatorCircleRed: string = 'cargoPlaceholderRedCirkel.png';
        public static CargoIndicatorCircleGreen: string = 'cargoPlaceholderGreenCirkel.png';
        public static CargoIndicatorCircleBlue: string = 'cargoPlaceholderBlueCirkel.png';
        public static CargoIndicatorCubeRed: string = 'cargoPlaceholderRedCube.png';
        public static CargoIndicatorCubeGreen: string = 'cargoPlaceholderGreenCube.png';
        public static CargoIndicatorCubeBlue: string = 'cargoPlaceholderBlueCube.png';
        public static CargoIndicatorTriangleRed: string = 'cargoPlaceholderRedTriangle.png';
        public static CargoIndicatorTriangleGreen: string = 'cargoPlaceholderGreenTriangle.png';
        public static CargoIndicatorTriangleBlue: string = 'cargoPlaceholderBlueTriangle.png';
        public static CargoIndicatorHexagon: string = 'cargoRequirementHexagonIcon.png';
        public static CargoIndicatorDiamond: string = 'cargoRequirementDaimondIcon.png';
        public static TimeContainer: string = 'timebar.png';
        public static TimeFill: string = 'timebarFill.png';
        public static WagonCounter: string = 'wagonCounter.png';
        public static Background_01: string = 'backgroundTrees.jpg';
        public static Platform_01: string = 'trainstationPavement.jpg';
        // GameOver
        public static GameOverBG: string = 'endScreenBackground.jpg';
        public static GameOverFG: string = 'endscreenForground.png';
        public static RetryButton: string = 'retryButton.png';

        // Add all images here
        public static PreloadList: string[] = [
            Images.WhitePixel,
            Images.MA_Logo,
            Images.Wagon,
            Images.CargoCircle,
            Images.CargoCube,
            Images.CargoTriangle,
            Images.CargoIndicatorContainer,
            Images.CargoIndicatorCircleRed,
            Images.CargoIndicatorCircleGreen,
            Images.CargoIndicatorCircleBlue,
            Images.CargoIndicatorCubeRed,
            Images.CargoIndicatorCubeGreen,
            Images.CargoIndicatorCubeBlue,
            Images.CargoIndicatorTriangleRed,
            Images.CargoIndicatorTriangleGreen,
            Images.CargoIndicatorTriangleBlue,
            Images.CargoIndicatorHexagon,
            Images.CargoIndicatorDiamond,
            Images.TimeContainer,
            Images.TimeFill,
            Images.WagonCounter,
            Images.Background_01,
            Images.Platform_01,
            Images.GameOverBG,
            Images.GameOverFG,
            Images.RetryButton,
            Images.TutorialBG
        ];
    }
}
