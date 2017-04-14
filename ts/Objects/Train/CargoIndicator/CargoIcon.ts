module ExamAssignmentMA {
    export class CargoIcon {
        public cargoType: CargoTypes;
        public icon: Phaser.Image;

        constructor(type: CargoTypes, icon: Phaser.Image) {
            this.cargoType = type;
            this.icon = icon;
        }
    }
}
