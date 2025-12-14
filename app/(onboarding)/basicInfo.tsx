import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import OnboardingLayout from "@/components/OnboardingLayout";
import TextInputField from "@/components/ui/TextInputField";
import SelectField from "@/components/ui/SelectField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import NumericInputField from "@/components/ui/NumericInputField";
import NumericInputWithUnit from "@/components/ui/NumberInputWithUnit";

export default function BasicInfoScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [weightUnit, setWeightUnit] = useState<"lb" | "kg">("lb");
  const [weight, setWeight] = useState("");

  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("ft");
  const [height, setHeight] = useState("");

  const [gender, setGender] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    age?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = "Name is required";

    if (!age)
      newErrors.age = "Age is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const onContinue = () => {
    if (!validate()) return;

    // TODO: Save profile info

    // update({
    //     name,
    //     age: Number(age),
    //     weight: weight ? Number(weight) : undefined,
    //     height: height ? Number(height) : undefined,
    //     gender,
    //     weightUnit,
    //     heightUnit,
    //   });

    router.push("/onboarding/fitness-goals");
  };

  return (
    <OnboardingLayout
      step={2}
      totalSteps={7}
      title="Tell us about yourself"
    >
        <TextInputField
            label="Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
        />

        <NumericInputField
            label="Age"
            value={age}
            onChange={setAge}
            error={errors.age}
        />

        <NumericInputWithUnit
            label="Weight"
            value={weight}
            unit={weightUnit}
            unitOptions={["lb", "kg"]}
            onValueChange={setWeight}
            onUnitChange={(u) => setWeightUnit(u as "lb" | "kg")}
        />

        <NumericInputWithUnit
            label="Height"
            value={height}
            unit={heightUnit}
            unitOptions={["in", "cm"]}
            onValueChange={setHeight}
            onUnitChange={(u) => setHeightUnit(u as "ft" | "cm")}
        />

        <SelectField
            label="Gender"
            value={gender}
            onChange={setGender}
            options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
        ]}
        />

      <View style={styles.cta}>
        <PrimaryButton label="Continue" onPress={onContinue} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: 24,
  },
});
