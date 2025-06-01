import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="flex-1 bg-black p-4">
      {/* Header */}
      {/* <Text className="text-white text-2xl font-bold mb-6">Search</Text> */}

      {/* Search Bar */}
      <View className="flex-row items-center bg-neutral-800 rounded-lg p-3">
        <Ionicons name="search-outline" size={24} color="white" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          placeholderTextColor="gray"
          className="text-white ml-3 flex-1"
        />
      </View>
    </View>
  );
}
