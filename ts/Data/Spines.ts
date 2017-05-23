module ExamAssignmentMA {
    /**
     * The reference to all spine files and container of all items to be preloaded.
     */
    export class Spines {
        public static BlueCircle: string = 'circleBlue';
        public static YellowCircle: string = 'circleYellow';
        public static RedCircle: string = 'circleRed';
        public static BlueCube: string = 'squareBlue';
        public static YellowCube: string = 'squareYellow';
        public static RedCube: string = 'squareRed';
        public static BlueTriangle: string = 'triangleBlue';
        public static YellowTriangle: string = 'triangleYellow';
        public static RedTriangle: string = 'triangleRed';

        public static PreloadList: string[] = [
            Spines.BlueCircle,
            Spines.YellowCircle,
            Spines.RedCircle,
            Spines.BlueCube,
            Spines.YellowCube,
            Spines.RedCube,
            Spines.BlueTriangle,
            Spines.YellowTriangle,
            Spines.RedTriangle
        ];
    }
}
