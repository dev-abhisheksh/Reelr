import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStatus, addStatus, viewStatus } from "../api/status.api";

export const useStatus = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["status"],
        queryFn: getStatus,
    });

    const mutation = useMutation({
        mutationFn: addStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["status"] });
        },
    });

    const viewMutation = useMutation({
        mutationFn: viewStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["status"] });
        },
    });

    return {
        ...query,
        uploadStatus: mutation.mutateAsync,
        isUploading: mutation.isPending,
        uploadError: mutation.error,
        markAsViewed: viewMutation.mutateAsync,
    };
};