// ============================================
// File: lib/types/shop.ts
// ============================================

export interface Shop {
  _id: string
  name: string
  title: string
  description: string
  images: string[]
  size: string[]
  price: number
  type: 'Basic' | 'Exclusive'
  status: 'active' | 'inactive'
  details: string
  createdAt: string
  updatedAt: string
  createdBy: string
  totalShopUsers?: string[]
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  meta: PaginationMeta
  data: T
}
