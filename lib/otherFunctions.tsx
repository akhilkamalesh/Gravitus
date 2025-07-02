// Estimated workout time

export const estimateWorkoutTime = (exerciseCount: number, setsPerExercise: number): string => {
    const secondsPerSet = 60; // average effort + rest per set
    const setupTimePerExercise = 180; // seconds
    const restTimePerSet = 120; // seconds
    
    const totalSets = exerciseCount * setsPerExercise;
    const totalTimeSeconds = (totalSets * (secondsPerSet + restTimePerSet)) + (exerciseCount * setupTimePerExercise);
    
    const minutes = Math.floor(totalTimeSeconds / 60);
  
    return `${minutes}`
}


// Estimated 1RM Max
  