/**
 * MultiSelect Component for uxcore
 * @author peijie.dpj
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React, { Component, PropTypes } from 'react';
import Dropdown from 'uxcore-dropdown';
import CheckboxGroup from 'uxcore-checkbox-group';
import Button from 'uxcore-button';
import classnames from 'classnames';

export default class MultiSelect extends Component {

  static displayName = 'MultiSelect';
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
    contorlButtonName: PropTypes.object,
  };
  static defaultProps = {
    prefixCls: 'kuma-multi-select',
    className: '',
    dropdownClassName: '',
    value: [],
    disabled: false,
    placeholder: '',
    titleBreakStr: '、',
    optionLabelProp: 'text',
    showSelectAll: true,
    showClear: true,
    onChange() { },
    onSubmit() { },
    contorlButtonName: {
      clear: '清空',
      selectAll: '全选',
      maxSelect: ['最多选', '个'],
    },
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
    const valueList = [];
    if (props.disabled) {
      return;
    }
    React.Children.forEach(props.children, (item) => {
      if (!item.props.disabled || this.hasSelected(item.props.value)) {
        valueList.push(item.props.value);
      }
    });

    props.onChange(valueList);
  };

  handleClear = () => {
    const { props } = this;
    const valueList = [];
    if (props.disabled) {
      return;
    }
    React.Children.forEach(props.children, (item) => {
      if (item.props.disabled && this.hasSelected(item.props.value)) {
        valueList.push(item.props.value);
      }
    });
    props.onChange(valueList);
  };

  processLabel = (type) => {
    const { props } = this;
    let res = [];
    res = React.Children.map(props.children, (item) => {
      if (this.hasSelected(item.props.value)) {
        switch (type) {
          case 'content':
            return <span className={`${props.prefixCls}-selection__choice__content`}>{item.props[props.optionLabelProp]}<span className={`${props.prefixCls}-selection__choice__break`}>{props.titleBreakStr}</span></span>;
          case 'title':
            return item.props[props.optionLabelProp] + props.titleBreakStr;
          default:
            return '';
        }
      }
      return null;
    }) || [];

    if (res.length === 0) {
      switch (type) {
        case 'content':
          res = <span className={`${props.prefixCls}-selection__placeholder`}>{props.placeholder}</span>;
          break;
        case 'title':
          res = [props.placeholder];
          break;
        default:
          res = '';
      }
    } else if (type === 'title') {
      const len = res.length;
      res[len - 1] = res[len - 1].slice(0, res[len - 1].length - 1);
    }
    return type === 'title' ? res.join('') : res;
  };

  hasSelected = value => this.props.value.indexOf(value) !== -1;

  handleVisibleChange = (visible) => {
    const { props } = this;
    if (props.disabled) {
      return;
    }
    this.setState({
      visible,
    });
  };

  render() {
    const { props } = this;

    // 检查是否可以点击 全选
    let canSelectItemNumbers = 0;

    React.Children.forEach(props.children, (item) => {
      if (!item.props.disabled) {
        canSelectItemNumbers += 1;
      }
    });

    const menu = (
      <div className={`${props.prefixCls}-dropdown-border`}>
        <div className={`${props.prefixCls}-content`}>
          <CheckboxGroup
            onChange={this.handleChange}
            value={props.value}
          >
            {
              React.Children.map(props.children, (item, index) => (
                <CheckboxGroup.Item {...item.props} key={index} jsxdisabled={props.disabled} />
              ))
            }
          </CheckboxGroup>

        </div>
        <div
          className={classnames(`${props.prefixCls}-footer`, {
            [`${props.prefixCls}-footer-hidden`]: !props.maxSelect && !props.showClear && !props.showSelectAll,
          })}
        >
          {!!props.maxSelect && <p>{
              props.contorlButtonName.maxSelect[0] +
              props.maxSelect +
              props.contorlButtonName.maxSelect[1]
            }</p>
          }
          <Button
            className={classnames({
              [`${props.prefixCls}-button`]: true,
              [`${props.prefixCls}-button-hidden`]: !props.showSelectAll,
            })}
            size="small"
            disabled={!!(props.maxSelect && (props.maxSelect < canSelectItemNumbers))}
            onClick={this.handleSelectAll}
          >{props.contorlButtonName.selectAll}
          </Button>

          <Button
            className={classnames({
              [`${props.prefixCls}-button`]: true,
              [`${props.prefixCls}-button-hidden`]: !props.showClear,
            })}
            size="small"
            onClick={this.handleClear}
          >{props.contorlButtonName.clear}
          </Button>
        </div>
      </div>
    );

    return (
      <div>
        <Dropdown
          overlay={menu}
          minOverlayWidthMatchTrigger={false}
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          trigger={['click']}
          overlayClassName={classnames({
            [`${props.prefixCls}-dropdown`]: true,
            [props.dropdownClassName]: !!props.dropdownClassName,
          })}
        >
          <span
            className={classnames({
              [props.prefixCls]: true,
              [props.className]: !!props.className,
              [`${props.prefixCls}-open`]: this.state.visible,
              [`${props.prefixCls}-disabled`]: props.disabled,
            })}
          >
            <span className={`${props.prefixCls}-selection ${props.prefixCls}-selection--multiple`}>
              <span className={`${props.prefixCls}-selection--multiple--content`} title={this.processLabel('title')}>{this.processLabel('content')}</span>
              <span className={`${props.prefixCls}-arrow`} />
            </span>
          </span>
        </Dropdown>
      </div>
    );
  }

}
