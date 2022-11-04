import TextI18n from '../i18n/text.i18n';

export const PaymentMethod = {
  moMo: 0,
  zaloPay: 1,
  creditDebitCard: 2,
  cash: 3,
  vnPay: 4,
};

export const PaymentMethodNameList = [
  {key: PaymentMethod.moMo, name: TextI18n.momoWallet},
  {key: PaymentMethod.creditDebitCard, name: TextI18n.creditDebitCard},
  {key: PaymentMethod.cash, name: TextI18n.cash},
  {key: PaymentMethod.vnPay, name: TextI18n.vnPayPaymentGateway},
];
