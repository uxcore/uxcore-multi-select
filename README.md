---

## uxcore-multi-select [![Dependency Status](http://img.shields.io/david/uxcore/uxcore-multi-select.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-multi-select) [![devDependency Status](http://img.shields.io/david/dev/uxcore/uxcore-multi-select.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-multi-select#info=devDependencies) 

## TL;DR

uxcore-multi-select ui component for react

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-multi-select
$ cd uxcore-multi-select
$ npm install
$ gulp server
```

## Usage

```javascript
let Multiselect = require('../src');

let Item = Multiselect.Item;

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ["item2", "item15"],
            disabled: false
        }
    }

    handleChange(value){
        this.setState({
            value: value,
            disabled: false
        })
        console.log('onChange', arguments)
    }
    handleSubmit(){
        console.log('onSubmit', arguments)
    }

    render() {
      let text= ['汉皇重色思倾国','御宇多年求不得','杨家有女初长成','养在深闺人未识',
                  '天生丽质难自弃','一朝选在君王侧','回眸一笑百媚生','六宫粉黛无颜色',
                  '春寒赐浴华清池','温泉水滑洗凝脂','侍儿扶起娇无力','始是新承恩泽时',
                  '云鬓花颜金步摇','芙蓉帐暖度春宵','春宵苦短日高起','从此君王不早朝'];

        return (
            <div>
                <Multiselect
                    value={this.state.value}
                    disabled={this.state.disabled}
                    onChange={this.handleChange.bind(this)}
                    onSubmit={this.handleSubmit.bind(this)}>
                  {text.map(function(item, index) {
                    return <Item value={'item' + index} text={item} />
                  })}
                </Multiselect>
            </div>
        );
    }
};

module.exports = Demo;

```

## demo
http://uxcore.github.io/uxcore/components/uxcore-multi-select/

## Props

### MulitSelect

| 配置项 | 类型 | 必填 | 默认值 | 功能/备注 |
|---|---|---|---|---|
|value|array|required|[]|由 value 组成的数组，与 React 受限组件表现一致，选中项与 value 保持一致，数组中的值与 item 的 value 相对应|
|onChange|function|required|-|与 React 受限组件表现一致，在 checkbox 群发生改变时触发，借此来更改 value|
|disabled|boolean|optional|false|是否为 disable 状态|
|className|string|optional|''|选择框的classname|
|dropdownClassName|string|optional|''|下拉框的classname|
|placeholder|string|optional|''|-|
|titleBreakStr|string|optional|'、'|选中选项在选择框中的链接符|
|optionLabelProp|string|optional|'text'|item中的哪一个prop作为选项展示的label|
|maxSelect|number|optional|-|最多可选选项数量|
|showSelectAll|boolean|optional|true|是否显示全选按钮(如果maxSelect小于实际数量则该按钮成为disabled状态)|
|showClear|boolean|optional|true|是否显示清空按钮|
|onSubmit|function|optional|-|点击确认时的回调函数，返回valueList数组和labelList数组|
### MulitSelectItem

> 通过 MulitSelect.Item 取得。实际prop与checkboxGroup.Item相同

| 配置项 | 类型 | 必填 | 默认值 | 功能/备注 |
|---|---|---|---|---|
|text|string|optinal|-|checkbox 后面跟着的说明文字|
|value|string|required|-|checkbox 对应的值|


