module ExamAssignmentMA {
    /**
     * The reference to all audio files and container of all items to be preloaded.
     */
    export class Sounds {

        // Specify all sounds here
        // InGame
        public static CorrectCargo: string = 'correct';
        public static IncorrectCargo: string = 'incorrect';
        public static PickedupCargo: string = 'pickup';
        public static DroppedCargo: string = 'drop';
        public static WagonDoor: string = 'door';
        public static GameOver: string = 'gameOver';
        public static TimeLow: string = 'time';
        public static TrainWhistle: string = 'trainWhistle';

        // Add all sounds here
        public static PreloadList: string[] = [
            Sounds.CorrectCargo,
            Sounds.IncorrectCargo,
            Sounds.PickedupCargo,
            Sounds.DroppedCargo,
            Sounds.WagonDoor,
            Sounds.GameOver,
            Sounds.TimeLow,
            Sounds.TrainWhistle
        ];
    }
}
