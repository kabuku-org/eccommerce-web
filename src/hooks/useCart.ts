import {useQuery , useMutation} from "@apollo/client/react";
import {GET_MY_CART , ADD_TO_CART , REMOVE_FROM_CART , CLEAR_CART} from "../apollo/queries/cart.queries"
import type { GetMyCartResponse , AddItemToCartResponse , RemoveFromCartResponse ,ClearCartResponse } from "../apollo/queries/cart.queries";
export const useCart = () => {

    const {data , loading , error , refetch} = useQuery<GetMyCartResponse>(GET_MY_CART , {
        fetchPolicy: "network-only"
    })//meaning do not use cache and always fetch from server


    const [addItemMMutation , {loading: addLoading , error: addError}] = useMutation<AddItemToCartResponse>(ADD_TO_CART , {
        refetchQueries: [{query: GET_MY_CART}]
    })

    const [removeItemMutation , {loading: removeLoading , error: removeError}] = useMutation<RemoveFromCartResponse>(REMOVE_FROM_CART , {
        refetchQueries: [{query: GET_MY_CART}]
    })

    const [clearCartMutation , {loading: clearLoading , error: clearError}] = useMutation<ClearCartResponse>(CLEAR_CART , {
        refetchQueries: [{query: GET_MY_CART}]
    })

    //action function
    //these are what the components will call to perform the actions
    //they wrap the muatioj finvtuion with the correct parameters and return the result
async function addItem(productId: string) {
        try {
            const result = await addItemMMutation({
                variables: {
                    productId
                }
            })
            return result.data?.addItemToCart
        } catch (error) {
            console.error("Error adding item to cart:", error);
            throw error;
        }
    }

    async function removeItem(productId: string, quantity: number = 1) {
        try {
            const result = await removeItemMutation({
                variables: {
                    productId,
                    quantity
                }
            })
            return result.data?.removeFromCart
        } catch (error) {
            console.error("Error removing item from cart:", error);
            throw error;
        }
    }

    async function clearCart() {
        try {
            const result = await clearCartMutation()
            return result.data?.clearCart
        } catch (error) {
            console.error("Error clearing cart:", error);
            throw error;
        }
    }

    //cart info for navbar use case
    const cart = data?.myCart ?? null


    const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

    return {
        cart,
        itemCount,
        loading,
        error,
        addLoading,
        removeLoading,
        clearLoading,
        addError,
        removeError,
        clearError,
        refetch,
        addItem,
        removeItem,
        clearCart
    }       
}