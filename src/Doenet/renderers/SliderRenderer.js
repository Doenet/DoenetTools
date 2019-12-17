import React from 'react';
import Slider from './ReactSlider';
import BaseRenderer from './BaseRenderer';

class SliderRenderer extends BaseRenderer {
  constructor({ actions, key, index, items, sliderType, width, height, valueToIndex, markers, label, showControls, showTicks }) {
    super({ key: key });
    if (index > items.length) { index = items.length - 1; }
    if (width < 30) { width = 30; }
    if (height < 50) { height = 50; }
    this.sharedState = {
      index: index,
    }

    this.sliderProps = {
      actions: actions,
      sliderRef: this.sliderRef,
      _key: key,
      index: index,
      sharedState: this.sharedState,
      items: items,
      sliderType: sliderType,
      width: width,
      height: height,
      valueToIndex: valueToIndex,
      markers: markers,
      label: label,
      showControls: showControls,
      showTicks: showTicks,
    }
    this.valueToIndex = valueToIndex;

    this.jsxCode = this.jsxCode.bind(this);
  }

  updateSlider({ index, items, sliderType,
    width, height, valueToIndex,
    markers, label, showControls, showTicks }) {
    this.sliderProps.index = index;
    this.sharedState.index = index;
    this.sliderProps.items = items;
    this.sliderProps.sliderType = sliderType;
    this.sliderProps.width = width;
    this.sliderProps.height = height;
    this.sliderProps.valueToIndex = valueToIndex;
    this.sliderProps.markers = markers;
    this.sliderProps.label = label;
    this.sliderProps.showControls = showControls;
    this.sliderProps.showTicks = showTicks;

  }



  jsxCode() {
    return <Slider key={this._key} {...this.sliderProps} ></Slider>;
  }

}

let AvailableRenderers = {
  slider: SliderRenderer,
}

export default AvailableRenderers;
