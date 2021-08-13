Meteor.startup(async () => {
	console.log("OOOOOOI")
	const fs = require('fs');

	fs.writeFileSync('/tmp/test-sync', 'Hey there!');

	const data = fs.readFileSync('/tmp/test-sync', 'utf8')
	console.log(data)


})
