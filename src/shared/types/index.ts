export type ListResponse<T> = {
    items: T[],
    total: number,
};

export type ItemResponse<T> = {
    item: T,
};
