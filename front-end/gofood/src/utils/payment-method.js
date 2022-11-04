import {PaymentMethod} from '../constants/payment-method.constants';
import TextI18n from '../i18n/text.i18n';

const getPaymentMethodName = type => {
  if (type === PaymentMethod.moMo) return TextI18n.momoWallet;

  if (type === PaymentMethod.zaloPay) return TextI18n.zaloWallet;

  if (type === PaymentMethod.creditDebitCard) return TextI18n.bankCard;

  if (type === PaymentMethod.cash) return TextI18n.cash;

  if (type === PaymentMethod.vnPay) return TextI18n.vnPayPaymentGateway;

  return '';
};

const PaymentMethodUtil = {
  getPaymentMethodName,
};

export default PaymentMethodUtil;
