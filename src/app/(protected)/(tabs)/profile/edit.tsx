import { View, Text, TextInput, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { getProfileById, updateProfile } from "@/services/profiles";
import { router } from "expo-router";
import UserAvatarPicker from "@/components/UserAvatarPicker";

export default function ProfileEditScreen() {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateProfile(user!.id, {
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      router.back();
    },
  });

  useEffect(() => {
    setFullName(profile?.full_name);
    setBio(profile?.bio);
    setAvatarUrl(profile?.avatar_url);
  }, [profile?.id]);

  return (
    <View className="flex-1 p-4 gap-4">
      <UserAvatarPicker
        currentAvatar={profile?.avatar_url}
        onUpload={setAvatarUrl}
      />
      <Text className="text-gray-600 font-bold mb-2">Display name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        className="text-white border-2 border-neutral-800 rounded-md p-2"
      />
      <Text className="text-gray-600 font-bold mt-4 mb-2">Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="bio"
        className="text-white border-2 border-neutral-800 rounded-md p-2"
        multiline
        numberOfLines={5}
      />
      <View className="mt-auto">
        <Pressable
          onPress={() => mutate()}
          className={`${
            isPending ? "bg-white/50" : "bg-white"
          } p-4  items-center rounded-full`}
          disabled={isPending}
        >
          <Text className="text-black font-bold">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
