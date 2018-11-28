// Was the current event userInitiated?
module.exports = (e = window.event) => {
	if (!e || typeof e !== 'object') {
		return false;
	}
	return !!('which' in e ? e.which : 'button' in e);
};
