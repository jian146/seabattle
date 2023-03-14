import { Modal, ModalProps } from 'antd';
import React from 'react';
interface I_Dialog {}
const Dialog: React.FC<ModalProps & I_Dialog> = (props) => {
  const { open } = props;
  return (
    <div>
      {open && (
        <Modal
          {...props}
          open={open}
          onCancel={props.onCancel}
          onOk={props.onOk}
        >
        {props.children}
        </Modal>
      )}
    </div>
  );
};
export default Dialog;
