import { PLUGIN_NAME } from "./info.js";

function objectMap(obj, callback) {
	return Object.keys(obj).map(prop => {
		return callback(obj[prop], prop, obj);
	});
}

function objectToMap(obj) {
	const tmpMap = new Map();
	objectMap(obj, (val, key) => {
		tmpMap.set(key, val);
	});
	return tmpMap;
}

export function concatMap({
	data,
	mapAnimations = new Map(),
	checkDuplications = true
}) {
	return (Array.isArray(data) ? data : [data])
		.map(objectToMap)
		.reduce((all, animMap) => {
			if (checkDuplications) {
				for (const key of animMap.keys()) {
					if (all.has(key)) {
						console.warn(`[${PLUGIN_NAME}]: Duplicate animation name: ${key}`);
					}
				}
			}

			return new Map([...animMap].concat([...all]));
		}, mapAnimations);
}
