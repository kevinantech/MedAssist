import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReminders } from '../../hooks/useReminders';

export default function HomeScreen() {
  const { remindersForToday } = useReminders();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text style={styles.title}>MedAssist</Text>
      <Text style={styles.subtitle}>Recordatorios</Text>
      {remindersForToday.map(reminder => (
        <View key={reminder.time.getTime()}>
          <Text>{reminder.medicationName}</Text>
        </View>
      ))}
      <Text style={styles.subtitle}>Seguimientos</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter_24pt-Bold',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Inter_24pt-SemiBold',
    marginVertical: 16,
  },
});
