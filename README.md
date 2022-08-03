### Compiles and hot-reloads for development

```
yarn serve
```

## Element UI 中国省市区级联数据

`element-china-area-data`
`https://www.npmjs.com/package/element-china-area-data`

## 导出表格

使用`file-saver`和`xlsx`插件
`import FileSaver from "file-saver";
import * as XLSX from "xlsx";`

## 表格每一列格式化
Table-column 有`formatter`属性用来格式化内容

## 级联选择器
`https://element.eleme.cn/#/zh-CN/component/cascader`
+ props属性介绍

  + checkStrictly: true ==> 是否让父子不联动

  + label: 'name' ==> 树形结构展示的名称

  + value: 'name' ==> 选中某一项之后，真正提交的数据

  + emitPath: false ==> 是否拿到嵌套节点的所有数据(我们只需要当前节点的name值即可)
