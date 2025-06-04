import { Home } from 'lucide-react-native';
import { TabIconProps } from '../../types/tabIconProps';

const HomeIcon = (props: TabIconProps) => {
  const { color, size } = props;
  return <Home size={size} color={color} />;
};
export default HomeIcon;
