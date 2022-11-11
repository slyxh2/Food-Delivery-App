import { useQuery } from "@apollo/client"
import { ME_QUERY } from "../../api"
import { meQuery } from "../../types/meQuery";

export const useMe = () => {
    return useQuery<meQuery>(ME_QUERY);
}