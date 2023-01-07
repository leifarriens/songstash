import { useReducer } from 'react';
import { View } from 'react-native';
import { filterReducer, initialFilterState } from './filter';
import { Filter } from './components/Filter';
import { Recommendations } from './components/Recommendations';

export function Discover() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  return (
    <View>
      <Filter filters={filters} dispatch={dispatch} />

      <Recommendations filters={filters} />
    </View>
  );
}
