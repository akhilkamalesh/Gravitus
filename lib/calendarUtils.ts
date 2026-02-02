import { ExerciseLog, Split, workout } from "@/types/firestoreTypes";

// Type for the roadmap map that will be used by the Calendar
export interface CalendarMarking {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    customStyles?: {
        container?: any;
        text?: any;
    };
    workoutName?: string; // Custom field to store workout name for that day
    isFuture?: boolean;
}

/**
 * Projects future workouts based on the user's split and a start date.
 * Currently only supports splits that have specific days of week assigned (e.g. "Monday", "Wednesday").
 * For rolling splits (no daysOfWeek), it returns an empty map for now.
 * 
 * @param split The user's current split
 * @param startDate The date to start projecting from (usually today)
 * @param monthsToProject Number of months to project into the future
 * @returns A map of date string (YYYY-MM-DD) to CalendarMarking
 */
export const projectFutureWorkouts = (
    split: Split | null,
    startDate: Date = new Date(),
    monthsToProject: number = 3
): Record<string, CalendarMarking> => {

    if (!split || !split.scheduledDays || split.scheduledDays.length === 0) {
        return {};
    }

    const markings: Record<string, CalendarMarking> = {};
    const daysMap: Record<string, number> = {
        "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6,
        "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6
    };

    // Filter valid days and sort them
    const validDays = split.scheduledDays
        .map(d => daysMap[d])
        .filter(d => d !== undefined)
        .sort((a, b) => a - b);

    if (validDays.length === 0) return {};

    const currentDate = new Date(startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + monthsToProject);

    // Iterate through dates until endDate
    while (currentDate <= endDate) {
        const currentDayOfWeek = currentDate.getDay();

        if (validDays.includes(currentDayOfWeek)) {
            const dateStr = currentDate.toISOString().split('T')[0];
            // Find which workout corresponds to this day
            // Note: This logic assumes workouts array aligns with scheduledDays array 
            // OR we just cycle through them. 
            // For simplicty in V1, if scheduledDays is used, we assume strict mapping if length matches,
            // otherwise we just mark it as a "Workout" day.

            let workoutName = "Scheduled Workout";

            // Try to find specific workout name if array lengths match
            if (split.workouts.length === split.scheduledDays.length) {
                // split.scheduledDays is array of strings e.g. ["Monday", "Wednesday"]
                // We need to match the current day string to the index
                const dayName = Object.keys(daysMap).find(key => daysMap[key] === currentDayOfWeek);
                // We need to handle finding the *exact* string used in scheduledDays.
                const matchingDayString = split.scheduledDays.find(d => daysMap[d] === currentDayOfWeek);

                const index = split.scheduledDays.indexOf(matchingDayString || "");
                if (index !== -1 && split.workouts[index]) {
                    workoutName = split.workouts[index].dayName;
                }
            } else {
                // Fallback or rolling logic on specific days? 
                // If workouts < days, we cycle?
                // For now, generic name if not 1:1 mapping
                workoutName = "Workout";
            }

            markings[dateStr] = {
                marked: true,
                dotColor: '#4A90E2', // Future color (Blue)
                isFuture: true,
                workoutName: workoutName
            };
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return markings;
};

/**
 * Formats past exercise logs into calendar markings.
 * 
 * @param logs List of exercise logs
 * @returns A map of date string (YYYY-MM-DD) to CalendarMarking
 */
export const formatLogsForCalendar = (logs: ExerciseLog[]): Record<string, CalendarMarking> => {
    const markings: Record<string, CalendarMarking> = {};

    logs.forEach(log => {
        // Use localDate if available, otherwise date. 
        // Ensure we only take the YYYY-MM-DD part.
        let dateStr = (log.localDate || log.date);

        if (dateStr.includes("/")) {
            dateStr = convertDateString(dateStr);
        } else {
            dateStr = dateStr.split("T")[0];
        }

        markings[dateStr] = {
            marked: true,
            dotColor: '#00D09C', // Completed color (Green/Teal from Gravitus theme?)
            isFuture: false,
            workoutName: log.workoutDay || "Completed Workout"
        };
    });

    return markings;
};

/**
 * Merges past logs and future projections.
 * Past logs overwrite future projections for the same date (usually today or past).
 */
export const getCalendarMarkings = (
    logs: ExerciseLog[],
    split: Split | null
): Record<string, CalendarMarking> => {
    const today = new Date();
    const futureMarkings = projectFutureWorkouts(split, today);
    const pastMarkings = formatLogsForCalendar(logs);

    // Merge: Past marks overwrite future ones (e.g. if I did today's workout, show it as done)
    return { ...futureMarkings, ...pastMarkings };
};

export const convertDateString = (dateString: string): string => {
    // 1/31/2026 
    // 2026-01-31 
    const dateValues = dateString.split("/");

    if (dateValues[0].length == 1) {
        dateValues[0] = "0" + dateValues[0];
    }
    if (dateValues[1].length == 1) {
        dateValues[1] = "0" + dateValues[1];
    }
    return `${dateValues[2]}-${dateValues[0]}-${dateValues[1]}`;
};