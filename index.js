// 引入 Tiptap 的表格扩展
import TiptapTable from '@tiptap/extension-table'
// 引入自定义的列复制命令
import duplicateColumn from './commands/duplicateColumn';
// 引入自定义的行复制命令
import duplicateRow from './commands/duplicateRow';

// 扩展 Tiptap 的 Table 扩展，添加自定义命令
export const Table = TiptapTable.extend({
    // 重写 addCommands 方法，添加自定义命令
    addCommands() {
        return {
            // 保留父类的命令
            ...this.parent?.(),
            // 添加 duplicateColumn 命令，支持是否带内容复制
            duplicateColumn: (withContent = true) => ({ state, dispatch }) => {
                duplicateColumn(state, dispatch, withContent)
                return true;
            },
            // 添加 duplicateRow 命令，支持是否带内容复制
            duplicateRow: (withContent = true) => ({ state, dispatch }) => {
                duplicateRow(state, dispatch, withContent)
                return true;
            },
        }
    }
})

// 导出扩展后的 Table 组件
export default Table
