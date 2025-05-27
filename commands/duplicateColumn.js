// 从 @tiptap/pm/tables 导入 isInTable 和 selectedRect，用于判断是否在表格中以及获取选中区域
import { isInTable, selectedRect } from '@tiptap/pm/tables'
// 导入自定义的 addDuplicateColumn 工具函数，用于实现列的复制
import addDuplicateColumn from '../utilities/addDuplicateColumn';

// duplicateColumn 是一个命令函数，用于在表格中复制当前选中的列
// state: 编辑器当前状态
// dispatch: 用于分发事务的函数
// withContent: 是否连同内容一起复制，默认为 true
const duplicateColumn = (state, dispatch, withContent = true) => {
    // 如果当前光标不在表格中，直接返回 false，命令不执行
    if (!isInTable(state)) return false;
    // 如果 dispatch 存在，说明需要执行复制操作
    if (dispatch) {
        // 获取当前选中的表格区域
        const rect = selectedRect(state);
        // 调用 dispatch，执行 addDuplicateColumn，复制选中列到右侧
        dispatch(addDuplicateColumn(state.tr, rect, rect.right, withContent));
    }
    // 命令执行成功，返回 true
    return true;
}

// 导出 duplicateColumn 命令，供外部使用
export default duplicateColumn;