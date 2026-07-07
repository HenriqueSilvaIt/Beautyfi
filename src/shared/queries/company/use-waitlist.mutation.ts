import { useMutation, useQuery } from "@tanstack/react-query";
import { addToWaitList, getWaitList, WaitListInsertParams } from "../../services/waitlist.service";
import { queryClient } from "../../../../queryClient";

export function useWaitListMutation() {
  const addToWaitListMutation = useMutation({
    mutationFn: (params: WaitListInsertParams) => addToWaitList(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    }
  });

  return {
    addToWaitListMutation
  };
}

export function useGetWaitListQuery(startDate: string, endDate: string, enabled = true) {
  return useQuery({
    queryKey: ["waitlist", startDate, endDate],
    queryFn: () => getWaitList(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
}
