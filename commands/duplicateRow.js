// 从 @tiptap/pm/tables 导入 isInTable 和 selectedRect，用于判断是否在表格中以及获取选中区域
import { isInTable, selectedRect } from "@tiptap/pm/tables";
// 导入自定义的 addDuplicateRow 工具函数，用于实现行的复制
import addDuplicateRow from "../utilities/addDuplicateRow";

// duplicateRow 是一个命令函数，用于在表格中复制当前选中的行
// state: 编辑器当前状态
// dispatch: 用于分发事务的函数
// withContent: 是否连带内容一起复制，默认为 true
const duplicateRow = (state, dispatch, withContent = true) => {
    // 如果当前光标不在表格中，直接返回 false，不执行任何操作
    if (!isInTable(state)) return false;
    // 如果 dispatch 存在，说明需要执行复制操作
    if (dispatch) {
        // 获取当前选中的表格区域
        const rect = selectedRect(state);
        // 调用 addDuplicateRow，传入当前事务、选区、插入位置（rect.bottom）和是否复制内容
        dispatch(addDuplicateRow(state.tr, rect, rect.bottom, withContent));
    }
    // 返回 true，表示命令已处理
    return true;
}

// 导出 duplicateRow 命令，供外部使用
export default duplicateRow;