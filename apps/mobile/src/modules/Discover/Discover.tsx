import { useReducer } from 'react';
import { View } from 'react-native';
import { Filter, filterReducer, initialFilterState } from './components/Filter';
import { Recommendations } from './components/Recommendations';
import { useDebounce } from 'use-debounce';

export function Discover() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  const [debouncedFilters] = useDebounce(filters, 500);

  return (
    <View>
      <Filter filters={filters} dispatch={dispatch} />

      <Recommendations filters={debouncedFilters} />
    </View>
  );
}
