import {useQuery} from '@apollo/client/react';
import {GET_ALL_CUSTOMERS} from "../apollo/queries/customer.queries"
import type { GetAllCustomersResponse } from "../apollo/queries/customer.queries"

export const useCustomers = () => {
    const {data, loading, error, refetch} = useQuery<GetAllCustomersResponse>(GET_ALL_CUSTOMERS, {
        fetchPolicy: "network-only"
    })

    return {
        customers: data?.allCustomers ?? [],
        loading,
        error,
        refetch
    }
}