export class ResponseDto {
  static format(trace: string, data: any, total: number = null) {
    if (total || total === 0) {
      return { trace, payload: { data, total } };
    }
    return { trace, payload: { data } };
  }
}
