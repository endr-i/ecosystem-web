import type { ItemResponse } from '../types';

export function normalizeItemResponse<T>(response: ItemResponse<T>): T {
    return response.item;
}
