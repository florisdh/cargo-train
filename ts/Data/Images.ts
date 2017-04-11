module ExamAssignmentMA {
    export class Images {
        // Specify all images here
        public static WhitePixel: string = 'white';
        public static MA_Logo: string = 'ma';
        public static Wagon: string = 'wagonPlaceholder';
        public static CargoCircle: string = 'cargoPlaceholderCirkel';
        public static CargoCube: string = 'cargoPlaceholderCube';
        public static CargoTriangle: string = 'cargoPlaceholderTriangle';

        // Add all images here
        public static preloadList: string[] = [
            Images.WhitePixel,
            Images.MA_Logo,
            Images.Wagon,
            Images.CargoCircle,
            Images.CargoCube,
            Images.CargoTriangle
        ];
    }
}
