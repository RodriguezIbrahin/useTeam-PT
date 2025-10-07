import { KanbanCreateType } from "@/app/dashboard/workspaces/components/kanban-list/kanban-create-dialog/schemas/kanban-create-schema";
import { PostKanban } from "@/core/interfaces/kanban";
import { api } from "@/core/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostKanban = () => {
  const queryClient = useQueryClient();
  const { mutate: postKanban, isPending } = useMutation({
    mutationFn: async (data: KanbanCreateType) => {
      const response = await api<PostKanban>("/kanbans", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanbans"] });
    },
  });

  return { postKanban, isPending };
};
