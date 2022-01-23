import { convertMapping } from './case-convert';
import { HyteeSettings, RequestMethod } from './models';
import type { HyteeDefaultSettings } from './models';

export default class Hytee {
	private static _defaultSettings: HyteeDefaultSettings;
	private static _temporarySettings: HyteeDefaultSettings | undefined;
	private static _isTemporary: boolean;

	static get settings(): HyteeDefaultSettings {
		return Hytee._isTemporary && Hytee._temporarySettings ? Hytee._temporarySettings : Hytee._defaultSettings;
	}
	private static set settings(settings: HyteeDefaultSettings) {
		Hytee._isTemporary
			? (Hytee._temporarySettings = { ...settings })
			: (Hytee._defaultSettings = { ...settings });
	}

	static initialize(settings: HyteeDefaultSettings): Hytee {
		Hytee._defaultSettings = { ...settings };
		return this;
	}

	/** Switch to `default` settings. */
	static default(): Hytee {
		Hytee._isTemporary = false;
		return this;
	}

	/** Switch to `temporary` settings.
	 * 	Every change to the settings will be temporary
	 * 	and will only be saved until the first request is sent.
	 */
	static temporary(): Hytee {
		Hytee._isTemporary = true;
		return this;
	}

	/** Set the currently selected settings (`temporary` or `default`). */
	static setSettings(settings: HyteeDefaultSettings): Hytee {
		Hytee.settings = { ...settings };
		return this;
	}

	/** Set the token on the currently selected settings (`temporary` or `default`). */
	static setToken(token: string): Hytee {
		Hytee.settings = { ...Hytee.settings, token };
		return this;
	}

	private static _checkSettings(): boolean {
		if (!Hytee._defaultSettings.url) {
			throw Error(
				'Default settings must be set before sending requests. Use the "Hytee.initialize()" method',
			);
		}
		return true;
	}

	private static _removeTemporary(): void {
		Hytee._temporarySettings = undefined;
		Hytee._isTemporary = false;
	}

	/** Send a `GET` request. */
	static async get(path: string, settings?: HyteeSettings): Promise<any> {
		Hytee._checkSettings();
		settings = { ...Hytee.settings, ...settings };

		return Hytee._result(fetch(settings.url + path, Hytee._request(settings)), settings);
	}

	/** Send a `POST` request. */
	static async post(path: string, body?: any, settings?: HyteeSettings): Promise<any> {
		Hytee._checkSettings();
		settings = { ...Hytee.settings, ...settings };

		return Hytee._result(
			fetch(settings.url + path, Hytee._request(settings, RequestMethod.post, body)),
			settings,
		);
	}

	/** Send a `PUT` request. */
	static async put(path: string, body?: any, settings?: HyteeSettings): Promise<any> {
		Hytee._checkSettings();
		settings = { ...Hytee.settings, ...settings };

		return Hytee._result(
			fetch(settings.url + path, Hytee._request(settings, RequestMethod.put, body)),
			settings,
		);
	}

	/** Send a `DELETE` request. */
	static async delete(path: string, settings?: HyteeSettings): Promise<any> {
		Hytee._checkSettings();
		settings = { ...Hytee.settings, ...settings };

		return Hytee._result(
			fetch(settings.url + path, Hytee._request(settings, RequestMethod.delete)),
			settings,
		);
	}

	/** Construct a HTTP request for the Fetch API. */
	private static _request(
		settings: HyteeSettings,
		method: RequestMethod = RequestMethod.get,
		body?: any,
	): RequestInit {
		if (body !== undefined && body !== null) body = JSON.stringify(body);

		const getSetting = (name: keyof HyteeSettings): string => {
			return `${settings[name] || Hytee.settings[name]}`;
		};
		const headers = new Headers();
		const values = {
			'Content-Type': getSetting('contentType'),
			Authorization: getSetting('token') ? 'Bearer ' + getSetting('token') : '',
		};
		for (const value of Object.entries(values)) {
			if (value[1]) {
				headers.append(value[0], value[1]);
			}
		}

		const request: RequestInit = {
			method,
			mode: 'cors',
			headers,
		};
		if (body) request.body = body;

		Hytee._removeTemporary();
		return request;
	}

	/** Construct the response from an HTTP request. */
	private static _result(promise: Promise<Response>, settings: HyteeSettings): Promise<any> {
		return promise.then(async res => {
			if (res.status >= 400) throw await res.json();

			if (res && settings.parseResult) {
				const json = await res.json();
				if (settings.caseConvert) {
					return Array.isArray(json)
						? convertMapping[settings.caseConvert](json)
						: convertMapping[settings.caseConvert]([json])[0];
				}
				return json;
			}
			return res;
		});
		// .catch(err => {
		// 	console.log(err);
		// 	if (err.status >= 500 || !err.status) {
		// 		Alert.error(get(t).alert.error.server);
		// 	}
		// 	throw err;
		// });
	}
}
