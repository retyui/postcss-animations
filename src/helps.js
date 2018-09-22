import { PLUGIN_NAME } from "./info.js";

export function concatMap({
	data,
	mapAnimations = new Map(),
	checkDuplications = true
}) {
	return (Array.isArray(data) ? data : [data])
		.map(obj => new Map(Object.entries(obj)))
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
