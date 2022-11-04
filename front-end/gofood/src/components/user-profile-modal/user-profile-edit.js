import React, {useState} from 'react';
import {Modal} from 'react-native';
import UserUpdatePasswordComponent from './user-profile-update-password';
import UserUpdateProfileComponent from './user-update-profile';
export default function UserProfileEditComponent(props) {
  const {modalVisible, onCloseModal, userInfo, onOpenDeleteAccountModal} =
    props;

  const [modalChangePassword, setModalChangePassword] = useState(false);

  const onClickBackFromSystem = () => {
    if (modalChangePassword) {
      setModalChangePassword(false);
    } else {
      onCloseModal();
    }
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClickBackFromSystem}>
        {!modalChangePassword ? (
          <UserUpdateProfileComponent
            onChangePassword={e => setModalChangePassword(e)}
            modalVisible={modalVisible}
            onCloseModal={onCloseModal}
            onOpenDeleteAccountModal={onOpenDeleteAccountModal}
            userInfo={userInfo}
          />
        ) : (
          <UserUpdatePasswordComponent
            userInfo={userInfo}
            modalVisible={modalVisible}
            onChangePassword={e => setModalChangePassword(e)}
          />
        )}
      </Modal>
    </>
  );
}
