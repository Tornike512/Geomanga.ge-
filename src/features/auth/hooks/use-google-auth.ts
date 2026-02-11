import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut as nextAuthSignOut, signIn } from "next-auth/react";
import { setTokens } from "@/lib/api-client";
import { googleAuth } from "../api/google-auth";

export const useGoogleAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const backendAuthMutation = useMutation({
    mutationFn: googleAuth,
    onSuccess: async (data) => {
      // Store tokens in cookies so subsequent requests include Bearer token
      setTokens(data.access_token, data.refresh_token);
      // Clear Next-Auth session after backend auth succeeds
      await nextAuthSignOut({ redirect: false });
      // Invalidate user query to refresh with backend data
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      router.push("/");
    },
  });

  const initiateGoogleAuth = async () => {
    // Start the Google OAuth flow via Auth.js
    await signIn("google", {
      redirectTo: "/auth/callback/google",
    });
  };

  return {
    initiateGoogleAuth,
    backendAuthMutation,
    isLoading: backendAuthMutation.isPending,
    error: backendAuthMutation.error,
  };
};
