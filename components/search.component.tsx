import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { useUIStore } from '@/lib/state/ui-state';
import { useDebouncedCallback } from 'use-debounce';
import { queryClientContext } from '@/app/_layout';
import { UseMutationResult } from '@tanstack/react-query';

type Props = {
  queryKey: string;
};
const Search = (props: Props) => {
  const { setSearch } = useUIStore((state) => state);

  const debouncedSearch = useDebouncedCallback(
    (text: string) => {
      setSearch(text);
    },
    500,
    { leading: true, trailing: true }
  );

  const handleSearch = (text: string) => {
    debouncedSearch(text);
  };

  return (
    <View className="w-full h-16 px-5 bg-gray-50">
      <TextInput
        placeholderTextColor="gray"
        onChangeText={handleSearch}
        className="w-full h-full text-lg font-sfBold"
        placeholder="Search"
      />
    </View>
  );
};

export default Search;
