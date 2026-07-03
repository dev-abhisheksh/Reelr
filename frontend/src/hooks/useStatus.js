import { useQuery } from "@tanstack/react-query";
import { getStatus } from "../api/status.api";

export const useStatus = () => {
    return useQuery({
        queryKey: ["status"],
        queryFn: getStatus,
    });
};