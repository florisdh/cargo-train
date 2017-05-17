module ExamAssignmentMA {
    /**
     * The reference to all spine files and container of all items to be preloaded.
     */
    export class Spines {
        public static BlueCircle: string = 'circleBlue';
        public static GreenCircle: string = 'circleGreen';
        public static RedCircle: string = 'circleRed';
        public static BlueCube: string = 'squareBlue';
        public static GreenCube: string = 'squareGreen';
        public static RedCube: string = 'squareRed';
        public static BlueTriangle: string = 'triangleBlue';
        public static GreenTriangle: string = 'triangleGreen';
        public static RedTriangle: string = 'triangleRed';

        public static PreloadList: string[] = [
            Spines.BlueCircle,
            Spines.GreenCircle,
            Spines.RedCircle,
            Spines.BlueCube,
            Spines.GreenCube,
            Spines.RedCube,
            Spines.BlueTriangle,
            Spines.GreenTriangle,
            Spines.RedTriangle
        ];
    }
}
