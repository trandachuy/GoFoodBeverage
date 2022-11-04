import { Image, Space } from "antd";
import foodBeverageLogo from "assets/go-fnb-pos-text-logo.png";
import storeDefault from "assets/store-default.jpg";
import { BackToIcon } from "constants/icons.constants";
import { useTranslation } from "react-i18next";

const ListStoreComponent = ({ stores, onSelectStore, onBackLogin }) => {
  const [t] = useTranslation();

  const pageData = {
    selectStore: t("signIn.selectStore"),
    back: t("button.back"),
  };

  return (
    <>
      <div className="form-logo">
        <Image preview={false} src={foodBeverageLogo} width={300} />
      </div>
      <div className="div-form login-contain login-contain__right">
        <div className="select-store-form login-form login-inner login-inner__spacing">
          <div className="content-inner">
            <a onClick={onBackLogin}>
              <span>
                <BackToIcon />
              </span>
              {pageData.back}
            </a>
            <h1 className="label-store">{pageData.selectStore}</h1>
            <div className="store-form list-item">
              {stores.map((store, key) => {
                return (
                  <div
                    key={key}
                    className="store-detail-form item-option pointer"
                    onClick={() => onSelectStore(store?.id)}
                  >
                    <Space>
                      <Image
                        className="item-image-logo"
                        preview={false}
                        src={store?.thumbnail ?? storeDefault}
                        width={100}
                      />
                      <span>{store?.name}</span>
                    </Space>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListStoreComponent;
