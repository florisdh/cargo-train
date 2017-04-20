module ExamAssignmentMA {
    export class Images {
        // Specify all images here
        public static WhitePixel: string = 'white';
        public static MA_Logo: string = 'ma';
        // Tutorial
        public static TutorialBG: string = 'tutorialGraphic';
        // InGame
        public static Wagon: string = 'wagonPlaceholder';
        public static CargoCircle: string = 'cargoPlaceholderCirkel';
        public static CargoCube: string = 'cargoPlaceholderCube';
        public static CargoTriangle: string = 'cargoPlaceholderTriangle';
        public static CargoIndicatorCircle: string = 'cargoIndicatorPlaceholderCircle';
        public static CargoIndicatorCube: string = 'cargoIndicatorPlaceholderCube';
        public static CargoIndicatorTriangle: string = 'cargoIndicatorPlaceholderTriangle';
        public static TimeContainer: string = 'timebar';
        public static TimeFill: string = 'timebarFill';
        public static WagonCounter: string = 'wagonCounter';
        public static Background_01: string = 'backgroundTrees';
        public static Platform_01: string = 'trainstationPavement';
        // GameOver
        public static GameOverBG: string = 'endScreenBackground';
        public static RetryButton: string = 'retryButton';

        // Add all images here
        public static preloadList: string[] = [
            Images.WhitePixel,
            Images.MA_Logo,
            Images.Wagon,
            Images.CargoCircle,
            Images.CargoCube,
            Images.CargoTriangle,
            Images.CargoIndicatorCircle,
            Images.CargoIndicatorCube,
            Images.CargoIndicatorTriangle,
            Images.TimeContainer,
            Images.TimeFill,
            Images.WagonCounter,
            Images.Background_01,
            Images.Platform_01,
            Images.GameOverBG,
            Images.RetryButton,
            Images.TutorialBG
        ];
    }
}
