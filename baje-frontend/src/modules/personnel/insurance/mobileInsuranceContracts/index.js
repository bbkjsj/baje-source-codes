import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";
import ContractsList from "./ContractsList";
import AddPeopleList from "./AddPeopleList";
import ViewPeopleList from "./ViewPeopleList";
import SubordinateAdd from "./SubordinateAdd";
import SubordinateEdit from "./SubordinateEdit";
import SubordinateAddNew from "./SubordinateAddNew";
import SubordinateEditNew from "./SubordinateEditNew";

const route = () => {
  return [
    <Route
      exact
      path={pageNames.personnel.insurance.supplymentary.contracts.list}
      component={ContractsList}
    />,
    <Route
      exact
      path={pageNames.personnel.insurance.supplymentary.contracts.view}
      component={ViewPeopleList}
    />,

    <Route
      exact
      path={pageNames.personnel.insurance.supplymentary.contracts.add}
      component={AddPeopleList}
    ></Route>,
    <Route
      exact
      path={
        pageNames.personnel.insurance.supplymentary.contracts.subordinate.add
      }
      component={SubordinateAdd}
    />,
    <Route
      exact
      path={
        pageNames.personnel.insurance.supplymentary.contracts.subordinate.edit
      }
      component={SubordinateEdit}
    ></Route>,
    <Route
      exact
      path={
        pageNames.personnel.insurance.supplymentary.contracts.subordinate.addNew
      }
      component={SubordinateAddNew}
    />,
    <Route
      exact
      path={
        pageNames.personnel.insurance.supplymentary.contracts.subordinate
          .editNew
      }
      component={SubordinateEditNew}
    ></Route>,
  ];
};

export default {
  route,
};
