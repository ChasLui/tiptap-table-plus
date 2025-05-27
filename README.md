# Tiptap Table Plus

[![NPM](https://img.shields.io/npm/v/tiptap-table-plus.svg)](https://www.npmjs.com/package/tiptap-table-plus)

`tiptap-table-plus` 是一个 npm 包，通过新增两个命令：`duplicateColumn` 和 `duplicateRow`，扩展了 Tiptap 编辑器的表格功能。

## 安装

使用 npm 安装该包：

```bash
npm install tiptap-table-plus
```

## 命令

### `duplicateColumn`

此命令会复制当前列。默认情况下，会连同内容一起复制。

用法

```js
editor.commands.duplicateColumn(true);
```

参数

- `withContent` (boolean)：
- 如果为 true，将会复制列的内容。如果为 false，只复制结构，不复制内容。默认值为 true。

### `duplicateRow`

此命令会复制当前行。默认情况下，会连同内容一起复制。

用法

```js
editor.commands.duplicateRow(true);
```

参数

- `withContent` (boolean)：
- 如果为 true，将会复制行的内容。如果为 false，只复制结构，不复制内容。默认值为 true。

## 示例

以下是在 Tiptap 编辑器中使用这些命令的示例：

```js
import { Editor } from '@tiptap/core';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TiptapTablePlus from 'tiptap-table-plus';

const editor = new Editor({
  extensions: [
    Table,
    TableRow,
    TableCell,
    TableHeader,
    TiptapTablePlus,
  ],
  content: '<p>Hello World!</p>',
});

// 复制当前列及其内容
editor.commands.duplicateColumn(true);

// 复制当前行但不复制内容
editor.commands.duplicateRow(false);
```

## 许可证

本包采用 MIT 许可证开源。
