import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Button from 'uxcore-button';

import MultiSelect from '../src';
import CheckboxGroup from 'uxcore-checkbox-group';

const Item = MultiSelect.Item;

describe('MultiSelect', () => {

  let instance;
  let dropDown;
  it('is shallow rendered without error', () => {
    instance = shallow(<MultiSelect />);
    expect(instance.exists()).to.be(true);
  });

  it('has a correct proptypes', () => {
    expect(MultiSelect.propTypes).to.eql({
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
      onSubmit: React.PropTypes.func
    });
  });

  it('has a correct display name', () => {
    expect(MultiSelect.displayName).to.be('MultiSelect');
  });

  it('has a correct sub component', () => {
    expect(MultiSelect.Item).to.eql(CheckboxGroup.Item);
  });

  it('is full rendered without error', () => {
    instance = mount(<MultiSelect />);
    expect(instance.exists()).to.be(true);
    instance = mount(
      <MultiSelect>
        <Item value="1" />
        <Item value="2" />
        <Item value="3" />
      </MultiSelect>
    );
    dropDown = mount(instance.find('Trigger').node.getComponent());
    expect(dropDown.find(CheckboxGroup.Item).length).to.be(3);
  });

  it('toggles dropDown when clicking the select-arrow', () => {
    instance = mount(
      <MultiSelect>
        <Item value="1" />
      </MultiSelect>
    );
    let selectArrow = instance.find('.kuma-multi-select-arrow');
    selectArrow.simulate('click');
    expect(instance.state().visible).to.be(true);
    selectArrow.simulate('click');
    expect(instance.state().visible).to.be(false);
    instance = mount(
      <MultiSelect disabled={true}>
        <Item value="1" />
      </MultiSelect>
    );
    selectArrow = instance.find('.kuma-multi-select-arrow');
    selectArrow.simulate('click');
    expect(instance.state().visible).to.be(false);
  });

  // it('triggers handleChange correctly', () => {
  //   const spy = sinon.spy();
  //   instance = mount(
  //     <MultiSelect
  //       onChange={spy}
  //     >
  //       <Item value="1" />
  //       <Item value="2" />
  //       <Item value="3" />
  //     </MultiSelect>
  //   );
  //   dropDown = mount(instance.find('Trigger').node.getComponent());
  //   const item = dropDown.find(CheckboxGroup.Item).at(0);
  //   spy.reset();
  //
  //
  // });

  it('triggers handleSelectAll and handleClear correctly', () => {
    const spy = sinon.spy();
    instance = mount(
      <MultiSelect onChange={spy}>
        <Item value="1" />
        <Item value="2" />
      </MultiSelect>
      );
    dropDown = mount(instance.find('Trigger').node.getComponent());
    dropDown.find(Button).at(0).simulate('click');
    expect(spy.calledOnce).to.be(true);
    expect(spy.args[0][0]).to.eql(['1', '2']);
    spy.reset();
    dropDown.find(Button).at(1).simulate('click');
    expect(spy.calledOnce).to.be(true);
    expect(spy.args[0][0]).to.eql([]);
    spy.reset();

    instance = mount(
      <MultiSelect onChange={spy} value={['2', '3']}>
        <Item value="1" disabled={true} />
        <Item value="2" disabled={true} />
        <Item value="3" />
        <Item value="4" />
      </MultiSelect>
    );
    dropDown = mount(instance.find('Trigger').node.getComponent());
    dropDown.find(Button).at(0).simulate('click');
    expect(spy.calledOnce).to.be(true);
    expect(spy.args[0][0]).to.eql(['2', '3', '4']);
    spy.reset();
    dropDown.find(Button).at(1).simulate('click');
    expect(spy.calledOnce).to.be(true);
    expect(spy.args[0][0]).to.eql(['2']);
    spy.reset();

    instance = mount(
      <MultiSelect onChange={spy} disabled={true}>
        <Item value="1" />
        <Item value="2" />
      </MultiSelect>
    );
    dropDown = mount(instance.find('Trigger').node.getComponent());
    dropDown.find(Button).at(0).simulate('click');
    expect(spy.calledOnce).to.be(false);
    spy.reset();
    dropDown.find(Button).at(1).simulate('click');
    expect(spy.calledOnce).to.be(false);

  });

});