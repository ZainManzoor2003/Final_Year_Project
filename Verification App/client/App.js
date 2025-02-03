import ContextApiStates from './ContextApi/ContextApiStates';
import Start from './start';
import {AppRegistry} from 'react-native';

AppRegistry.registerComponent('client', () => App);

export default function App() {
  return (
    <ContextApiStates>
      <Start/>
    </ContextApiStates>
  );
}

