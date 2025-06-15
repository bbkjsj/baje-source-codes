import { createContext, useContext } from "react";

export const tableColumnActions = {
  setInitialState: "setInitialState",
  toggleAddOrEditmodal: "toggleAddOrEditmodal",
  setTableColumns: "setTableColumns",
};

export const tableColumnInitialState = {
  tableColumns: [],
  loading: true,
  tableName: {},
  tableDbColumns: [],
  addOrEditModal: false,
  selectedTableColumn: null,
};

/**
 *
 * @param {object} action - action object
 * @param {string} action.type
 * @param {any} action.payload
 * @returns
 */
export const tableColumnrRducer = (state = tableColumnInitialState, action) => {
  switch (action.type) {
    case tableColumnActions.setInitialState:
      return { ...state, loading: false, ...action.payload };

    case tableColumnActions.toggleAddOrEditmodal:
      return {
        ...state,
        addOrEditModal: !state.addOrEditModal,
        selectedTableColumn: action.payload,
      };

    case tableColumnActions.setTableColumns:
      return { ...state, tableColumns: action.payload, addOrEditModal: false };

    default:
      return state;
  }
};

export const TableColumnContext = createContext({
  state: tableColumnInitialState,
  dispatch: ({ type, payload }) => {},
});

export const useTableColumnContext = () => useContext(TableColumnContext);
