import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReminders } from '../../hooks/useReminders';
import { timePipe } from '../../utils/timePipe';
import { Info } from 'lucide-react-native';

const getMedicamentSingleName = (fullName: string) => {
  const firstWord = fullName.trim().split(' ')[0];
  return firstWord.length > 20 ? firstWord.slice(0, 20) + '...' : firstWord;
};

export default function HomeScreen() {
  const { remindersForToday } = useReminders();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text style={styles.title}>MedAssist</Text>
      {!!remindersForToday[0] && (
        <View style={mainReminderStyles.continaer}>
          <Text style={mainReminderStyles.label}>Próxima Dosis</Text>
          <Text style={mainReminderStyles.hour}>
            {timePipe(
              remindersForToday[0].time.getHours(),
              remindersForToday[0].time.getMinutes()
            )}
          </Text>
          <Text style={mainReminderStyles.caption}>
            {remindersForToday[0].medicationName}
          </Text>
        </View>
      )}
      <Text style={styles.subtitle}>Recordatorios</Text>
      <View style={remindersStyles.container}>
        {remindersForToday.length >= 1 ? (
          remindersForToday.map(reminder => (
            <View
              key={reminder.time.getTime()}
              style={remindersStyles.itemContainer}
            >
              <Text style={remindersStyles.hourLabel}>
                {timePipe(reminder.time.getHours(), reminder.time.getMinutes())}
              </Text>
              <Text style={remindersStyles.itemLabel}>
                {getMedicamentSingleName(reminder.medicationName)}
              </Text>
              <Info color="#64748b" size={20} />
            </View>
          ))
        ) : (
          <Text style={remindersStyles.noRemindersText}>
            No hay recordatorios todavía
          </Text>
        )}
      </View>

      <Text style={styles.subtitle}>Seguimientos</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
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

const mainReminderStyles = StyleSheet.create({
  continaer: {
    gap: 4,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#e0f2fe',
  },
  label: {
    fontSize: 18,
    fontFamily: 'Inter_24pt-SemiBold',
  },
  hour: {
    fontSize: 32,
    fontFamily: 'Inter_24pt-SemiBold',
  },
  caption: {
    fontSize: 18,
  },
});

const remindersStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    gap: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  hourLabel: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-SemiBold',
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 16,
    fontFamily: 'Inter_24pt-Regular',
  },
  noRemindersText: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-Regular',
  },
});
