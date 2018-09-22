import { PLUGIN_NAME } from "./info.js";

const objectEntries = Object.entries
	? Object.entries
	: require("object.entries");

export function concatMap({
	data,
	mapAnimations = new Map(),
	checkDuplications = true
}) {
	return (Array.isArray(data) ? data : [data])
		.map(obj => new Map(objectEntries(obj)))
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
