import React from 'react';
import { Transformer } from 'react-konva';
import PropTypes from 'prop-types';

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }

  componentDidUpdate() {
    this.checkNode();
  }

  checkNode() {
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;
    const selectedNode = stage.findOne('.' + selectedShapeName);

    if (selectedNode === this.transformer.node()) {
      return;
    }
    if (selectedNode) {
      this.transformer.nodes([selectedNode]);
    } else {
      this.transformer.nodes([]);
    }
    this.transformer.getLayer().batchDraw();
  }

  render() {
    return (
      <Transformer
        ref={(node) => {
          this.transformer = node;
        }}
        rotateEnabled={false}
      />
    );
  }
}

TransformerComponent.propTypes = {
  selectedShapeName: PropTypes.string.isRequired,
};

export default TransformerComponent;
