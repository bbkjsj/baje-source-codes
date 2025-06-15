import { useHistory, useLocation } from "react-router";

export function useAppendLocationState(key) {
  if (!key) throw new Error("key cannot be null or empty value");

  const history = useHistory();
  const location = useLocation();
  const currentLocationState = history.location.state;

  const appendStateItemValue = (value) => {
    const newLocationState = { ...currentLocationState };

    newLocationState[key] = value;
    history.push(
      location.search
        ? history.location.pathname + location.search
        : history.location.pathname,
      newLocationState
    );
  };

  const stateItemValue = history.location.state && history.location.state[key];

  return [stateItemValue, appendStateItemValue];
}

export default useAppendLocationState;
