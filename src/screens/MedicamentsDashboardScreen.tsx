import { Plus } from 'lucide-react-native';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CreateMedicamentModal from '../components/CreateMedicamentModal';
import { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';

const useMedicamentsDashboard = () => {
  const { medicationsHook } = useContext(AppContext);
  return {
    medications: medicationsHook.medications,
  };
};

export default function MedicamentsDashboardScreen() {
  const { medications } = useMedicamentsDashboard();
  console.log('🚀 ~ MedicamentsDashboardScreen ~ medications:', medications);

  const [createMedicamentModalIsOpen, setCreateMedicamentModalOpen] =
    useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <CreateMedicamentModal
        visible={createMedicamentModalIsOpen}
        onClose={() => setCreateMedicamentModalOpen(false)}
      />

      <Text style={styles.title}>Medicamentos</Text>

      {/* Lista de medicamentos */}
      <View>
        {medications.map(med => (
          <View key={med.medicamentName} style={styles.medicationListItem}>
            <Text style={styles.medicationListItemTitle}>
              {med.medicamentName}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => setCreateMedicamentModalOpen(true)}
      >
        <Plus color="white" />
        <Text style={styles.addButtonText}>Agregar Medicamento</Text>
      </Pressable>
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
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6fa2db',
    padding: 12,
    borderRadius: 64,
    marginTop: 16,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 18,
    fontFamily: 'Inter_24pt-SemiBold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  medicationListItem: {
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  medicationListItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-Medium',
  },
});
