export function cloneProp(object, resultObj) {
	const hasProp = {}.hasOwnProperty;
	let value;

	for (const key in object) {
		if (!hasProp.call(object, key)) {
			continue;
		}
		value = object[key];
		if (!resultObj[key]) {
			resultObj[key] = value;
		} else {
			console.warn(`[postcss-animations]: Duplicate animation name: ${key}`);
		}
	}
}

export function groupKeys(arrKeyframes, obj) {
	obj = obj || {};

	if (Array.isArray(arrKeyframes)) {
		for (let i = 0, len = arrKeyframes.length; i < len; i++) {
			cloneProp(arrKeyframes[i], obj);
		}
	} else if (typeof arrKeyframes === 'object') {
		cloneProp(arrKeyframes, obj);
	} else {
		console.log('[postcss-animations]: Error: Not suported type!');
	}

	return obj;
}
