$.getScript("../caculator.js", function(){});

function input(inp,assert)
{
	arr = inp.split(",")
    for(var i = 0; i < arr.length; i++)
        btns[arr[i]].click();
}

QUnit.module('number test', {beforeEach:init});

QUnit.test( "positive number", function( assert ) {
	input("1",assert);
	assert.ok( 1 == $("#main").text(), "Passed!" );
});

QUnit.test( "positive number", function( assert ) {
    input("2",assert);
    assert.ok( 2 == $("#main").text(), "Passed!" );
});