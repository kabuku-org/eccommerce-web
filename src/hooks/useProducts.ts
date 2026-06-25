import {useQuery , useMutation} from '@apollo/client/react';
import {GET_PRODUCTS,  CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT} from "../apollo/queries/product.queries";
import type { CreateProductInput ,  UpdateProductInput } from "../types/product.types";
import type {GetProductsResponse, CreateProductResponse, UpdateProductResponse, DeleteProductResponse} from "../apollo/queries/product.queries";
export function useProducts() {
    //fetch all products

    const {data, loading, error , refetch} = useQuery<GetProductsResponse>(GET_PRODUCTS);

    //mutations for creating, the refetching the products after creating, updating or deleting a product
    const [CreateProductMutation, {loading: createLoading}] = useMutation<CreateProductResponse>(CREATE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });
    const [UpdateProductMutation , {loading: updateLoading} ] = useMutation<UpdateProductResponse>  (UPDATE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });
    const [DeleteProductMutation , {loading: deleteLoading} ] = useMutation<DeleteProductResponse>(DELETE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });

    

  // ── Action functions ────────────────────────────────
  async function createProduct(input: CreateProductInput) {
    await CreateProductMutation({ variables: { input } })
  }

  async function updateProduct(id: string, input: UpdateProductInput) {
    await UpdateProductMutation({ variables: { id, input } })
  }

  async function deleteProduct(id: string) {
    await DeleteProductMutation({ variables: { id } })
  }

  return {
    products: data?.products ?? [],
    loading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    createLoading,
    updateLoading,
    deleteLoading,
  }
}