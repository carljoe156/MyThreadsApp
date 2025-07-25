import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { getProfileById } from "@/services/profiles";
import { Link, router } from "expo-router";
import SupabaseImage from "./SupabaseImage";
import React from "react";

export default function ProfileHeader() {
  const { user } = useAuth();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) {
    return <Text className="text-white">Error: {error.message}</Text>;
  }
  // console.log(JSON.stringify(profile, null, 2));

  return (
    <View className="p-4 gap-4">
      <View className="flex-row items-center justify-between gap-2">
        <View className="gap-1 py-6 ">
          <Text className="text-white text-2xl font-bold">
            {profile?.full_name}
          </Text>
          <Text className="text-neutral-200 text-lg">{profile?.username}</Text>
        </View>
        <SupabaseImage
          bucket="avatars"
          path={profile?.avatar_url}
          className="w-20 h-20 rounded-full"
          transform={{ width: 500, height: 500 }}
        />
        <Pressable
          onPress={() => router.push("/profile/settings")}
          className="p-2"
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </Pressable>
      </View>
      <Text className="text-neutral-200 leading-snug">{profile?.bio}</Text>

      <View>
        <Link href="/profile/edit" asChild>
          <Pressable className="flex-1 py-2 rounded-lg border-2 border-neutral-800">
            <Text className="text-center text-neutral-200">Edit Profile.</Text>
          </Pressable>
        </Link>

        <Pressable className="flex-1 py-2 rounded-lg border-2 border-neutral-800">
          <Text className="text-center text-neutral-200">Share Profile.</Text>
        </Pressable>
      </View>
    </View>
  );
}
