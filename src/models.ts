interface Settings {
	/** Set the default behavior for the  */
	parseResult?: boolean;
	/** Select a built in variable name casing converter.
	 * 	Converts names in nested objects and arrays as well.
	 */
	caseConvert?: CaseConverters;
	/** Set the type of the sent content.
	 *
	 * 	*eg: `'application/json'`*
	 *
	 * 	[Learn more here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
	 */
	contentType?: string;
	/** If `true`, then the request body will be converted to a JSON string. */
	stringify?: boolean;
	/** The JWT token that will be appended to the requests.
	 *
	 * 	*eg: `Authorization: Bearer [your_token]`*
	 */
	token?: string;
}

export interface HyteeDefaultSettings extends Settings {
	/** The default URL where the requests will be sent.
	 * 	This can be overwritten in every request.
	 *
	 * 	*eg: `'my-backend.com/api'`*
	 */
	url: string;
}

export interface HyteeSettings extends Settings {
	/** If not specified, the default URL will be used. */
	url?: string;
}

export enum RequestMethod {
	get = 'GET',
	post = 'POST',
	put = 'PUT',
	delete = 'DELETE',
}

export type CaseConverters = 'pascalToCamel';
