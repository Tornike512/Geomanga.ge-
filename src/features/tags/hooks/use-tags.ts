import { useQuery } from "@tanstack/react-query";
import { getTags } from "../api/get-tags";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
