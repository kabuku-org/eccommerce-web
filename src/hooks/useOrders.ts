import {useQuery , useMutation} from "@apollo/client/react";

import {CREATE_ORDER , GET_MY_ORDERS , GET_ALL_ORDERS ,CANCEL_ORDER , CHECKOUT_ORDER} from "../apollo/queries/order.queries"
import type {CreateOrderResponse , GetMyOrdersResponse , CancelOrderResponse , CheckoutOrderResponse, GetAllOrdersResponse} from "../apollo/queries/order.queries"


export const useOrders = () => {

    const {data , loading , error , refetch} = useQuery<GetMyOrdersResponse>(GET_MY_ORDERS , {
        fetchPolicy: "network-only"
    })//meaning do not use cache and always fetch from server

    const [createOrderMutation , {loading: createLoading , error: createError }] = useMutation<CreateOrderResponse>(CREATE_ORDER , {
        refetchQueries: [{query: GET_MY_ORDERS}]
    })

    const [cancelOrderMutation , {loading: cancelLoading , error: cancelError}] = useMutation<CancelOrderResponse>(CANCEL_ORDER , {
        refetchQueries: [{query: GET_MY_ORDERS}]
    })

    const [checkoutOrderMutation , {loading: checkoutLoading , error: checkoutError}] = useMutation<CheckoutOrderResponse>(CHECKOUT_ORDER , {
        refetchQueries: [{query: GET_MY_ORDERS}]
    })

    //action functions
    //these are what the components will call to perform the actions
    //they wrap the muatioj finvtuion with the correct parameters and return the result
    async function createOrder() {
        try {
            const result = await createOrderMutation()
            return result.data?.createOrder
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

async function cancelOrder(orderId: string) {
        try {
            const result = await cancelOrderMutation({  
                variables: {
                    orderId
                }
            })
            return result.data?.cancelOrder
        } catch (error) {
            console.error("Error canceling order:", error);
            throw error;
        }
    }

    async function checkoutOrder(orderId: string, deliveryAddress?: string, pickupLocation?: string) {
        await checkoutOrderMutation({
            variables: {
                orderId,
                deliveryAddress: deliveryAddress ?? null,
                pickupLocation: pickupLocation ?? null
            }
        })
    }

    return {
        orders: data?.myOrders ?? [],
        loading,
        error,
        createError,
        cancelError,

        checkoutError,
        refetch,
        createOrder,
        cancelOrder,
        checkoutOrder,
        createLoading,
        cancelLoading,
        checkoutLoading
    }
}   

//admin hook -all orders
export function useAllOrders() {
    const {data , loading , error , refetch} = useQuery<GetAllOrdersResponse>(GET_ALL_ORDERS , {
        fetchPolicy: "network-only"
    })//meaning do not use cache and always fetch from server


    return {
        orders: data?.allOrders ?? [],
        loading,
        error,
        refetch
    }
}
