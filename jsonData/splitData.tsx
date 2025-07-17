// Split type
/*export interface Split {
    id: string;
    name: string;
    description: string;
    repeatDays: boolean;
    weeksDuration: number;
    workouts: workout[];
    createdAt?: Timestamp; // ✅ optional if not always present
    createdFromTemplateId?: string; // ✅ tracks template source
  }
  */

  /**
   * {"createdAt": {"nanoseconds": 548000000, "seconds": 1750090136}, "createdFromTemplateId": "", "description": "Test Split ", 
   * "id": "uE0t9uBKbYn8Bhs3b9Ee", "name": "Test Split 2", "repeatDays": false, "weeksDuration": 6, 
   * "workouts": [{"dayName": "Push", "exercises": [Array]}, {"dayName": "Legs", "exercises": [Array]}, {"dayName": "Back", "exercises": [Array]}]}
   */

  /*
  {"exerciseData": {"id": "benchPress", "motion": "Press", "name": "Bench Press", "primaryMuscleGroup": "Chest", "secondaryMuscleGroup": [Array]}, "exerciseId": "benchPress", "reps": {"max": 8, "min": 4}, "sets": 3}
  */

export const arnold = {
    "id": "arnold",
    "name": "Arnold",
    "description": "A weekly recurring split that seperates the workout by torso and limbs (arms and legs).",
    "repeatDays": false,
    "weeksDuration": 10,
    "workouts": [
        {"dayName": "Torso", "exercises": [
            {"exerciseId": "benchPress", "reps": {"max": 8, "min": 4}, "sets": 3},
            {"exerciseId": "pullUps", "reps": {"max": 12, "min": 6}, "sets": 3},
            {"exerciseId": "machineInclinePress", "reps": {"max": 10, "min": 6}, "sets": 3},
            {"exerciseId": "cableRow", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "chestFly", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "tBarRow", "reps": {"max": 10, "min": 6}, "sets": 3},
            {"exerciseId": "machineAbCrunches", "reps": {"max": 15, "min": 10}, "sets": 2},
            {"exerciseId": "hangingLegRaise", "reps": {"max": 15, "min": 10}, "sets": 2},
        ]},
        {"dayName": "Arms", "exercises": [
            {"exerciseId": "dumbbellShoulderPress", "reps": {"max": 8, "min": 4}, "sets": 3},
            {"exerciseId": "tricepRopePushdown", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "dumbbellInclineCurls", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "dumbbellLateralRaise", "reps": {"max": 15, "min": 10}, "sets": 3},
            {"exerciseId": "cableOverheadExtensions", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "dumbbellHammerCurls", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "cableRearDeltFly", "reps": {"max": 12, "min": 8}, "sets": 2},
        ]},
        {"dayName": "Legs", "exercises": [
            {"exerciseId": "smithMachineSquats", "reps": {"max": 8, "min": 4}, "sets": 3},
            {"exerciseId": "legExtension", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "lyingHamstringCurl", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "seatedCalfRaises", "reps": {"max": 15, "min": 10}, "sets": 3},
            {"exerciseId": "plateLoadedLegPress", "reps": {"max": 12, "min": 6}, "sets": 3},
            {"exerciseId": "adductionMachine", "reps": {"max": 15, "min": 10}, "sets": 2},
            {"exerciseId": "abductionMachine", "reps": {"max": 15, "min": 10}, "sets": 1},
        ]},
        {"dayName": "Torso", "exercises": [
            {"exerciseId": "inclineDumbbellPress", "reps": {"max": 8, "min": 4}, "sets": 3},
            {"exerciseId": "pullUps", "reps": {"max": 12, "min": 6}, "sets": 3},
            {"exerciseId": "machineFlatPress", "reps": {"max": 10, "min": 6}, "sets": 3},
            {"exerciseId": "isoLateralHighRow", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "chestFly", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "tBarRow", "reps": {"max": 10, "min": 6}, "sets": 3},
            {"exerciseId": "machineAbCrunches", "reps": {"max": 15, "min": 10}, "sets": 2},
            {"exerciseId": "hangingLegRaise", "reps": {"max": 15, "min": 10}, "sets": 2},
        ]},
        {"dayName": "Arms", "exercises": [
            {"exerciseId": "closeGripBenchPress", "reps": {"max": 10, "min": 6}, "sets": 3},
            {"exerciseId": "cableLateralRaise", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "cableOverheadExtensions", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "dumbbellPreacherCurls", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "machineShoulderPress", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "cableInclineCurl", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "cableRearDeltFly", "reps": {"max": 12, "min": 8}, "sets": 2},
        ]},
        {"dayName": "Legs", "exercises": [
            {"exerciseId": "stiffLegDeadlifts", "reps": {"max": 8, "min": 4}, "sets": 3},
            {"exerciseId": "legExtension", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "lyingHamstringCurl", "reps": {"max": 12, "min": 8}, "sets": 3},
            {"exerciseId": "standingCalfRaises", "reps": {"max": 15, "min": 10}, "sets": 3},
            {"exerciseId": "plateLoadedLegPress", "reps": {"max": 12, "min": 6}, "sets": 3},
            {"exerciseId": "adductionMachine", "reps": {"max": 15, "min": 10}, "sets": 2},
            {"exerciseId": "abductionMachine", "reps": {"max": 15, "min": 10}, "sets": 1},
        ]},
    ]
}

export const upperLower = {
    
}