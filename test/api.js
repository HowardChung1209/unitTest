var testrunner = require("qunit");

{

	log : {
	
		assertions : true,

		error : true,

		tests : true,

		sumary : true,

		globalSummary : true,

		coverage : true,

		globalCoverage : true,

		testing : true

	},

	coverage : false,

	deps : null,

	namespace : nullm

	maxBlockDuration : 2000

}

testrunner.options.optionName = value;

testrunner.setup({
	log : {
		summary : true
	}
});

testrunner.run({
	code: "calculator.js",
	tests: "test/incmd.js"

}, callback);
