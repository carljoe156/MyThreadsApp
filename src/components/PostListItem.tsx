import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Post } from "@/types";

dayjs.extend(relativeTime);

type Props = {
  post: Post;
  isLastInGroup?: boolean;
};

export default function PostListItem({ post, isLastInGroup = true }: Props) {
  return (
    <Link href={`/posts/${post.id}`} asChild>
      <Pressable
        className={`flex-row p-4 ${
          isLastInGroup ? "border-b border-gray-800/70" : ""
        }`}
      >
        {/* User Avatar */}
        <View className="mr-3 items-center gap-2">
          <Image
            source={{ uri: post.user.image }}
            className="w-12 h-12 rounded-full"
          />

          {!isLastInGroup && (
            <View className="w-[3px] flex-1 rounded-full bg-neutral-700 translate-y-2" />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* User Info */}
          <View className="flex-row items-center">
            <Text className="text-white font-bold mr-2">
              {post.user.username}
            </Text>
            <Text className="text-gray-500">
              {dayjs(post.createdAt).fromNow()}
            </Text>
          </View>

          {/* Post Content */}
          <Text className="text-white mt-2 mb-3">{post.content}</Text>

          {/* Interaction Buttons */}
          <View className="flex-row gap-4 mt-2">
            <Pressable className="flex-row items-center">
              <Ionicons name="heart-outline" size={20} color="#d1d5db" />
              <Text className="text-gray-300 ml-2">0</Text>
            </Pressable>

            <Pressable className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={20} color="#d1d5db" />
              <Text className="text-gray-300 ml-2">
                {post.replies?.length ?? 0}
              </Text>
            </Pressable>

            <Pressable className="flex-row items-center">
              <Ionicons name="repeat-outline" size={20} color="#d1d5db" />
              <Text className="text-gray-300 ml-2">0</Text>
            </Pressable>

            <Pressable>
              <Ionicons name="paper-plane-outline" size={20} color="#d1d5db" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
