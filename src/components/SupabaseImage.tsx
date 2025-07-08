import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Image, Text, View } from "react-native";

const downloadImage = async (
  bucket: string,
  path: string,
  transform: { width: number; height: number } | undefined
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path, { transform });
    if (error) {
      return reject(error);
    }
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      resolve(fr.result as string);
    };
  });
};

export default function SupabaseImage({
  bucket,
  path,
  className,
  transform,
}: {
  bucket: string;
  path: string;
  className: string;
  transform: { width: number; height: number } | undefined;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["supabaseImage", { bucket, path, transform }],
    queryFn: () => downloadImage(bucket, path, transform),
    staleTime: 1000 * 60 * 60 * 24,
  });

  // if (error) return <Text className='text-white'>Error: {error.message}</Text>;

  return (
    <Image
      source={{
        uri: data || undefined,
      }}
      className={`${className} bg-neutral-900`}
    />
  );
}

// import { supabase } from "@/lib/supabase";
// import { useQuery } from "@tanstack/react-query";
// import { ActivityIndicator, Image, Text, View, StyleSheet } from "react-native";

// const downloadImage = async (
//   bucket: string,
//   path: string,
//   transform: { width: number; height: number } | undefined
// ): Promise<string> => {
//   try {
//     console.log("🔍 Downloading image:", { bucket, path, transform });

//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .download(path, { transform });

//     if (error) {
//       console.error("❌ Supabase storage download error:", error);
//       throw error;
//     }

//     if (!data) {
//       console.error("❌ No data returned from Supabase");
//       throw new Error("No data returned");
//     }

//     console.log("✅ Download successful, converting to data URL...");

//     return new Promise((resolve, reject) => {
//       const fr = new FileReader();
//       fr.onload = () => {
//         console.log("✅ FileReader conversion successful");
//         resolve(fr.result as string);
//       };
//       fr.onerror = (err) => {
//         console.error("❌ FileReader error:", err);
//         reject(err);
//       };
//       fr.readAsDataURL(data);
//     });
//   } catch (error) {
//     console.error("❌ downloadImage error:", error);
//     throw error;
//   }
// };

// export default function SupabaseImage({
//   bucket,
//   path,
//   style,
//   transform,
//   width = 200,
//   height = 200,
// }: {
//   bucket: string;
//   path: string;
//   style?: any;
//   transform?: { width: number; height: number };
//   width?: number;
//   height?: number;
// }) {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["supabaseImage", { bucket, path, transform }],
//     queryFn: () => downloadImage(bucket, path, transform),
//     staleTime: 1000 * 60 * 60 * 24,
//     retry: 1, // Only retry once
//     onError: (err) => {
//       console.error("React Query error for image:", {
//         bucket,
//         path,
//         error: err,
//       });
//     },
//     onSuccess: (data) => {
//       console.log("✅ React Query success for image:", { bucket, path });
//     },
//   });

//   if (isLoading) {
//     return (
//       <View
//         style={[
//           {
//             width,
//             height,
//             backgroundColor: "#171717",
//             justifyContent: "center",
//             alignItems: "center",
//           },
//           style,
//         ]}
//       >
//         <ActivityIndicator color="#666" />
//       </View>
//     );
//   }

//   if (error) {
//     console.error("❌ Component error:", error);
//     return (
//       <View
//         style={[
//           {
//             width,
//             height,
//             backgroundColor: "#171717",
//             justifyContent: "center",
//             alignItems: "center",
//           },
//           style,
//         ]}
//       >
//         <Text
//           style={{
//             color: "white",
//             fontSize: 10,
//             textAlign: "center",
//             padding: 5,
//           }}
//         >
//           Error: {error?.message || "Unknown error"}
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <Image
//       source={{ uri: data }}
//       style={[
//         {
//           width,
//           height,
//           backgroundColor: "#171717",
//         },
//         style,
//       ]}
//       resizeMode="cover"
//     />
//   );
// }
