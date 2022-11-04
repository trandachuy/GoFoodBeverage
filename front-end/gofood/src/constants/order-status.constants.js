import TextI18n from '../i18n/text.i18n';

const OrderStatus = {
  New: 0,
  Returned: 1,
  Canceled: 2,
  ToConfirm: 3,
  Processing: 4,
  Delivering: 5,
  Completed: 6,
  Draft: 7,
};

export const OrderProcessStatus = {
  ToConfirm: 0,
  Processing: 1,
  Delivering: 2,
  Completed: 3,
  Canceled: 4,
};

export const OrderStatusList = [
  // {value: OrderStatus.New, name: TextI18n.waitingForPayment},
  // {value: OrderStatus.Returned, name: TextI18n.returned},
  {value: OrderStatus.Canceled, name: TextI18n.canceled},
  {value: OrderStatus.ToConfirm, name: TextI18n.toConfirm},
  {value: OrderStatus.Processing, name: TextI18n.processing},
  {value: OrderStatus.Delivering, name: TextI18n.delivering},
  {value: OrderStatus.Completed, name: TextI18n.completed},
  {value: OrderStatus.Draft, name: TextI18n.draft},
];

export const OrderStepList = {
  creatingOrder: TextI18n.orderCreatingOrder,
  preparing: TextI18n.orderPreparing,
  delivering: TextI18n.delivering,
};

export default OrderStatus;
