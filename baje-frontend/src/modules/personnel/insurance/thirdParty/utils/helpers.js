import { alphabetList } from "modules/machinery/MachineList/columns";

export function arePlaquesEqual(plk, machine) {
  const plaques = extractPlaqueFromText(plk.trim().replace(/\s/g, ""));
  if (plaques) {
    if (
      plaques.plaque1 == machine?.plaque1 &&
      plaques.plaque2 == machine?.plaque2 &&
      plaques.plaque3 == machine?.plaque3 &&
      plaques.plaque4 == machine?.plaque4
    ) {
      return true;
    }
  }
  return false;
}

export function extractPlaqueFromText(toUpdate) {
  if (toUpdate.length === 9) {
    const plaque1 = toUpdate[7] + toUpdate[8];
    let plaque2 = toUpdate[6];
    const findPlaque2 = alphabetList.find((i) => i.label === plaque2);
    const plaque3 = toUpdate[3] + toUpdate[4] + toUpdate[5];
    const plaque4 = toUpdate[0] + toUpdate[1];

    if (findPlaque2) {
      plaque2 = findPlaque2.value;

      return { plaque1, plaque2, plaque3, plaque4 };
    }
    return;
  }
}

export function matchCompanyIds(insuranceId) {
  const matchIds = {
    15: 207,
    16: 206,
  };

  return matchIds[insuranceId] || insuranceId;
}
