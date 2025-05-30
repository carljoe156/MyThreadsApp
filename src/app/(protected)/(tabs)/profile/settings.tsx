import { View, Text, Pressable, GestureResponderEvent } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 p-4 bg-black">
      {/* <Text className="text-white text-2xl font-bold mb-6">Settings</Text> */}

      {/* Account Settings */}
      <Pressable className="flex-row items-center mb-4">
        <Ionicons name="person-outline" size={24} color="white" />
        <Text className="text-white text-lg ml-4">Account Settings</Text>
      </Pressable>

      {/* Notifications */}
      <Pressable className="flex-row items-center mb-4">
        <Ionicons name="notifications-outline" size={24} color="white" />
        <Text className="text-white text-lg ml-4">Notifications</Text>
      </Pressable>

      {/* Privacy */}
      <Pressable className="flex-row items-center mb-4">
        <Ionicons name="lock-closed-outline" size={24} color="white" />
        <Text className="text-white text-lg ml-4">Privacy</Text>
      </Pressable>

      {/* Help */}
      <Pressable className="flex-row items-center mb-4">
        <Ionicons name="help-circle-outline" size={24} color="white" />
        <Text className="text-white text-lg ml-4">Help</Text>
      </Pressable>

      {/* Logout Option */}
      <Pressable onPress={logout} className="flex-row items-center mt-6">
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text className="text-white text-lg ml-4">Logout</Text>
      </Pressable>
    </View>
  );
}
