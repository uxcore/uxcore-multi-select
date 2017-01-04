/**
 * MultiSelect Component for uxcore
 * @author peijie.dpj
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const Dropdown = require('uxcore-dropdown');
const CheckboxGroup = require('uxcore-checkbox-group');
const Button = require('uxcore-button');
const classnames = require('classnames');

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.lastValue = this.props.value || [];
  }

  handleChange(value) {
    const me = this;
    const props = this.props;

    let newValue = [];
    if (props.maxSelect && value.length > props.maxSelect) {
      newValue = me.lastValue;
    } else {
      newValue = value;
      me.lastValue = value;
    }

    props.onChange(newValue);
  }

  handleSelectAll() {
    const me = this;
    const props = this.props;

    const valueList = [];
    if (props.disabled) {
      return;
    }

    React.Children.map(props.children, (item) => {
      if (!item.props.disabled || me.hasSelected.call(me, item.props.value)) {
        valueList.push(item.props.value);
      }
    });

    props.onChange(valueList);
  }

  handleClear() {
    const me = this;
    const props = this.props;

    const valueList = [];

    if (props.disabled) {
      return;
    }

    React.Children.map(props.children, (item) => {
      if (item.props.disabled && me.hasSelected.call(me, item.props.value)) {
        valueList.push(item.props.value);
      }
    });

    props.onChange(valueList);
  }

  handleSubmit() {
    const me = this;
    const props = this.props;

    const labelList = [];
    const valueList = [];

    React.Children.map(props.children, (item) => {
      if (me.hasSelected.call(me, item.props.value)) {
        labelList.push(item.props[props.optionLabelProp]);
        valueList.push(item.props.value);
      }
    });

    props.onSubmit(valueList, labelList);

    me.setState({
      visible: false,
    });
  }

  processLabel(type) {
    const me = this;
    const props = this.props;

    let res = [];
    res = React.Children.map(props.children, (item) => {
      if (me.hasSelected.call(me, item.props.value)) {
        switch (type) {
          case 'content':
            return (
              <span className={`${props.prefixCls}-selection__choice__content`}>{item.props[props.optionLabelProp]}
                <span className={`${props.prefixCls}-selection__choice__break`}>{props.titleBreakStr}</span></span>
              );
          case 'title':
            return item.props[props.optionLabelProp] + props.titleBreakStr;
          default:
            return null;
        }
      }
      return null;
    });

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
  }

  hasSelected(value) {
    const me = this;

    return me.props.value.indexOf(value) !== -1;
  }

  handleVisbleChange(visible) {
    const props = this.props;

    if (props.disabled) {
      return;
    }
    this.setState({
      visible,
    });
  }

  render() {
    const me = this;
    const props = this.props;

    // 检查是否可以点击 全选
    let canSelectItemNumbers = 0;

    React.Children.forEach(props.children, (item) => {
      if (!item.props.disabled) {
        canSelectItemNumbers += 1;
      }
    });

    const menu =
      (<div className={`${props.prefixCls}-dropdown-border`}>
        <div className={`${props.prefixCls}-content`}>
          <CheckboxGroup
            onChange={me.handleChange.bind(me)}
            value={props.value}
          >
            {React.Children.map(props.children, (item, index) => (
              <CheckboxGroup.Item {...item.props} key={index} jsxdisabled={props.disabled} />
            ))
            }
          </CheckboxGroup>

        </div>
        <div
          className={classnames(`${props.prefixCls}-footer`, {
            [`${props.prefixCls}-footer-hidden`]: !props.showSelectAll && !props.showClear && !props.maxSelect,
          })}
        >
          {!!props.maxSelect && <p>最多选{props.maxSelect}个</p>}
          <Button
            className={classnames({
              [`${props.prefixCls}-button`]: true,
              [`${props.prefixCls}-button-hidden`]: !props.showSelectAll,
            })}
            size="small"
            disabled={(props.maxSelect && (props.maxSelect < canSelectItemNumbers))}
            onClick={me.handleSelectAll.bind(me)}
          >全选
          </Button>

          <Button
            className={classnames({
              [`${props.prefixCls}-button`]: true,
              [`${props.prefixCls}-button-hidden`]: !props.showClear,
            })}
            size="small"
            onClick={me.handleClear.bind(me)}
          >清空
          </Button>
        </div>
      </div>);

    return (
      <div>
        <Dropdown
          overlay={menu}
          minOverlayWidthMatchTrigger={false}
          visible={me.state.visible}
          onVisibleChange={me.handleVisbleChange.bind(me)}
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
              [`${props.prefixCls}-open`]: me.state.visible,
              [`${props.prefixCls}-disabled`]: props.disabled,
            })}
          >
            <span className={`${props.prefixCls}-selection ${props.prefixCls}-selection--multiple`}>
              <span className={`${props.prefixCls}-selection--multiple--content`} title={me.processLabel('title')}>
                {me.processLabel('content')}
              </span>
              <span className={`${props.prefixCls}-arrow`} />
            </span>
          </span>
        </Dropdown>
      </div>
    );
  }
}

MultiSelect.defaultProps = {
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
  onChange() {},
  onSubmit() {},
};

MultiSelect.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  dropdownClassName: React.PropTypes.string,
  value: React.PropTypes.array,
  disabled: React.PropTypes.bool,
  maxSelect: React.PropTypes.number,
  placeholder: React.PropTypes.string,
  titleBreakStr: React.PropTypes.string,
  optionLabelProp: React.PropTypes.string,
  showSelectAll: React.PropTypes.bool,
  showClear: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
};


// http://facebook.github.io/react/docs/reusable-components.html

MultiSelect.Item = CheckboxGroup.Item;

MultiSelect.displayName = 'MultiSelect';

module.exports = MultiSelect;
