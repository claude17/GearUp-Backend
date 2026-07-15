export interface ICreateReviewPayload {
    rentalOrderId: string;
    rating: number;
    comment?: string;
}
export interface IUpdateReviewPayload {
    rating?: number;
    comment?: string;
}