import { View, StyleSheet } from "react-native";
import NumericInputField from "./NumericInputField";
import UnitToggle from "./UnitToggle";

type Props = {
  label: string;
  value: string;
  unit: string;
  unitOptions: string[];
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
};

export default function NumericInputWithUnit({
  label,
  value,
  unit,
  unitOptions,
  onValueChange,
  onUnitChange,
}: Props) {
  return (
    <View style={styles.row}>
      <NumericInputField
        label={label}
        value={value}
        unit={unit}
        onChange={onValueChange}
      />

      <UnitToggle
        options={unitOptions}
        selected={unit}
        onChange={onUnitChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    // marginBottom: 16,
    // marginTop: 16,
    alignItems: "flex-end",
  },
});
