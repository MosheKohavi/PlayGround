/**
 * The definition of the JSON data model, as it is supposed to come from the server, with default values for the app -
 * in case some data is missing.
 */
abstract class ServerJsonData {
  protected innerValue: string = '';
  readonly id: string = '';
  name: string = '';
  time: number = Date.now();
}

/**
 * The JSON data as an interface (optional)
 */
export interface IJsonData extends ServerJsonData {}

/**
 * The app class which assign all the properties from the server
 */
export class AppClass extends ServerJsonData {

  constructor(data: IJsonData) {
    super();
    Object.assign(this, data);
    if (!this.id) {
      throw new Error('No ID!');
    }
  }

  passedTime(): number {
    return Date.now() - this.time;
  }

}
