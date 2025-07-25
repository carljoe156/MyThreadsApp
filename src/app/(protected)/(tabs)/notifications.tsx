import React, { useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<"activity" | "all" | "mentions">(
    "activity"
  );

  // Our Mock data for notifications
  const notifications = {
    activity: [
      { id: 1, message: "You have a new follower!" },
      { id: 2, message: "Your post was liked!" },
      { id: 3, message: "You were mentioned in a comment!" },
      { id: 4, message: "Your post was shared!" },
    ],
    all: [
      { id: 3, message: "You were mentioned in a comment!" },
      { id: 4, message: "Your post was shared!" },
      { id: 1, message: "You have a new follower!" },
      { id: 2, message: "Your post was liked!" },
      { id: 5, message: "@user mentioned you in a post!" },
      { id: 6, message: "@anotheruser replied to your comment!" },
    ],
    mentions: [
      { id: 5, message: "@user mentioned you in a post!" },
      { id: 6, message: "@anotheruser replied to your comment!" },
      { id: 7, message: "@yetanotheruser tagged you in a photo!" },
      { id: 8, message: "@someuser commented on your post!" },
      { id: 9, message: "@user123 mentioned you in a story!" },
      { id: 10, message: "@user456 replied to your story!" },
    ],
  };

  const getFilteredNotifications = () => {
    return notifications[activeTab];
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <View className="flex-1 bg-black p-4">
      {/* Our Tabs */}
      <View className="flex-row justify-center border-b border-gray-700 pb-2">
        <Pressable onPress={() => setActiveTab("activity")}>
          <Text
            className={`text-lg font-bold mx-4 ${
              activeTab === "activity"
                ? "text-white border-b-2 border-white"
                : "text-gray-400"
            }`}
          >
            Activity
          </Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("all")}>
          <Text
            className={`text-lg font-bold mx-4 ${
              activeTab === "all"
                ? "text-white border-b-2 border-white"
                : "text-gray-400"
            }`}
          >
            All
          </Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("mentions")}>
          <Text
            className={`text-lg font-bold mx-4 ${
              activeTab === "mentions"
                ? "text-white border-b-2 border-white"
                : "text-gray-400"
            }`}
          >
            Mentions
          </Text>
        </Pressable>
      </View>

      {/* Our Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-700">
            <Text className="text-white">{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-400 text-center">
              No notifications found!
            </Text>
          </View>
        )}
      />
    </View>
  );
}
