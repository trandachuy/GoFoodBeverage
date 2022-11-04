import OrderStatus from '../constants/order-status.constants';
import TextI18n from '../i18n/text.i18n';

const getStatusName = value => {
  switch (value) {
    case OrderStatus.New:
      return TextI18n.waitingForPayment;

    case OrderStatus.Returned:
      return TextI18n.returned;

    case OrderStatus.Canceled:
      return TextI18n.canceled;

    case OrderStatus.ToConfirm:
      return TextI18n.toConfirm;

    case OrderStatus.Processing:
      return TextI18n.processing;

    case OrderStatus.Delivering:
      return TextI18n.delivering;

    case OrderStatus.Completed:
      return TextI18n.completed;

    case OrderStatus.Draft:
      return TextI18n.draft;
    default:
      return '';
  }
};

const OrderUtil = {
  getStatusName,
};

export default OrderUtil;
