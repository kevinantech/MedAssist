import notifee, { TriggerType } from '@notifee/react-native';

export const scheduleNotification = async (options: {
  date: string;
  title: string;
  body: string;
}) => {
  const { date, title, body } = options;
  console.log('🚀 ~ new Date(date).getTime():', new Date(date).getTime());

  // 1. Crear canal (Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Notificaciones',
  });

  // 2. Programar notificación
  await notifee.createTriggerNotification(
    {
      title,
      body,
      android: {
        channelId,
        sound: 'morning_joy', // Sonido personalizado
        pressAction: {
          id: 'default',
          launchActivity: 'default', // Abre la app al tocar
        },
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: new Date(date).getTime(), // Fecha exacta en ms
    }
  );
};

// Ejemplo de uso:
