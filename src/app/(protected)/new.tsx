import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { Entypo } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createPost } from "@/services/posts";
import * as ImagePicker from "expo-image-picker";
import { getProfileById } from "@/services/profiles";
import SupabaseImage from "@/components/SupabaseImage";

export default function NewPostScreen() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const { user, profile } = useAuth();

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      let imagePath: string | null = null;
      if (image) {
        imagePath = await uploadImage();
      }
      return createPost({
        content: text,
        user_id: user!.id,
        images: imagePath ? [imagePath] : [],
      });
    },
    onSuccess: (data) => {
      setText("");
      router.back();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      // Alert.alert("Error", error.message);
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      // mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

    const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${Date.now()}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, arraybuffer, {
        contentType: image.mimeType ?? "image/jpeg",
      });
    if (uploadError) {
      throw uploadError;
    }
    return data.path;
  };

  return (
    <SafeAreaView className="p-4 flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-row gap-4 ">
            <SupabaseImage
              bucket="avatars"
              path={profile?.avatar_url ?? ""}
              className="w-14 h-14 rounded-full"
              transform={{ width: 100, height: 100 }}
            />
            <View>
              {profile && (
                <Text className="text-white text-lg font-bold">
                  {profile.username}
                </Text>
              )}

              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="What is on your mind?"
                placeholderTextColor="gray"
                className="text-white text-lg"
                multiline
                numberOfLines={4}
              />
              {image && (
                <View className="mt-4 items-center">
                  <Image
                    source={{ uri: image.uri }}
                    className="rounded-lg"
                    style={{
                      width: "100%",
                      maxWidth: 300, // Limit the width for larger images
                      aspectRatio: image.width / image.height,
                    }}
                  />
                </View>
              )}

              {error && (
                <Text className="text-red-500 text-sm mt-4">
                  {error.message}
                </Text>
              )}

              <View className="flex-row items-center gap-2 mt-4">
                <Entypo
                  onPress={pickImage}
                  name="images"
                  size={20}
                  color="gray"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="mt-auto">
          <Pressable
            onPress={() => mutate()}
            className={`${
              isPending ? "bg-white/50" : "bg-white"
            } p-3 px-6 self-end rounded-full`}
            disabled={isPending}
          >
            <Text className="text-black font-bold">Post</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
