import React from 'react';
import DragM from 'dragm';
export default class ModalDrag extends React.Component {
  updateTransform = transformStr => {
    this.modalDom.style.transform = transformStr;
  };
  componentDidMount() {
    this.modalDom = document.getElementsByClassName(
      "ant-modal-wrap"  // modal的class是ant-modal-wrap
    )[0];
  }
  render() {
    const { title } = this.props;
    return (
      <DragM updateTransform={this.updateTransform}>
        <div>{title}</div>
      </DragM>
    );
  }
}