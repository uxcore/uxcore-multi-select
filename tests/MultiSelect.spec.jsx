import expect from 'expect.js';
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import sinon from 'sinon';
import CheckboxGroup from 'uxcore-checkbox-group';

import MultiSelect, { Item } from '../src';

Enzyme.configure({ adapter: new Adapter() });

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
    dropDown = mount(instance.find('Trigger').instance().getComponent());
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

  it('triggers handleChange and handleOk correctly', () => {
    const spy = sinon.spy();
    instance = mount(
      <MultiSelect onChange={spy} maxSelect={2} onSubmit={spy}>
        <Item value="1" text="text1" />
        <Item value="2" />
        <Item value="3" />
      </MultiSelect>
    );
    dropDown = mount(instance.find('Trigger').instance().getComponent());
    const item = dropDown.find(CheckboxGroup.Item);
    const checkBox1 = item.find('.kuma-checkbox').at(0);
    checkBox1.instance().checked = true;
    checkBox1.simulate('change');
    expect(spy.callCount).to.be(1);
    expect(spy.args[0][0]).to.eql(['1']);
    checkBox1.instance().checked = false;
    checkBox1.simulate('change');
    expect(spy.callCount).to.be(2);
    expect(spy.args[1][0]).to.eql([]);
    spy.reset();
    const checkBox2 = item.find('.kuma-checkbox').at(1);
    const checkBox3 = item.find('.kuma-checkbox').at(2);
    checkBox1.instance().checked = true;
    checkBox1.simulate('change');
    checkBox2.instance().checked = true;
    checkBox2.simulate('change');
    expect(spy.callCount).to.be(2);
    expect(spy.args[0][0]).to.eql(['1']);
    expect(spy.args[1][0]).to.eql(['1', '2']);
    checkBox3.instance().checked = true;
    checkBox3.simulate('change');
    expect(spy.callCount).to.be(3);
    expect(spy.args[2][0]).to.eql(['1', '2']);
    spy.reset();
    instance.instance().handleOk();
    expect(spy.callCount).to.be(1);
    expect(spy.args[0][0]).to.eql(['1', '2']);
    expect(spy.args[0][1]).to.eql(['text1', '2']);
  });

  it('triggers handleSelectAll and handleClear correctly', () => {
    const spy = sinon.spy();
    instance = mount(
      <MultiSelect onChange={spy}>
        <Item value="1" />
        <Item value="2" />
      </MultiSelect>
    );
    instance.instance().handleSelectAll();
    expect(spy.args[0][0]).to.eql(['1', '2']);
    spy.reset();
    instance.instance().handleClear();
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
    instance.instance().handleSelectAll();
    expect(spy.args[0][0]).to.eql(['2', '3', '4']);
    spy.reset();
    instance.instance().handleClear();
    expect(spy.args[0][0]).to.eql(['2']);
    spy.reset();
  });

  it('can change locale', () => {
    instance = mount(<MultiSelect
      maxSelect={3}
      locale="en-us"
    />);
    expect(instance.exists()).to.be(true);
    dropDown = mount(instance.find('Trigger').instance().getComponent());
    expect(dropDown.find('.kuma-button-primary').text()).to.eql('Ok');
    expect(dropDown.find('.kuma-button-secondary').text()).to.eql('Clear');
    expect(dropDown.find('.kuma-multi-select-footer p').text()).to.eql('Choose up to 3');
  });

  it('can change size', () => {
    instance = mount(<MultiSelect size="small" />);
    expect(instance.exists()).to.be(true);
    expect(instance.find('.kuma-multi-select').hasClass('kuma-multi-select-small'));
  });
});
