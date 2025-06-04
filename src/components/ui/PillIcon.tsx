import { Pill } from 'lucide-react-native';
import { TabIconProps } from '../../types/tabIconProps';

const PillIcon = (props: TabIconProps) => {
  const { color, size } = props;
  return <Pill size={size} color={color} />;
};

export default PillIcon;
