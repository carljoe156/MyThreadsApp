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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { Entypo } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createPost } from "@/services/posts";
import * as ImagePicker from "expo-image-picker";

export default function NewPostScreen() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => createPost({ content: text, user_id: user!.id }),
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
      // mediaTypes: ["images", "videos"],
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="p-4 flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 0}
      >
        <Text className="text-white text-lg font-bold">username</Text>

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
          // <View className="mt-4">
          <Image
            source={{ uri: image }}
            // className="w-1/2 aspect-square rounded-lg my-4"
            className="w-full h-4/6 rounded-lg my-4"
            // resizeMode="cover"
          />
          // </View>
        )}

        {error && (
          <Text className="text-red-500 text-sm mt-4">{error.message}</Text>
        )}

        <View>
          <View className="flex-row items-center gap-2 mt-4">
            <Entypo onPress={pickImage} name="images" size={20} color="gray" />
          </View>
        </View>

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
