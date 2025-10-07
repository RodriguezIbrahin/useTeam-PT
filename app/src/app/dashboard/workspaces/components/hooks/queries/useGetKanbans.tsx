import { GetKanban } from "@/core/interfaces/kanban";
import { api } from "@/core/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetKanbans = () => {
  const {
    data: kanbans,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["kanbans"],
    queryFn: async () => {
      const response = await api<GetKanban[]>("kanbans", {
        method: "GET",
      });

      return response?.data ?? [];
    },
  });
  return {
    kanbans,
    isPending,
    refetch,
  };
};
