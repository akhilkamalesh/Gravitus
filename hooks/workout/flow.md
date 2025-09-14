# This document will capture the high level flow of how the workout hooks interact

## Exercise Change Example
Exercise change (add/remove/update)
- Handled by useWorkoutEdits, which uses the setters (setWorkout, setLog) provided by useTodayWorkout.
- That updates local React state (workout and/or log).

Log change side-effect
- Because usePlaceholders has an effect that depends on the set of exerciseIds in log, it will re-run and fetch latest placeholders when the exercise list changes.
- This keeps your input hints (last weights/reps) fresh.

All local, captured in state
- workout, log, and placeholders are just React state.
- The screen re-renders automatically when any of them change, so you see the edits immediately.

Save boundary
- Since save is dependent on log, this function rememoizes whenever log changes
- When you press Save, saveWorkout (from useTodayWorkout) takes the current log state, sends it to your workoutService.completeWorkout, and then calls refresh().
- refresh() re-hydrates split/workout/log/isDone from the backend.
- If the backend reports “done,” it flips isDone.