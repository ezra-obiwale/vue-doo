const until = require('../../../object/until.js');

describe('object/until', () => {

	it('should periodically call a function until it returns true', done => {

		let i = 0;

		until(accept => {
			i++;
			if (i === 3) {
				accept(i);
			}
		}).then(resp => {
			expect(resp).to.eql(3);
			expect(i).to.eql(3);
			done();
		})
			.catch(done);

	});

});
