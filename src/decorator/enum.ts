export enum OrderStatus {
  PLACED = 'Đã đặt hàng',
  CONFIRMED = 'Đã xác nhận',
  COOKING = 'Đang nấu',
  COMPLETED = 'Hoàn thành',
  PAYMENT = 'Yêu cầu thanh toán',
  PAID = 'Đã thanh toán',
  CANCELLED = 'Hủy đơn hàng',
}

export enum PaymentMethod {
  CASH = 'Tiền mặt',
  CARD = 'Thẻ',
}

export enum ProductStatus {
  IN_STOCK = 'Còn món',
  OUT_OF_STOCK = 'Hết món',
}

export enum ProductCategory {
  APPETIZER = 'Món khai vị',
  MAIN_COURSE = 'Món chính',
  DESSERT = 'Món tráng miệng',
  BEVERAGE = 'Đồ uống',
  SIDE_DISH = 'Món phụ',
  SALAD = 'Salad',
  SOUP = 'Súp',
  SNACK = 'Ăn vặt',
  BOTTLED_DRINKS = 'Đồ uống đóng chai',
}

export enum Role {
  ROOT = 'ROOT',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST',
  CHEFF = 'CHEFF',
}
