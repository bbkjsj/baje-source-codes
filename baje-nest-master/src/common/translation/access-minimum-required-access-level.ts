export class AccessMinimumRequiredAccessLevelTranslation {

  private repository: Object = {
    environment: { label: "محیط" },
    baje: { label: "باجه" },
    company: { label: "شرکت" },
  }

  translate(value: string): string {
    return this.repository[value].label;
  }
}