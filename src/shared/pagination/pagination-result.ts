export class PaginateResult {
  constructor() {}

  async getResult(result: any) {
    return result[0].data;
    try {
    } catch (error) {}
  }

  async getTotalResults(result: any) {
    try {
      return result[0].metadata[0].total;
    } catch (error) {}
  }
}
