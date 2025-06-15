export function getOccupiedTitle(key) {
  const options = {
    owned: "تملیکی",
    rented: "استیجاری",
    borrowed: "امانی",
    ownedByEmployer: "تحویلی از کارفرما",
  };

  return options[key] ? options[key] : "-";
}
