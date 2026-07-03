import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStatus, addStatus } from "../api/status.api";

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

    return {
        ...query,
        uploadStatus: mutation.mutateAsync,
        isUploading: mutation.isPending,
        uploadError: mutation.error,
    };
};