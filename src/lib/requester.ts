import { Logger } from 'winston';
import axios from 'axios';

interface IRequesterOptions {
  queryParameters?: IRequesterQueryParameters;
  path?: string;
}

interface IRequesterQueryParameters {
  [key: string]: string;
}

/**
 * Requester class.
 * A wrapper class for an HTTP library. In case that you don't want to use Axios anymore,
 * you can replace the library in this class.
 */
export class Requester {
  private url: string;
  private path: string | undefined;
  private queryParameters: IRequesterQueryParameters;
  private log: Logger;

  constructor(url: string, options: IRequesterOptions = {}, log: Logger) {
    this.url = url;
    this.path = options.path;
    this.queryParameters = options.queryParameters || {};
    this.log = log;

    this.log.debug(`New Requester. url: "${this.url}", options: "${JSON.stringify(options)}"`);
  }

  /**
   * Get the data with the settings supplied in the constructor.
   * @returns Data from the requested URL.
   */
  public async get(): Promise<any> {
    const url = this.urlBuilder();
    this.log.debug(`Getting data from "${url}". Queryparameters: "${JSON.stringify(this.queryParameters)}"`);
    const axiosResult = await axios.get(url, {
      params: this.queryParameters,
    });
    return axiosResult.data;
  }

  /**
   * Combine URL and path properties and make sure that the forward slash will be added.
   * @returns Build up URL from property URL and path.
   */
  public urlBuilder(): string {
    let result = this.url;

    if (this.path) {
      // be sure that either the URL ends with forward slash, or the path starts with forward slash
      let slash = '';

      if (!this.url.match(/\/$/) && !this.path.match(/^\//)) {
        slash = '/';
      }
      result = `${result}${slash}${this.path}`;
    }

    return result;
  }
}