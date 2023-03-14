import { Modal, ModalProps } from 'antd';
import React from 'react';
import styles from './com.less'
interface I_Dialog {}
const ComModal: React.FC<ModalProps & I_Dialog> = (props) => {
  const { open,width=1040 } = props;
  const randomId = Math.round(Math.random() * (10000000000 - 1) + 1);
  return (
    <div className={styles.myModal} id={'myModal'+randomId}>
      {open && (
        <Modal
          {...props}
          width={width}
          open={open}
          transitionName=''
          closeIcon={<></>}
          getContainer={()=>document.getElementById('myModal'+randomId)??document.body}
          onCancel={props.onCancel}
          onOk={props.onOk}
          footer={null}
        >
        {props.children}
        </Modal>
      )}
    </div>
  );
};
export default ComModal;
