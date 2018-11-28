// Convert Data-URI to Blob string

const reg = /^data:([^;,]+(;charset=[^;,]+)?)(;base64)?,/i;

module.exports = dataURI => {
	const m = dataURI.match(reg);
	if (!m) {
		return dataURI;
	}

	const binary = atob(dataURI.replace(reg, ''));
	const len = binary.length;
	const arr = new Uint8Array(len);

	for (let i = 0; i < len; i++) {
		arr[i] = binary.charCodeAt(i);
	}

	return new Blob([arr], {type: m[1]});
};
