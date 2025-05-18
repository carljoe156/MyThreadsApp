import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import PostListItem from "@/components/PostListItem";
import PostReplyInput from "@/components/PostReplyInput";
import { FlatList } from "react-native";
import { getPostById, getPostsReplies } from "@/services/posts";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: replies } = useQuery({
    queryKey: ["posts", id, "replies"],
    queryFn: () => getPostsReplies(id),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text className="text-white ">{error.message}</Text>;
  }

  //   console.log(data);

  return (
    <View className="flex-1 ">
      <FlatList
        data={replies || []}
        renderItem={({ item }) => <PostListItem post={item} />}
        ListHeaderComponent={<PostListItem post={post} />}
      />
      <PostReplyInput postId={id} />
    </View>
  );
}
