export const parseChainData = <K>(data: K) => {
	const json: unknown = JSON.parse(
		JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? value.toString() : (value as unknown))),
	);

	return json;
};

export const isArrayOfStrings = (value: unknown, errorMessage: string): string[] => {
	const isStringArray = Array.isArray(value) && value.every(item => typeof item === 'string');

	if (!isStringArray) {
		throw new Error(errorMessage);
	}

	return value as string[];
};
