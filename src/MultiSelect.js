/**
 * MultiSelect Component for uxcore
 * @author peijie.dpj
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dropdown from 'uxcore-dropdown';
import CheckboxGroup from 'uxcore-checkbox-group';
import Button from 'uxcore-button';
import assign from 'object-assign';
import classnames from 'classnames';

export default class MultiSelect extends Component {

  static displayName = "MultiSelect";
  static Item = CheckboxGroup.Item;
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    dropdownClassName: PropTypes.string,
    value: PropTypes.array,
    disabled: PropTypes.bool,
    maxSelect: PropTypes.number,
    placeholder: PropTypes.string,
    titleBreakStr: PropTypes.string,
    optionLabelProp: PropTypes.string,
    showSelectAll: PropTypes.bool,
    showClear: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };
  static defaultProps = {
    prefixCls: 'kuma-multi-select',
    className: '',
    dropdownClassName: '',
    value: [],
    disabled: false,
    placeholder: '',
    titleBreakStr: "、",
    optionLabelProp: "text",
    showSelectAll: true,
    showClear: true,
    onChange: function () {},
    onSubmit: function () {},
  };

  state = {
    visible: false,
    lastValues: this.props.value,
  };

  handleChange = (values) => {
    const { props } = this;
    let newValues = [];
    if (props.maxSelect && values.length > props.maxSelect) {
      newValues = this.state.lastValues;
    } else {
      newValues = values;
      this.setState({ lastValues: values });
    }
    props.onChange(newValues);
  };

  handleSelectAll = () => {
    const { props } = this;
    let valueList = [];
    if (props.disabled) {
      return;
    } else {
      React.Children.forEach(props.children, (item) => {
        if (!item.props.disabled || this._hasSelected(item.props.value)) {
          valueList.push(item.props.value);
        }
      });
    }
    props.onChange(valueList);
  };

  handleClear = () => {
    const { props } = this;
    let valueList = [];
    if (props.disabled) {
      return;
    } else {
      React.Children.forEach(props.children, (item) => {
        if (item.props.disabled && this._hasSelected(item.props.value)) {
          valueList.push(item.props.value);
        }
      })
    }
    props.onChange(valueList);
  };

  // handleSubmit = () => {
  //   const { props } = this;
  //   let labelList = [],
  //     valueList = [];
  //   React.Children.map(props.children, (item) => {
  //     if (this._hasSelected(item.props.value)) {
  //       labelList.push(item.props[props.optionLabelProp]);
  //       valueList.push(item.props.value);
  //     }
  //   });
  //   props.onSubmit(valueList, labelList);
  //
  //   this.setState({
  //     visible: false
  //   })
  // };

  _processLabel = (type) => {
    const { props } = this;
    let res = [];
    res = React.Children.map(props.children, (item) => {
        if (this._hasSelected(item.props.value)) {
          switch (type) {
            case 'content':
              return <span className={`${props.prefixCls}-selection__choice__content`}>{item.props[props.optionLabelProp]}<span className={`${props.prefixCls}-selection__choice__break`}>{props.titleBreakStr}</span></span>;
              break;
            case 'title':
              return item.props[props.optionLabelProp] + props.titleBreakStr;
              break;
          }
        }
      }) || [];

    if (res.length == 0) {
      switch (type) {
        case 'content':
          res = <span className={`${props.prefixCls}-selection__placeholder`}>{props.placeholder}</span>;
          break;
        case 'title':
          res = [props.placeholder];
          break;
      }
    } else {
      if (type == 'title') {
        let len = res.length;
        res[len - 1] = res[len - 1].slice(0, res[len - 1].length - 1);
      }
    }
    return type == 'title' ? res.join('') : res;
  };

  _hasSelected = (value) => {
    return this.props.value.indexOf(value) != -1;
  };

  _handleVisibleChange = (visible) => {
    const { props } = this;
    if (props.disabled) {
      return;
    }
    this.setState({
      visible: visible
    });
  };

  render() {
    const { props } = this;

    // 检查是否可以点击 全选
    let canSelectItemNumbers = 0;

    React.Children.map(props.children, (item) => {
      !item.props.disabled && canSelectItemNumbers++;
    });

    let menu = (
      <div className={`${props.prefixCls}-dropdown-border`}>
        <div className={`${props.prefixCls}-content`}>
          <CheckboxGroup
            onChange={this.handleChange}
            value={props.value}
          >
            {
              React.Children.map(props.children, (item, index) => {
                return <CheckboxGroup.Item {...item.props} key={index} jsxdisabled={props.disabled} />
              })
            }
          </CheckboxGroup>

        </div>
        <div className={`${props.prefixCls}-footer`}>
          {!!props.maxSelect && <p>最多选{props.maxSelect}个</p>}
          <Button
            className={classnames({
              [props.prefixCls + '-button']: true,
              [props.prefixCls + '-button-hidden']: !props.showSelectAll
            })}
            size="small"
            disabled={!!(props.maxSelect && (props.maxSelect < canSelectItemNumbers))}
            onClick={this.handleSelectAll}
          >全选
          </Button>

          <Button
            className={classnames({
              [props.prefixCls + '-button']: true,
              [props.prefixCls + '-button-hidden']: !props.showClear
            })}
            size="small"
            onClick={this.handleClear}
          >清空
          </Button>

          {/*<Button className={`${props.prefixCls}-button`}
           size="small"
           onClick={this.handleSubmit}>确认
           </Button>*/}
        </div>
      </div>
    );

    return (
      <div>
        <Dropdown
          overlay={menu}
          minOverlayWidthMatchTrigger={false}
          visible={this.state.visible}
          onVisibleChange={this._handleVisibleChange}
          trigger={["click"]}
          overlayClassName={classnames({
            [props.prefixCls + '-dropdown']: true,
            [props.dropdownClassName]: !!props.dropdownClassName
          })}
        >
           <span
             className={classnames({
               [props.prefixCls]: true,
               [props.className]: !!props.className,
               [props.prefixCls + '-open']: this.state.visible,
               [props.prefixCls + '-disabled']: props.disabled
             })}
           >
             <span className={`${props.prefixCls}-selection ${props.prefixCls}-selection--multiple`}>
               <span className={`${props.prefixCls}-selection--multiple--content`} title={this._processLabel('title')}>{this._processLabel('content')}</span>
               <span className={`${props.prefixCls}-arrow`} />
             </span>
            </span>
        </Dropdown>
      </div>
    );
  }

}
