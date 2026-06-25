import {useQuery , useMutation} from '@apollo/client/react';
import {GET_PRODUCTS,  CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT} from "../apollo/queries/product.queries";
import type { CreateProductInput ,  UpdateProductInput } from "../types/product.types";
import type {GetProductsResponse, CreateProductResponse, UpdateProductResponse, DeleteProductResponse} from "../apollo/queries/product.queries";
export function useProducts() {
    //fetch all products

    const {data, loading, error , refetch} = useQuery<GetProductsResponse>(GET_PRODUCTS);

    //mutations for creating, the refetching the products after creating, updating or deleting a product
    const [productMutation, {loading: createLoading}] = useMutation<CreateProductResponse>(CREATE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });
    const [updateProductMutation , {loading: updateLoading} ] = useMutation<UpdateProductResponse>  (UPDATE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });
    const [deleteProductMutation , {loading: deleteLoading} ] = useMutation<DeleteProductResponse>(DELETE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });

    

        async function createProduct(input: CreateProductInput) {
            const response = await productMutation({
                variables: { input }
            });
            return response.data?.createProduct;
        }
        async function updateProduct(id: string, input: UpdateProductInput) {
            const response = await updateProductMutation({
                variables: { id, input }
            });
            return response.data?.updateProduct;
        }

        async function deleteProduct(id: string) {
            const response = await deleteProductMutation({
                variables: { id }
            });
            return response.data?.deleteProduct;
        }

        return {
        data,
        loading,
        error,
        refetch,
        createLoading,
        updateLoading,
        deleteLoading
    };
}   