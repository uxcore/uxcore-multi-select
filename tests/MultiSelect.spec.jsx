import expect from 'expect.js';
import { findDOMNode } from 'react-dom';
import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Button from 'uxcore-button';
import Dropdown from 'uxcore-dropdown';
import CheckboxGroup from 'uxcore-checkbox-group';

import MultiSelect from '../src';

const Item = MultiSelect.Item;

describe('MultiSelect', () => {
  let instance;
  let dropDown;
  it('is shallow rendered without error', () => {
    instance = shallow(<MultiSelect />);
    expect(instance.exists()).to.be(true);
  });

  it('has a correct proptypes', () => {
    expect(Object.keys(MultiSelect.propTypes)).to.eql([
      'prefixCls',
      'className',
      'dropdownClassName',
      'value',
      'disabled',
      'maxSelect',
      'placeholder',
      'titleBreakStr',
      'optionLabelProp',
      'showSelectAll',
      'showClear',
      'onChange',
      'onSubmit',
      'locale',
      'size',
    ]);
  });

  it('has a correct display name', () => {
    expect(MultiSelect.displayName).to.be('MultiSelect');
  });
  expect(MultiSelect.Item).to.eql(CheckboxGroup.Item);

  it('has a correct sub component', () => {
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
      <MultiSelect disabled>
        <Item value="1" />
      </MultiSelect>
    );
    selectArrow = instance.find('.kuma-multi-select-arrow');
    selectArrow.simulate('click');
    expect(instance.state().visible).to.be(false);
  });

  it('triggers handleChange correctly', () => {
    const spy = sinon.spy();
    instance = mount(
      <MultiSelect onChange={spy} maxSelect={2}>
        <Item value="1" />
        <Item value="2" />
        <Item value="3" />
      </MultiSelect>
    );
    dropDown = mount(instance.find('Trigger').node.getComponent());
    const item = dropDown.find(CheckboxGroup.Item);
    const checkBox1 = item.find('.kuma-checkbox').at(0);
    checkBox1.node.checked = true;
    checkBox1.simulate('change');
    expect(spy.callCount).to.be(1);
    expect(spy.args[0][0]).to.eql(['1']);
    checkBox1.node.checked = false;
    checkBox1.simulate('change');
    expect(spy.callCount).to.be(2);
    expect(spy.args[1][0]).to.eql([]);
    spy.reset();
    const checkBox2 = item.find('.kuma-checkbox').at(1);
    const checkBox3 = item.find('.kuma-checkbox').at(2);
    checkBox1.node.checked = true;
    checkBox1.simulate('change');
    checkBox2.node.checked = true;
    checkBox2.simulate('change');
    expect(spy.callCount).to.be(2);
    expect(spy.args[0][0]).to.eql(['1']);
    expect(spy.args[1][0]).to.eql(['1', '2']);
    checkBox3.node.checked = true;
    checkBox3.simulate('change');
    expect(spy.callCount).to.be(3);
    expect(spy.args[2][0]).to.eql(['1', '2']);
  });

  it('triggers handleSelectAll and handleClear correctly', () => {
    const spy = sinon.spy();
    instance = mount(
      <MultiSelect onChange={spy}>
        <Item value="1" />
        <Item value="2" />
      </MultiSelect>
    );
    instance.node.handleSelectAll();
    expect(spy.args[0][0]).to.eql(['1', '2']);
    spy.reset();
    instance.node.handleClear();
    expect(spy.args[0][0]).to.eql([]);
    spy.reset();

    instance = mount(
      <MultiSelect onChange={spy} value={['2', '3']}>
        <Item value="1" disabled />
        <Item value="2" disabled />
        <Item value="3" />
        <Item value="4" />
      </MultiSelect>
    );
    instance.node.handleSelectAll();
    expect(spy.args[0][0]).to.eql(['2', '3', '4']);
    spy.reset();
    instance.node.handleClear();
    expect(spy.args[0][0]).to.eql(['2']);
    spy.reset();
  });

  it('can change locale', () => {
    instance = mount(<MultiSelect
      maxSelect={3}
      locale="en-us"
    />);
    expect(instance.exists()).to.be(true);
    dropDown = mount(instance.find('Trigger').node.getComponent());
    expect(findDOMNode(dropDown.find(Button).nodes[0]).innerHTML === 'select all');
    expect(findDOMNode(dropDown.find(Button).nodes[1]).innerHTML === 'clear');
    expect(dropDown.find('.kuma-multi-select-footer p').innerHTML === 'max select 3');
  });

  it('can change size', () => {
    instance = mount(<MultiSelect size="small" />);
    expect(instance.exists()).to.be(true);
    const domNode = findDOMNode(instance.nodes[0]).childNodes[0];
    expect(domNode.classList.contains('kuma-multi-select-small'));
  });
});
