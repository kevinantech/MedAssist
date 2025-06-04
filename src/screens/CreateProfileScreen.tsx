import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import {
  Calendar,
  Heart,
  Phone,
  Shield,
  Stethoscope,
  User,
} from 'lucide-react-native';
import React, { useContext } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import _StatusBar from '../components/_StatusBar';
import { AppContext } from '../contexts/AppContext';
import { Gender } from '../interfaces/gender-enum';
import { PorfileSchema, Profile } from '../interfaces/profile.interface';
import { RH } from '../interfaces/rh-enum';
import { datePipe } from '../utils/datePipe';

const useCreateProfile = () => {
  const { control, handleSubmit } = useForm<Profile>({
    resolver: zodResolver(PorfileSchema),
  });
  const {
    profileHook: { handleNewProfile },
  } = useContext(AppContext);

  const handleFormError = (_error: FieldErrors<Profile>) => {
    console.log('🚀 ~ handleFormError ~ _error:', _error);
    Alert.alert(
      'Error al crear el perfil',
      'Por favor, complete todos los campos obligatorios (*) correctamente.',
      [
        {
          text: 'Aceptar',
        },
      ]
    );
  };

  const handleCreateProfile = (data: Profile) => {
    Alert.alert('Perfil Creado', 'Su perfil ha sido creado exitosamente.', [
      {
        text: 'Aceptar',
        onPress: () => handleNewProfile(data),
      },
    ]);
  };

  return {
    control,
    handleSubmit,
    handleCreateProfile,
    handleFormError,
  };
};

export default function CreateProfileScreen() {
  const { control, handleSubmit, handleCreateProfile, handleFormError } =
    useCreateProfile();
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <_StatusBar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.title_container}>
          <Heart color="#ef4444" size={32} />
          <Text style={styles.title}>MedAssist</Text>
        </View>

        <Text style={styles.subtitle}>
          Gestión de medicamentos y seguimiento de síntomas
        </Text>

        <View style={styles.form_container}>
          {/* Form Header */}
          <View style={styles.form_header}>
            <View style={styles.form_header_title_container}>
              <User color="#FFFFFF" size={24} />
              <Text style={styles.form_header_title}>Crear Perfil</Text>
            </View>
            <Text style={styles.form_header_subtitle}>
              Complete la información para crear su perfil en la aplicación
            </Text>
          </View>

          {/* Información Personal */}
          <View style={styles.form_section_container}>
            <View style={styles.form_section_title_container}>
              <User color="#2563eb" size={20} />
              <Text style={styles.form_section_title}>
                Información Personal
              </Text>
            </View>

            <Text style={styles.label}>Nombre Completo *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su nombre completo"
                  placeholderTextColor="lightgray"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Text style={styles.label}>Cédula de Ciudadanía *</Text>
            <Controller
              control={control}
              name="nationalId"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 1234567890"
                  placeholderTextColor="lightgray"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Text style={styles.label}>Tpo de Sangre (RH) *</Text>
            <Controller
              control={control}
              name="rh"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={itemValue => onChange(itemValue)}
                    dropdownIconColor="lightgray"
                  >
                    <Picker.Item
                      label="Seleccione su tipo de sangre"
                      value=""
                    />
                    <Picker.Item label={RH.O_POSITIVE} value={RH.O_POSITIVE} />
                    <Picker.Item label={RH.O_NEGATIVE} value={RH.O_NEGATIVE} />
                    <Picker.Item label={RH.A_POSITIVE} value={RH.A_POSITIVE} />
                    <Picker.Item label={RH.A_NEGATIVE} value={RH.A_NEGATIVE} />
                    <Picker.Item label={RH.B_POSITIVE} value={RH.B_POSITIVE} />
                    <Picker.Item label={RH.B_NEGATIVE} value={RH.B_NEGATIVE} />
                    <Picker.Item
                      label={RH.AB_POSITIVE}
                      value={RH.AB_POSITIVE}
                    />
                    <Picker.Item
                      label={RH.AB_NEGATIVE}
                      value={RH.AB_NEGATIVE}
                    />
                  </Picker>
                </View>
              )}
            />

            <Text style={styles.label}>Fecha de Nacimiento *</Text>
            <Controller
              control={control}
              name="birthdayDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    style={[styles.input, styles.input_date_container]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Calendar size={16} />
                    <Text>
                      {value ? datePipe(value) : 'Seleccione una fecha'}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(value || Date.now())}
                      mode="date"
                      display="spinner"
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) {
                          onChange(date.toISOString().split('T')[0]);
                        }
                      }}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
            />

            <Text style={styles.label}>Género *</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={itemValue => onChange(itemValue)}
                    dropdownIconColor="lightgray"
                  >
                    <Picker.Item label="Seleccione su género" value="" />
                    <Picker.Item label="Femenino" value={Gender.FEMALE} />
                    <Picker.Item label="Masculino" value={Gender.MALE} />
                  </Picker>
                </View>
              )}
            />
          </View>

          {/* Información de Contacto */}
          <View style={styles.form_section_container}>
            <View style={styles.form_section_title_container}>
              <Phone color="#2563eb" size={20} />
              <Text style={styles.form_section_title}>
                Información de Contacto
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Teléfono de Contacto</Text>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    maxLength={10}
                    placeholder="Ej. 3001234567"
                    placeholderTextColor="lightgray"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />

              <Text style={styles.label}>Dirección de Residencia *</Text>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    multiline
                    numberOfLines={4}
                    placeholder="Ingrese su dirección completa"
                    placeholderTextColor="lightgray"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />

              <Text style={styles.label}>Departamento de Residencia *</Text>
              <Controller
                control={control}
                name="departmentOfResidence"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese su departamento"
                    placeholderTextColor="lightgray"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
          </View>

          {/* Información Médica */}
          <View style={styles.form_section_container}>
            <View style={styles.form_section_title_container}>
              <Stethoscope color="#2563eb" size={20} />
              <Text style={styles.form_section_title}>Información Médica</Text>
            </View>
            <View>
              <Text style={styles.label}>
                EPS (Entidad Promotora de Salud) *
              </Text>
              <Controller
                control={control}
                name="colombianHealthProvider"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Sura"
                    placeholderTextColor="lightgray"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />

              <Text style={styles.label}>Enfermedad o Condición Médica</Text>
              <Controller
                control={control}
                name="diseases"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    editable
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="lightgray"
                    placeholder="Describa su condición médica principal, diagnosticos relevantes o enfermedades crónicas"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            <Text style={styles.diseases_caption}>
              Esta información ayudara a personalizar el seguimiento de sus
              medicamentos y síntomas.
            </Text>
            <Pressable
              style={styles.buttonContainer}
              onPress={handleSubmit(handleCreateProfile, handleFormError)}
            >
              <Shield color="#FFFFFF" size={20} />
              <Text style={styles.button_title}>Crear Perfil</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.footer_container}>
          <Text style={styles.footer_caption}>* Campos Obligatorios</Text>
          <Text style={styles.footer_caption}>
            Su información médica está protegida y será utilizada unicamente
            para mejorar su experiencia en la aplicación.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#e0e7ff',
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginLeft: 8,
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginBottom: 32,
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  form_container: {
    overflow: 'hidden',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  form_header: {
    backgroundColor: '#2563eb',
    padding: 24,
  },
  form_header_title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  form_header_title: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  form_header_subtitle: {
    fontSize: 14,
    color: '#dbeafe',
  },
  form_section_container: {
    padding: 32,
  },
  form_section_title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  form_section_title: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  label: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    fontSize: 14,
    color: '#111827',
  },
  input_date_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 6,
    marginTop: 8,
    backgroundColor: '#FFF',
  },
  picker: {
    width: '100%',
    color: '#111827',
  },
  buttonContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  button_title: {
    marginLeft: 16,
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  diseases_caption: {
    marginTop: 8,
    fontSize: 13,
    color: '#6b7280',
  },
  footer_container: {
    marginTop: 0,
  },
  footer_caption: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
  },
});
