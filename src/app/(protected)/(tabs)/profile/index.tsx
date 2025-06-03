import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  Pressable,
  FlatList,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getPostsByUserId } from "@/services/posts";
import PostListItem from "@/components/PostListItem";
import ProfileHeader from "@/components/ProfileHeader";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "media" | "replies">(
    "posts"
  );

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", { user_id: user?.id }],
    queryFn: () => getPostsByUserId(user!.id),
  });

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (!posts) return [];

    if (activeTab === "posts") {
      return posts;
    } else if (activeTab === "media") {
      // Filter for posts that have images
      return posts.filter(
        (post) =>
          post.image || post.images?.length > 0 || post.media?.length > 0
      );
    } else if (activeTab === "replies") {
      // Filter for posts that have replies
      return posts.filter((post) => post.replies?.length > 0);
    }
  };

  const filteredPosts = getFilteredPosts();

  if (isLoading) return <ActivityIndicator />;
  if (error) {
    return <Text className="text-white">Error: {error.message}</Text>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => <PostListItem post={item} />}
        ListHeaderComponent={() => (
          <>
            <ProfileHeader />
            <View className="flex-row justify-center mt-4 border-b border-gray-700 pb-2">
              <Pressable onPress={() => setActiveTab("posts")}>
                <Text
                  className={`text-lg font-bold mx-4 ${
                    activeTab === "posts"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400"
                  }`}
                >
                  Posts
                </Text>
              </Pressable>
              <Pressable onPress={() => setActiveTab("media")}>
                <Text
                  className={`text-lg font-bold mx-4 ${
                    activeTab === "media"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400"
                  }`}
                >
                  Media
                </Text>
              </Pressable>
              <Pressable onPress={() => setActiveTab("replies")}>
                <Text
                  className={`text-lg font-bold mx-4 ${
                    activeTab === "replies"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400"
                  }`}
                >
                  Replies
                </Text>
              </Pressable>
            </View>
          </>
        )}
        ListEmptyComponent={() =>
          activeTab === "media" ? (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-400 text-center">
                No media posts found
              </Text>
            </View>
          ) : activeTab === "replies" ? (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-400 text-center">
                No replies found
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
