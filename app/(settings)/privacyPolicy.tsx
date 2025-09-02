import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import GravitusHeader from "@/components/GravitusHeader";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.welcome}>Privacy Policy</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.paragraph}>
          Effective Date: 08/01/2025
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.subheading}>a. Personal Information</Text>
        <Text style={styles.paragraph}>
          When you register an account, we may collect:
          {"\n"}- Name
          {"\n"}- Email address
          {"\n"}- Fitness goals and preferences (optional)
        </Text>

        <Text style={styles.subheading}>b. Workout Data</Text>
        <Text style={styles.paragraph}>
          We collect data related to your fitness activity, including:
          {"\n"}- Exercises performed
          {"\n"}- Sets, reps, weights used
          {"\n"}- Workout dates and times
          {"\n"}- Exercise history and progression
        </Text>

        <Text style={styles.subheading}>c. Device & Usage Information</Text>
        <Text style={styles.paragraph}>
          We may collect non-personal data automatically, such as:
          {"\n"}- Device type and model
          {"\n"}- Operating system
          {"\n"}- App usage patterns
          {"\n"}- Crash logs and performance data
        </Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the collected information to:
          {"\n"}- Provide core workout tracking functionality
          {"\n"}- Sync and back up your workout history
          {"\n"}- Personalize your fitness experience
          {"\n"}- Analyze trends to improve the App
          {"\n"}- Send occasional notifications and reminders (you can opt out)
        </Text>

        <Text style={styles.heading}>3. How We Share Your Information</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information. We may share limited information in the following cases:
          {"\n"}- With service providers who assist us in app functionality (e.g., cloud hosting)
          {"\n"}- When required by law or to protect legal rights
          {"\n"}- With your consent, such as when sharing workout data with friends or coaches
        </Text>

        <Text style={styles.heading}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement reasonable technical and organizational measures to protect your data. However, no system is completely secure. Please keep your login credentials safe and log out on shared devices.
        </Text>

        <Text style={styles.heading}>5. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your data as long as your account is active. You can request deletion at any time by contacting us at [insert contact email].
        </Text>

        <Text style={styles.heading}>6. Children’s Privacy</Text>
        <Text style={styles.paragraph}>
          This App is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
        </Text>

        <Text style={styles.heading}>7. Your Rights</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have the right to:
          {"\n"}- Access the personal data we hold about you
          {"\n"}- Request correction or deletion
          {"\n"}- Withdraw consent
          {"\n"}- File a complaint with a data protection authority
        </Text>

        <Text style={styles.heading}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy occasionally. We’ll notify you of significant changes via the App or email.
        </Text>

        <Text style={styles.heading}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns, contact us at:
          {"\n"}Email: gravitus@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  scrollContent: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
});
