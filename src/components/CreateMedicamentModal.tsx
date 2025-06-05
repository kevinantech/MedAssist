import { zodResolver } from '@hookform/resolvers/zod';
import { AlarmClockPlus, Check, X } from 'lucide-react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AppContext } from '../contexts/AppContext';
import {
  MedicationBody,
  MedicationBodyBusinessRulesSchema,
  MedicationStatus,
} from '../interfaces/medicament.interface';
import { timePipe } from '../utils/timePipe';

const useMedicamentModal = (onClose: () => void) => {
  const { medicationsHook } = useContext(AppContext);
  const { control, handleSubmit, watch, reset } = useForm<MedicationBody>({
    resolver: zodResolver(MedicationBodyBusinessRulesSchema),
    defaultValues: {
      doseNumberPerDay: '' as any,
      customTimes: [],
      status: MedicationStatus.ACTIVE,
    },
  });

  const customTimes = useFieldArray({ control, name: 'customTimes' });
  const [isCustomTimesExceeded, setIsCustomTimesExceeded] = useState(false);

  const numberOfDosesPerDay = watch('doseNumberPerDay');
  const scheduleRecommendation: string = useMemo(() => {
    return numberOfDosesPerDay
      ? `1 cada ${Math.floor(24 / numberOfDosesPerDay)} horas`
      : '';
  }, [numberOfDosesPerDay]);

  // ** Disabling the custom time button if the number of custom times exceeds the number of doses per day
  useEffect(() => {
    if (
      !isCustomTimesExceeded &&
      customTimes.fields.length >= numberOfDosesPerDay
    ) {
      setIsCustomTimesExceeded(true);
    } else if (
      isCustomTimesExceeded &&
      customTimes.fields.length < numberOfDosesPerDay
    ) {
      setIsCustomTimesExceeded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customTimes.fields.length, numberOfDosesPerDay]);

  // ** This function is called when the user confirms a custom time
  const handleCustomTimeConfirmation = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    customTimes.append({
      hours,
      minutes,
      value: timePipe(hours, minutes),
    });
  };

  const handleRemoveCustomTime = (index: number) => customTimes.remove(index);

  const handleSubmitError = (error: FieldErrors<MedicationBody>) => {
    Alert.alert(
      'Datos incompletos o inválidos',
      error.customTimes
        ? error.customTimes.message
        : 'Por favor, completa todos los campos obligatorios.',
      [
        {
          text: 'Aceptar',
        },
      ]
    );
  };

  const handleNewMedication = async (data: MedicationBody) => {
    await medicationsHook.handleNewMedication({
      ...data,
      startDate: new Date().toString(),
    });
    reset();
    onClose();
  };

  return {
    control,
    customTimesFields: customTimes.fields,
    isCustomTimesExceeded,
    handleCustomTimeConfirmation,
    handleNewMedication,
    handleRemoveCustomTime,
    handleSubmit,
    handleSubmitError,
    scheduleRecommendation,
  };
};

export type CreateMedicamentModalProps = {
  visible: boolean;
  onClose: () => void;
};

const CreateMedicamentModal: React.FC<CreateMedicamentModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    control,
    customTimesFields,
    isCustomTimesExceeded,
    handleCustomTimeConfirmation,
    handleNewMedication,
    handleRemoveCustomTime,
    handleSubmit,
    handleSubmitError,
    scheduleRecommendation,
  } = useMedicamentModal(onClose);

  const [customTimePickerVisible, setCustomTimePickerVisible] = useState(false);

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Añadir Medicamento</Text>
        <Text style={styles.label}>Nombre del Medicamento *</Text>
        <Controller
          name="medicamentName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Text style={styles.label}>Número de Dosis por Día *</Text>
        <Controller
          name="doseNumberPerDay"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value?.toString()}
              onChangeText={text => onChange(Number(text))}
              keyboardType="numeric"
            />
          )}
        />
        {scheduleRecommendation && (
          <Text style={styles.helperText}>
            Recomendación: {scheduleRecommendation}
          </Text>
        )}

        <Text style={styles.label}>Días de Tratamiento *</Text>
        <Controller
          name="treatmentDays"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value?.toString()}
              onChangeText={text =>
                onChange(isNaN(Number(text)) ? '' : Number(text))
              }
              keyboardType="numeric"
            />
          )}
        />
        <Text style={styles.label}>Horarios Personalizados *</Text>

        {/* Modal para escoger hora */}
        <DateTimePickerModal
          isVisible={customTimePickerVisible}
          mode="time"
          onConfirm={d => {
            handleCustomTimeConfirmation(d);
            setCustomTimePickerVisible(false);
          }}
          onCancel={() => setCustomTimePickerVisible(false)}
          // Personalización Android:
          display={Platform.OS === 'android' ? 'spinner' : 'default'}
          locale="es_ES" // Español
          cancelTextIOS="Cancelar"
          confirmTextIOS="Confirmar"
        />

        {/* Lista de horarios seleccionados  */}
        {customTimesFields.map((item, index) => (
          <View key={item.id} style={styles.customTimeContainer}>
            <Text style={styles.customTimeValue}>{item.value}</Text>
            <Pressable
              style={styles.customTimeRemoveButton}
              onPress={() => handleRemoveCustomTime(index)}
            >
              <Text style={styles.customTimeRemoveButtonText}>Quitar</Text>
            </Pressable>
          </View>
        ))}

        <Pressable
          disabled={isCustomTimesExceeded}
          onPress={() =>
            isCustomTimesExceeded ? null : setCustomTimePickerVisible(true)
          }
          style={[
            styles.customTimeButton,
            isCustomTimesExceeded ? styles.customTimeButtonDisabled : {},
          ]}
        >
          <AlarmClockPlus color="#111827" />
          <Text style={styles.customTimeButtonText}>
            Añadir Hora Personalizada
          </Text>
        </Pressable>

        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSubmit(handleNewMedication, handleSubmitError)}
          >
            <Check size={24} color="white" />
            <Text style={styles.actionButtonText}>Guardar</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => onClose()}
          >
            <X size={24} color="white" />
            <Text style={styles.actionButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title_container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 16,
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
  label: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-SemiBold',
    marginVertical: 12,
    marginHorizontal: 8,
    color: '#111827',
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Inter_24pt-Regular',
    marginBottom: 12,
    marginHorizontal: 8,
    color: '#6b7280', // Gray color for helper text
  },
  input: {
    borderWidth: 1,
    borderColor: '#111827',
    fontSize: 16,
    fontFamily: 'Inter_24pt-Medium',
    marginBottom: 12,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  customTimeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
    backgroundColor: 'white',
  },
  customTimeButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#f3f4f6', // Light gray background for disabled state
  },
  customTimeButtonText: {
    marginRight: 16,
    fontFamily: 'Inter_24pt-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  customTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#111827',
  },
  customTimeValue: {
    flex: 1,
    padding: 12,
    fontFamily: 'Inter_24pt-Medium',
    fontSize: 16,
    textAlign: 'center',
    color: '#111827',
  },
  customTimeRemoveButton: {
    marginRight: 24,
  },
  customTimeRemoveButtonText: {
    fontFamily: 'Inter_24pt-SemiBold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 32,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 24,
    marginBottom: 8,
  },
  actionButtonText: {
    color: 'white',
    marginRight: (24 + 8) / 2, // 24 for icon size, 8 for gap
    fontFamily: 'Inter_24pt-SemiBold',
    fontSize: 16,
  },
});

export default CreateMedicamentModal;
