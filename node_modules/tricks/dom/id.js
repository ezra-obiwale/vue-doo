// Auto Set/Get the ID of a tag element based
module.exports = tag => {

	if (tag.id) {
		return tag.id;
	}

	const text = (tag.innerText || tag.textContent || tag.innerHTML);
	const ref = text.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9_-]/g, '');

	tag.id = ref;

	return ref;
};
