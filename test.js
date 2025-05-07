const email = require('./app/lib/mail');
const test = async () => {
	await email.invite('mhamzasakhi@gmail.com', {
		user: {
			name: 'Muhammad',
			surname: "Hamza"
		},
		sender: {
			pharmacyName: 'Top pharmacy',
		},
		link: 'http://qwe.asd.com',
	});
	console.log('Muhammad Hamza Mewatti');
};

test();
