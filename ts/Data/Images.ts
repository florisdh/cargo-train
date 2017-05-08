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
        // Cargo Indicators
        public static CargoIndicatorContainer: string = 'cargoIndicator.png';
        public static CargoIndicatorCircle: string = 'cargoRequerimentsCirkelIcon.png';
        public static CargoIndicatorCube: string = 'cargoRequerimentsCubeIcon.png';
        public static CargoIndicatorTriangle: string = 'cargoRequerimentsTriangleIcon.png';
        public static CargoIndicatorHexagon: string = 'cargoRequirementHexagonIcon.png';
        public static CargoIndicatorDiamond: string = 'cargoRequirementDaimondIcon.png';
        // Timer
        public static TimeContainer: string = 'timebar.png';
        public static TimeFill: string = 'timebarFill.png';
        public static WagonCounter: string = 'wagonCounter.png';
        public static Background_01: string = 'backgroundTrees.jpg';
        public static Platform_01: string = 'trainstationPavement.jpg';
        public static ParticleStar: string = 'particleStar.png';
        public static LeftDoor: string = 'wagonDoorLeft.png';
        public static RightDoor: string = 'wagonDoorRight.png';
        // GameOver
        public static GameOverBG: string = 'endScreenBackground.jpg';
        public static GameOverFG: string = 'endscreenForground.png';
        public static RetryButton: string = 'retryButton.png';

        // Add all images here
        public static PreloadList: string[] = [
            Images.WhitePixel,
            Images.MA_Logo,
            Images.Wagon,
            // Cargo
            Images.CargoCircle,
            Images.CargoCube,
            Images.CargoTriangle,
            Images.CargoIndicatorContainer,
            // Cargo Indicators
            Images.CargoIndicatorCircle,
            Images.CargoIndicatorCube,
            Images.CargoIndicatorTriangle,
            Images.CargoIndicatorHexagon,
            Images.CargoIndicatorDiamond,
            // Timer
            Images.TimeContainer,
            Images.TimeFill,
            Images.WagonCounter,
            Images.RetryButton,
            // Back- and foregrounds
            Images.Background_01,
            Images.Platform_01,
            Images.GameOverBG,
            Images.GameOverFG,
            Images.TutorialBG,
            Images.ParticleStar,
            Images.LeftDoor,
            Images.RightDoor
        ];
    }
}
