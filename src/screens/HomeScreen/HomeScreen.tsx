import { Info } from 'lucide-react-native';
import { useContext } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../../contexts/AppContext';
import { timePipe } from '../../utils/timePipe';

const getMedicamentSingleName = (fullName: string) => {
  const firstWord = fullName.trim().split(' ')[0];
  return firstWord.length > 20 ? firstWord.slice(0, 20) + '...' : firstWord;
};

export default function HomeScreen() {
  const {
    medicationsHook: { reminders },
  } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text style={styles.title}>MedAssist</Text>
      {!!reminders[0] && (
        <View style={mainReminderStyles.continaer}>
          <Text style={mainReminderStyles.label}>Próxima Dosis</Text>
          <Text style={mainReminderStyles.hour}>
            {timePipe(
              new Date(reminders[0].date).getHours(),
              new Date(reminders[0].date).getMinutes()
            )}
          </Text>
          <Text style={mainReminderStyles.caption}>
            {reminders[0].medicamentName}
          </Text>
        </View>
      )}
      <Text style={styles.subtitle}>Recordatorios</Text>
      <View style={remindersStyles.container}>
        {reminders.length >= 1 ? (
          reminders.map(reminder => (
            <View key={reminder.date} style={remindersStyles.itemContainer}>
              <Text style={remindersStyles.hourLabel}>
                {timePipe(
                  new Date(reminder.date).getHours(),
                  new Date(reminder.date).getMinutes()
                )}
              </Text>
              <Text style={remindersStyles.itemLabel}>
                {getMedicamentSingleName(reminder.medicamentName)}
              </Text>
              <Info color="#64748b" size={20} />
            </View>
          ))
        ) : (
          <Text style={remindersStyles.noRemindersText}>
            No hay recordatorios para hoy
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
