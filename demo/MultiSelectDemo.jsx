/**
 * MultiSelect Component Demo for uxcore
 * @author peijie.dpj
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React, { Component } from 'react';
import MultiSelect, { Item } from '../src';

/* eslint-disable prefer-rest-params */
/* eslint-disable class-methods-use-this */


class Demo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ['item0', 'item15'],
      disabled: false,
      size: 'large',
    };
  }

  handleChange(value) {
    this.setState({
      value,
      disabled: false,
    });
    global.console.log('onChange', arguments);
  }

  handleSubmit() {
    global.console.log('onSubmit', arguments);
  }

  handleSize(size) {
    this.setState({
      size,
    });
  }

  renderSizeTrigger(size) {
    return this.state.size === size ? <b>{` ${size} `}</b> :
        <a href={`#${size}`} onClick={this.handleSize.bind(this, size)}>{` ${size} `}</a>;
  }

  render() {
    const text = ['汉皇重色思倾国', '御宇多年求不得', '杨家有女初长成', '养在深闺人未识',
      '天生丽质难自弃', '一朝选在君王侧', '回眸一笑百媚生', '六宫粉黛无颜色',
      '春寒赐浴华清池', '温泉水滑洗凝脂', '侍儿扶起娇无力', '始是新承恩泽时',
      '云鬓花颜金步摇', '芙蓉帐暖度春宵', '春宵苦短日高起', '从此君王不早朝'];

    return (
      <div>
        <h1>
          尺寸：
          {[
            this.renderSizeTrigger('large'),
            this.renderSizeTrigger('middle'),
            this.renderSizeTrigger('small')
          ]}
        </h1>
        <h1>正常选择</h1>
        <MultiSelect
          className="test-classname-select"
          dropdownClassName="test-classname-dropdown"
          locale="en-us"
          value={this.state.value}
          disabled={this.state.disabled}
          placeholder="请选择"
          titleBreakStr="、"
          optionLabelProp="text"
          showSelectAll
          showClear
          onChange={this.handleChange.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          size={this.state.size}
        >
          {text.map((item, index) =>
              <Item value={`item${index}`} text={item} key={index} disabled={index % 4 === 0} />)}
        </MultiSelect>
        <h1>限制最多5项</h1>
        <MultiSelect
          value={this.state.value}
          disabled={this.state.disabled}
          maxSelect={5}
          optionLabelProp="text"
          onChange={this.handleChange.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          size={this.state.size}
        >
          {text.map((item, index) => <Item value={`item${index}`} text={item} key={index} />)}
        </MultiSelect>
        <h1>隐藏控制按钮</h1>
        <MultiSelect
          value={this.state.value}
          disabled={this.state.disabled}
          optionLabelProp="text"
          showSelectAll={false}
          showClear={false}
          onChange={this.handleChange.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          size={this.state.size}
        >
          {text.map((item, index) => <Item value={`item${index}`} text={item} key={index} />)}
        </MultiSelect>
        <h1>disabled</h1>
        <MultiSelect
          value={this.state.value}
          disabled
          placeholder="请选择"
          optionLabelProp="text"
          onChange={this.handleChange.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          size={this.state.size}
        >
          {text.map((item, index) => <Item value={`item${index}`} text={item} key={index} />)}
        </MultiSelect>
      </div>
    );
  }
}

export default Demo;
