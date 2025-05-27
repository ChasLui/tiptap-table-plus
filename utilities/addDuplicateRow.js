import { rowIsHeader, tableNodeTypes } from "@tiptap/pm/tables";

/**
 * 向 ProseMirror 的表格中添加一行重复的行。
 *
 * @param {Transaction} tr - ProseMirror 的事务对象。
 * @param {Object} tableInfo - 表格相关信息（map, tableStart, table）。
 * @param {number} row - 需要被复制的行的索引。
 * @param {boolean} withContent - 是否复制行内容。
 * @returns {Transaction} - 更新后的事务对象。
 */
export default function addDuplicateRow(
    tr,
    { map, tableStart, table },
    row,
    withContent = true
) {
    // 计算要复制的行的起始位置
    let rowPos = tableStart;
    for (let i = 0; i < row; i++) rowPos += table.child(i).nodeSize;

    const cells = []; // 用于存放新行中每个单元格节点
    let refRow = row > 0 ? -1 : 0; // 参考行索引，用于复制内容

    // 检查参考行是否为表头（如有需要可启用）
    // if (rowIsHeader(map, table, row + refRow))
    //     refRow = row == 0 || row == map.height ? null : 0;

    // 遍历该行的每一列
    for (let col = 0, index = map.width * row; col < map.width; col++, index++) {
        // 处理被 rowspan 覆盖的单元格
        if (
            row > 0 &&
            row < map.height &&
            map.map[index] == map.map[index - map.width]
        ) {
            const pos = map.map[index]; // 获取被合并单元格的位置
            const attrs = table.nodeAt(pos).attrs; // 获取该单元格的属性

            // 更新 rowspan 属性，使其包含新插入的行
            tr.setNodeMarkup(tableStart + pos, null, {
                ...attrs,
                rowspan: attrs.rowspan + 1,
            });

            // 跳过被 colspan 覆盖的列
            col += attrs.colspan - 1;
        } else {
            // 获取当前列的参考单元格（用于复制内容和属性）
            const _refRow = !Array.isArray(map.map) || refRow == null || !((index + refRow * map.width) in map.map)
                ? null
                : table.nodeAt(map.map[index + refRow * map.width]);

            // 判断当前单元格类型（表头或普通单元格）
            const type =
                refRow == null
                    ? tableNodeTypes(table.type.schema).cell
                    : table.nodeAt(map.map[index + refRow * map.width])?.type;

            // 创建新的单元格节点，可选择是否复制内容
            const node = _refRow !== null
                ? (withContent
                    ? type?.create({ ..._refRow.attrs }, _refRow.content)
                    : type?.createAndFill({ ..._refRow.attrs }))
                : type?.createAndFill();

            // 将新单元格加入 cells 数组
            if (node) cells.push(node);
        }
    }

    // 在表格中插入新行
    tr.insert(rowPos, tableNodeTypes(table.type.schema).row.create(null, cells));
    return tr;
}