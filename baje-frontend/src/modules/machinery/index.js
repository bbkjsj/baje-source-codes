//use older implementation until refactor
import MachineView from "pages/machinery/machine/view/MachineView";
import AddMachineryType from "pages/machinery/type/AddMachineryType";
import MachineryList from "pages/machinery/machine/list/MachineList";
import AddMachinerySystem from "pages/machinery/system/AddMachinerySystem";
import AddMachineryTip from "pages/machinery/tip/AddMachineryTip";
import AddMachine from "pages/machinery/machine/add/addMachine";
import EditMachine from "pages/machinery/machine/edit/EditMachine";
import AddGroupMachine from "pages/machinery/machine/addGroup/AddGroupMachine";
import { pageNames } from "constant";

const routing = {
  root: "/management/machinery",
  routes: {
    MACHINERY_MACHINE_ADD: {
      path: pageNames.machinery.add,
      component: AddMachine,
    },
    MACHINERY_MACHINE_EDIT: {
      path: pageNames.machinery.edit,
      component: EditMachine,
    },
    MACHINERY_MACHINE_VIEW: {
      path: pageNames.machinery.view,
      component: MachineView,
    },
    MACHINERY_MACHINE_LIST: {
      path: pageNames.machinery.list,
      component: MachineryList,
    },
    MACHINERY_MACHINE_GROUP_ADD: {
      path: pageNames.machinery.addGroup,
      component: AddGroupMachine,
    },
    MACHINERY_TYPE_ADD: {
      path: pageNames.machinery.addType,
      component: AddMachineryType,
    },
    MACHINERY_SYSTEM_ADD: {
      path: pageNames.machinery.addSystem,
      component: AddMachinerySystem,
    },
    MACHINERY_TIP_ADD: {
      path: pageNames.machinery.addTip,
      component: AddMachineryTip,
    },
  },
};

export default {
  routing,
};
