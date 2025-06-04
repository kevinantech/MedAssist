import { useColorScheme } from 'react-native';
import { StatusBar } from 'react-native';

const _StatusBar = () => {
  const colorScheme = useColorScheme();
  return (
    <StatusBar
      barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={colorScheme === 'dark' ? 'black' : 'white'}
    />
  );
};

export default _StatusBar;
