import { columnIsHeader, addColSpan, tableNodeTypes } from '@tiptap/pm/tables'
// 导入表格相关的工具函数和类型

export default function addDuplicateColumn(
    tr, // ProseMirror 的变更事务对象
    { map, tableStart, table }, // 表格的映射、起始位置和表格节点
    col, // 需要复制的列索引
    withContent = true // 是否复制内容，默认为 true
) {
    let refColumn = col > 0 ? -1 : 0; // 默认参考列：如果不是第一列，参考左侧一列，否则为当前列
    if (columnIsHeader(map, table, col + refColumn)) {
        // 如果参考列是表头，则特殊处理
        refColumn = col == 0 || col == map.width ? null : 0;
    }

    // 遍历表格的每一行
    for (let row = 0; row < map.height; row++) {
        const index = row * map.width + col; // 当前单元格在 map 中的索引
        // 如果当前位置在一个跨列单元格内部
        if (col > 0 && col < map.width && map.map[index - 1] == map.map[index]) {
            const pos = map.map[index]; // 获取单元格在表格中的位置
            const cell = table.nodeAt(pos); // 获取单元格节点
            tr.setNodeMarkup(
                tr.mapping.map(tableStart + pos), // 计算全局位置
                null,
                addColSpan(cell.attrs, col - map.colCount(pos)), // 增加 colspan 属性
            );
            // 如果单元格有跨多行，则跳过这些行
            row += cell.attrs.rowspan - 1;
        } else {
            // 获取参考列的单元格节点（如果有）
            const _refColumn = refColumn == null ? null : table.nodeAt(map.map[index + refColumn]);
            // 确定新单元格的类型
            const type =
                refColumn == null
                    ? tableNodeTypes(table.type.schema).cell // 默认普通单元格
                    : table.nodeAt(map.map[index + refColumn]).type; // 参考列的类型
            const pos = map.positionAt(row, col, table); // 计算插入位置
            // 插入新单元格，内容和属性根据 withContent 和参考列决定
            tr.insert(tr.mapping.map(tableStart + pos), _refColumn !== null ? (withContent ? type.create({ ..._refColumn.attrs }, _refColumn.content) : type.createAndFill({ ..._refColumn.attrs })) : type.createAndFill());
        }
    }
    return tr; // 返回变更后的事务对象
}