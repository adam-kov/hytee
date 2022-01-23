export const pascalToCamel = (
	objects: Record<number | string, any>[],
	removeFields?: string[],
): Record<number | string, unknown>[] => {
	objects = [...objects];

	for (let i = 0; i < objects.length; i++) {
		if (removeFields?.length) {
			for (const field of removeFields) {
				delete objects[i][field];
			}
		}

		const object: Record<string, unknown> = {};
		for (const key of Object.keys(objects[i])) {
			if (typeof objects[i][key] === 'object' && objects[i][key] !== null) {
				if (Array.isArray(objects[i][key])) {
					// It is assumed that an array will have elements with the same structure
					// so if the first element is not an object then it won't iterate through
					// the whole array.
					if (typeof objects[i][key][0] === 'object') {
						for (let j = 0; j < objects[i][key].length; j++) {
							objects[i][key] = pascalToCamel(objects[i][key]);
						}
					}
				} else {
					objects[i][key] = pascalToCamel([objects[i][key]])[0];
				}
			}
			object[key.replace(key[0], key[0].toLowerCase())] = objects[i][key];
		}
		objects[i] = object;
	}
	return objects;
};

export const convertMapping = {
	pascalToCamel,
};
