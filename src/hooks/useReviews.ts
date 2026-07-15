import {useQuery} from '@apollo/client/react';
import {GET_ALL_REVIEWS} from "../apollo/queries/review.queries"
import type { GetAllReviewsResponse } from "../apollo/queries/review.queries"

export const useReviews = () => {
    const {data, loading, error, refetch} = useQuery<GetAllReviewsResponse>(GET_ALL_REVIEWS, {
        fetchPolicy: "network-only"
    })

    return {
        reviews: data?.allReviews ?? [],
        loading,
        error,
        refetch
    }
}