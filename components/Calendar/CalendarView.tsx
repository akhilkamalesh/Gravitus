import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { CalendarMarking } from '@/lib/calendarUtils';

// Configure calendar theme colors to match Gravitus (Dark/Premium)
const THEME = {
    backgroundColor: '#000000',
    calendarBackground: '#000000', // Dark background
    textSectionTitleColor: '#666666',
    selectedDayBackgroundColor: '#FFF',
    selectedDayTextColor: '#000',
    todayTextColor: '#00D09C', // Teal for today
    dayTextColor: '#FFFFFF',
    textDisabledColor: '#333333',
    dotColor: '#00D09C',
    selectedDotColor: '#000000',
    arrowColor: '#FFF',
    monthTextColor: '#FFF',
    indicatorColor: '#FFF',
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '400' as const,
    textMonthFontWeight: '700' as const,
    textDayHeaderFontWeight: '400' as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14
};

interface CalendarViewProps {
    markings: Record<string, CalendarMarking>;
    onDayPress: (date: DateData) => void;
    selectedDate: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    markings,
    onDayPress,
    selectedDate,
}) => {

    // Transform our custom markings to react-native-calendars format
    const markedDates = useMemo(() => {
        const formatted: any = {};

        Object.keys(markings).forEach(date => {
            const mark = markings[date];
            formatted[date] = {
                marked: mark.marked,
                dotColor: mark.dotColor,
                // If this date is the selected one, override styles
                selected: date === selectedDate,
                selectedColor: date === selectedDate ? '#FFF' : undefined,
                selectedTextColor: date === selectedDate ? '#000' : undefined,
            };
        });

        // Ensure selectedDate is always marked as selected even if no data
        if (!formatted[selectedDate]) {
            formatted[selectedDate] = {
                selected: true,
                selectedColor: '#FFF',
                selectedTextColor: '#000'
            }
        } else {
            formatted[selectedDate].selected = true;
            formatted[selectedDate].selectedColor = '#FFF';
            formatted[selectedDate].selectedTextColor = '#000';
        }

        return formatted;
    }, [markings, selectedDate]);

    const commonProps = {
        current: selectedDate,
        onDayPress: onDayPress,
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat: 'MMMM yyyy',
        // Hide month navigation arrows. Default = false
        hideArrows: false,
        // Do not show days of other months in month page. Default = false
        hideExtraDays: true,
        // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        disableMonthChange: false,
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
        firstDay: 1, // Start on Monday
        // Hide day names. Default = false
        hideDayNames: false,
        // Show week numbers to the left. Default = false
        showWeekNumbers: false,
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays: true,
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths: true,
        // Marking type
        // markingType: 'dot', 
        markedDates: markedDates,
        // Theme
        theme: THEME,
    };

    return (
        <View style={styles.container}>
            <Calendar
                {...commonProps}
                current={selectedDate}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#333'
    },
});
