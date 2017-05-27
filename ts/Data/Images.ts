module ExamAssignmentMA {
    /**
     * The reference to all lose image files and container of all items to be preloaded.
     * Specify all images here.
     */
    export class Images {
        public static WhitePixel: string = 'white.png';
        public static MA_Logo: string = 'ma.png';
        //SplashScreen
        public static SplashScreen: string = 'splashScreen.jpg';
        public static Logo: string = 'logo.png';
        // Tutorial
        public static TutorialFrame1: string = 'tutorialScreen1.jpg';
        public static TutorialFrame2: string = 'tutorialScreen2.jpg';
        public static TutorialHandIdle: string = 'handTutorialScreenIdle.png';
        public static TutorialHandActive: string = 'handTutorialScreenActive.png';
        // In-Game
        public static Background_01: string = 'backgroundTrees.jpg';
        public static Platform_01: string = 'trainstationPavement.jpg';
        public static PlatformBack_01: string = 'trainstationPavementBack.jpg';
        public static ParticleStar: string = 'particleStar.png';
        public static DialogCloud: string = 'dialogGraphic.png';
        // Wagons
        public static Locomotive: string = 'locomotiveEnginedriver.png';
        public static MachinistArm: string = 'locomotiveEnginedriverArm.png';
        public static Wagon: string = 'wagonVersion1.png';
        public static Caboose: string = 'cabooseCutOff.png';
        public static WagonGlow: string = 'glowWagon.png';
        public static LeftDoor: string = 'wagonDoorLeft.png';
        public static RightDoor: string = 'wagonDoorRight.png';
        // Cargo
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
        public static CargoHighlightCube: string = 'cargoRequerimentsCubeIconGlow.png';
        public static CargoHighlightCircle: string = 'cargoRequerimentsCirkelIconGlow.png';
        public static CargoHighlightTriangle: string = 'cargoRequerimentsTriangleIconGlow.png';
        // Timer
        public static TimeContainer: string = 'timebar.png';
        public static TimeFill: string = 'timebarFill.png';
        public static WagonIndicator: string = 'wagonIndicator.png';
        public static ScoreIndicator: string = 'scoreIndicator.png';
        // Intermission
        public static RatingStarFull: string = 'ratingStarFull.png';
        public static RatingStarEmpty: string = 'ratingStarEmpty.png';
        public static IntermissionScreen: string = 'intermissionScreen.png';
        // GameOver
        public static GameOverBG: string = 'endScreenBackground.png'; // Todo: .jpg
        public static GameOverFG: string = 'endscreenForground.png';
        public static RetryButton: string = 'retryButton.png';

        // Add all images here
        public static PreloadList: string[] = [
            Images.WhitePixel,
            Images.MA_Logo,
            //SplashScreen
            Images.SplashScreen,
            Images.Logo,
            // Tutorial
            Images.TutorialFrame1,
            Images.TutorialFrame2,
            Images.TutorialHandIdle,
            Images.TutorialHandActive,
            // In-Game
            Images.Background_01,
            Images.Platform_01,
            Images.PlatformBack_01,
            Images.ParticleStar,
            Images.DialogCloud,
            // Wagons
            Images.Locomotive,
            Images.MachinistArm,
            Images.Wagon,
            Images.Caboose,
            Images.WagonGlow,
            Images.LeftDoor,
            Images.RightDoor,
            // Cargo
            Images.CargoCircle,
            Images.CargoCube,
            Images.CargoTriangle,
            // Cargo Indicators
            Images.CargoIndicatorContainer,
            Images.CargoIndicatorCircle,
            Images.CargoIndicatorCube,
            Images.CargoIndicatorTriangle,
            Images.CargoIndicatorHexagon,
            Images.CargoIndicatorDiamond,
            Images.CargoHighlightCube,
            Images.CargoHighlightCircle,
            Images.CargoHighlightTriangle,
            // Timer
            Images.TimeContainer,
            Images.TimeFill,
            Images.WagonIndicator,
            Images.ScoreIndicator,
            // GameOver
            Images.RetryButton,
            Images.GameOverBG,
            Images.GameOverFG,
            // Intermission
            Images.RatingStarFull,
            Images.RatingStarEmpty,
            Images.IntermissionScreen
        ];
    }
}
