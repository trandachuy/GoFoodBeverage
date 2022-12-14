import { Card, Col, Form, Input, message, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import PageTitle from "components/page-title";
import { DELAYED_TIME } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import storeDataService from "data-services/store/store-data.service";
import supplierDataService from "data-services/supplier/supplier-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getValidationMessagesWithParentField } from "utils/helpers";
import "../index.scss";

export default function NewSupplier(props) {
  const [t] = useTranslation();
  const { onCancel } = props;

  const pageData = {
    btnCancel: t("button.cancel"),
    btnAddNew: t("button.addNew"),
    goBack: t("supplier.goBack"),

    addNewSupplier: t("supplier.addNewSupplier"),
    supplierName: t("supplier.supplierName"),
    supplierNamePlaceholder: t("supplier.supplierNamePlaceholder"),
    supplierNameValidation: t("supplier.supplierNameValidation"),
    supplierNameUnique: t("supplier.supplierNameUnique"),
    mustBeBetweenThreeAndOneHundredsCharacters: t("form.mustBeBetweenThreeAndOneHundredsCharacters"),

    codePlaceholder: t("supplier.codePlaceholder"),
    codeValidation: t("supplier.codeValidation"),
    codeUnique: t("supplier.codeUnique"),
    maximumTenCharacters: t("supplier.maximumTenCharacters"),
    allowedLetterAndNumber: t("form.allowedLetterAndNumber"),
    code: t("table.code"),

    selectCountry: t("form.selectCountry"),
    country: t("form.country"),
    phone: t("table.phone"),
    email: t("table.email"),
    address: t("form.address"),
    address2: t("form.addressTwo"),
    province: t("form.province"),
    district: t("form.district"),
    ward: t("form.ward"),
    cityTown: t("form.city"),
    stateProvinceRegion: t("form.stateProvinceRegion"),
    zipCode: t("form.zip"),
    description: t("form.description"),
    descriptionMaximum: t("form.maximum1000Characters"),

    phonePlaceholder: t("supplier.phonePlaceholder"),
    phoneValidation: t("supplier.phoneValidation"),
    validPhonePattern: t("form.validPhonePattern"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    allowNumberOnly: t("form.allowNumberOnly"),

    emailPlaceholder: t("supplier.emailPlaceholder"),
    emailValidation: t("supplier.emailValidation"),

    inputAddressOne: t("form.inputAddressOne"),
    inputAddressTwo: t("form.inputAddressTwo"),

    validZip: t("form.validZip"),
    inputCity: t("form.inputCity"),
    selectProvince: t("form.selectProvince"),
    selectProvinceStateRegion: t("form.selectProvinceStateRegion"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),
    selectWard: t("form.selectWard"),
    leaveWarningMessage: t("productManagement.leaveWarningMessage"),
    supplierAddSuccess: t("supplier.supplierAddSuccess"),
    selectState: t("form.selectState"),
    inputZip: t("form.inputZip"),

    leaveForm: t("messages.leaveForm"),
    discard: t("button.discard"),
    generalInformation: t("supplier.detail.generalInformation"),
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [initData, setInitData] = useState({});
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);
  const [phonecode, setPhonecode] = useState(null);
  const [countries, setCountries] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setWardsByDistrictId] = useState([]);
  const [states, setStates] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = async () => {
    var initData = await storeDataService.getPrepareAddressDataAsync();
    setInitData(initData);
    setCountries(initData?.countries);
    setCities(initData?.cities);
    setDistricts(initData?.districts);
    setStates(initData?.states);
    setWards(initData?.wards);
    setPhonecode(initData?.defaultCountryStore?.phonecode);

    let formValue = form.getFieldsValue();
    formValue.supplier.address.countryId = initData?.defaultCountryStore?.id;
    form.setFieldsValue(formValue);
    initData?.defaultCountryStore?.id === initData?.defaultCountry?.id
      ? setIsDefaultCountry(true)
      : setIsDefaultCountry(false);
  };

  const onCountryChange = (countryId) => {
    let country = countries?.find((item) => item.id === countryId);
    setPhonecode(country.phonecode);
    countryId === initData?.defaultCountry?.id ? setIsDefaultCountry(true) : setIsDefaultCountry(false);
  };

  const onChangeCity = (event) => {
    let districtsFilteredByCity = districts?.filter((item) => item.cityId === event) ?? [];
    setDistrictsByCityId(districtsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.districtId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const onChangeDistrict = (event) => {
    let wardsFilteredByCity = wards?.filter((item) => item.districtId === event) ?? [];
    setWardsByDistrictId(wardsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const prefixSelector = <label>+{phonecode}</label>;

  const onFinish = () => {
    form.validateFields().then((values) => {
      supplierDataService
        .createSupplierAsync(values)
        .then((res) => {
          if (res) {
            onCancel();
            message.success(pageData.supplierAddSuccess);
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessagesWithParentField(errs, "supplier"));
        });
    });
  };

  const clickCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      onCancel();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      onCancel();
    }, DELAYED_TIME);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.addNewSupplier} />
          </p>
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: <FnbAddNewButton onClick={onFinish} type="primary" text={pageData.btnAddNew}></FnbAddNewButton>,
                permission: PermissionKeys.CREATE_SUPPLIER,
              },
              {
                action: (
                  <button className="action-cancel" onClick={clickCancel}>
                    {pageData.btnCancel}
                  </button>
                ),
                permission: null,
              },
            ]}
          />
        </Col>
      </Row>

      <div className="clearfix"></div>
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        onFieldsChange={() => {
          if (!isChangeForm) setIsChangeForm(true);
        }}
        form={form}
      >
        <Content>
          <Card className="fnb-card">
            <Row>
              <Col span={24}>
                <h5 className="title-group">{pageData.generalInformation}</h5>
              </Col>
            </Row>
            <Row gutter={[25, 25]} className="form-row">
              <Col sm={24} md={12} className="w-100">
                <h4 className="fnb-form-label">
                  {pageData.supplierName}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  className="last-item"
                  name={["supplier", "name"]}
                  rules={[
                    { required: true, message: pageData.supplierNameValidation },
                    { type: "string", warningOnly: true },
                    {
                      type: "string",
                      max: 100,
                      message: `${pageData.supplierName} ${pageData.mustBeBetweenThreeAndOneHundredsCharacters}`,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input-with-count"
                    showCount
                    maxLength={100}
                    size="large"
                    placeholder={pageData.supplierNamePlaceholder}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} className="w-100"></Col>
            </Row>
            <Row gutter={[25, 25]} className="form-row">
              <Col sm={24} md={12} className="w-100">
                <h4 className="fnb-form-label">
                  {pageData.code}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  className="last-item"
                  name={["supplier", "code"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.codeValidation,
                    },
                    {
                      max: 10,
                      message: `${pageData.code} ${pageData.maximumTenCharacters}`,
                    },
                    {
                      pattern: /^[\w-]+$/g,
                      message: `${pageData.code} ${pageData.allowedLetterAndNumber}`,
                    },
                  ]}
                >
                  <Input className="fnb-input" size="large" placeholder={pageData.codePlaceholder} />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} className="w-100">
                <h4 className="fnb-form-label">
                  {pageData.country}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item name={["supplier", "address", "countryId"]}>
                  <FnbSelectSingle
                    size="large"
                    placeholder={pageData.selectCountry}
                    onChange={onCountryChange}
                    showSearch
                    autoComplete="none"
                    option={countries?.map((item, index) => ({
                      id: item.id,
                      name: item.nicename,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[25, 25]} className="form-row">
              <Col sm={24} md={12} className="w-100">
                <h4 className="fnb-form-label">
                  {pageData.phone}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  className="last-item"
                  name={["supplier", "phoneNumber"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.phoneValidation,
                    },
                    {
                      min: 3,
                      max: 15,
                      message: `${pageData.phone} ${pageData.mustBeBetweenThreeAndFifteenCharacters}`,
                    },
                    {
                      pattern: /^\d+$/g,
                      message: pageData.allowNumberOnly,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input-addon-before"
                    size="large"
                    placeholder={pageData.phonePlaceholder}
                    addonBefore={prefixSelector}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} className="w-100">
                <h4 className="fnb-form-label">{pageData.email}</h4>
                <Form.Item
                  name={["supplier", "email"]}
                  rules={[
                    {
                      type: "email",
                      message: pageData.emailValidation,
                    },
                  ]}
                >
                  <Input className="fnb-input" size="large" placeholder={pageData.emailPlaceholder} />
                </Form.Item>
              </Col>
            </Row>
            {isDefaultCountry ? (
              <>
                <Row gutter={[25, 25]} className="form-row">
                  <Col span={24}>
                    <h4 className="fnb-form-label">{pageData.address}</h4>
                    <Form.Item name={["supplier", "address", "address1"]}>
                      <Input
                        className="fnb-input-with-count"
                        showCount
                        maxLength={255}
                        size="large"
                        placeholder={pageData.inputAddressOne}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} md={8} className="w-100">
                    <h4 className="fnb-form-label">{pageData.province}</h4>
                    <Form.Item name={["supplier", "address", "city", "id"]} className="last-item">
                      <FnbSelectSingle
                        size="large"
                        placeholder={pageData.selectProvince}
                        onChange={onChangeCity}
                        showSearch
                        autoComplete="none"
                        option={cities?.map((item, index) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={8} className="w-100">
                    <h4 className="fnb-form-label">{pageData.district}</h4>
                    <Form.Item name={["supplier", "address", "district", "id"]} className="last-item">
                      <FnbSelectSingle
                        size="large"
                        placeholder={pageData.selectDistrict}
                        onChange={onChangeDistrict}
                        showSearch
                        autoComplete="none"
                        option={districtsByCityId?.map((item, index) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={8} className="w-100">
                    <h4 className="fnb-form-label">{pageData.ward}</h4>
                    <Form.Item name={["supplier", "address", "ward", "id"]}>
                      <FnbSelectSingle
                        size="large"
                        placeholder={pageData.selectWard}
                        showSearch
                        option={wardsByDistrictId?.map((item, index) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row gutter={[25, 25]} className="form-row">
                  <Col span={24}>
                    <h4 className="fnb-form-label">{pageData.address}</h4>
                    <Form.Item name={["supplier", "address", "address1"]}>
                      <Input
                        className="fnb-input-with-count"
                        showCount
                        maxLength={255}
                        size="large"
                        placeholder={pageData.inputAddressOne}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col span={24}>
                    <h4 className="fnb-form-label">{pageData.address2}</h4>
                    <Form.Item name={["supplier", "address", "address2"]}>
                      <Input
                        className="fnb-input-with-count"
                        showCount
                        maxLength={255}
                        size="large"
                        placeholder={pageData.inputAddressTwo}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} md={8} className="w-100">
                    <h4 className="fnb-form-label">{pageData.cityTown}</h4>
                    <Form.Item name={["supplier", "address", "cityTown"]} className="last-item">
                      <Input className="fnb-input" size="large" placeholder={pageData.inputCity} />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={8} className="w-100">
                    <h4 className="fnb-form-label">{pageData.stateProvinceRegion}</h4>
                    <Form.Item name={["supplier", "address", "state", "id"]} className="last-item">
                      <FnbSelectSingle
                        placeholder={pageData.selectProvinceStateRegion}
                        option={states?.map((item) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                        showSearch
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={8} className="w-100">
                    <h4 className="fnb-form-label">{pageData.zipCode}</h4>
                    <Form.Item name={["supplier", "address", "postalCode"]}>
                      <Input className="fnb-input" size="large" placeholder={pageData.inputZip} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <Row gutter={[25, 25]} className="form-row">
              <Col span={24}>
                <h4 className="fnb-form-label">{pageData.description}</h4>
                <Form.Item
                  name={["supplier", "description"]}
                  rules={[
                    {
                      max: 1000,
                      message: pageData.descriptionMaximum,
                    },
                  ]}
                >
                  <FnbTextArea showCount maxLength={1000} rows={4}></FnbTextArea>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Content>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={handleCancel}
        className="d-none"
        isChangeForm={isChangeForm}
      />
    </>
  );
}
