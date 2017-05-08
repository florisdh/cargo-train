module ExamAssignmentMA {
    /**
     * The reference to all audio files and container of all items to be preloaded.
     */
    export class Sounds {

        // Specify all sounds here
        // InGame
        public static CorrectCargo: string = 'correct';
        public static IncorrectCargo: string = 'incorrect';

        // Add all sounds here
        public static PreloadList: string[] = [
            Sounds.CorrectCargo,
            Sounds.IncorrectCargo
        ];
    }
}
