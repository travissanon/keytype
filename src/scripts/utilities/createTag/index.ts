const createTag = (tag: string, val: any, key: number | null = null) => {
	const keyTag = key ? `key="${key}"` : "";

	return `<${tag} ${keyTag}>${val}</${tag}>`;
};

export default createTag;
