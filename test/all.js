$.getScript("../caculator.js", function(){});

function input(inp,assert)
{
    arr = inp.split(",")
    for(var i = 0; i < arr.length; i++)
        btns[arr[i]].click();
}


QUnit.module('operator test 1', {beforeEach:init});

QUnit.test( "plus", function( assert ) {
    input("1,+,2,=",assert);
    assert.ok( 3 == $("#main").text(), "Passed!" );
});

QUnit.test( "times", function( assert ) {
    input("4,x,3,=",assert);
    assert.ok( 12 == $("#main").text(), "Passed!" );
});

QUnit.test( "sub^2", function( assert ) {
    input("1,-,1,±,=",assert);
    assert.ok( 2 == $("#main").text(), "Passed!" );
});

QUnit.test( "mod", function( assert ) {
    input("8,Mod,3,=",assert);
    assert.ok( 2 == $("#main").text(), "Passed!" );
});

QUnit.test( "back", function( assert ) {
    input("1,+,3,4,5,←,←,←,1,=",assert);
    assert.ok( 2 == $("#main").text(), "Passed!" );
});

QUnit.test( "mix 1", function( assert ) {
    input("3,+,4,-,5,+,6,=",assert);
    assert.ok( 8 == $("#main").text(), "Passed!" );
});

QUnit.test( "mix 2", function( assert ) {
    input("5,+,3,x,2,=",assert);
    assert.ok( 11 == $("#main").text(), "Passed!" );
});

QUnit.test( "mix 3", function( assert ) {
    input("1,2,3,x,3,2,1,-,1,2,3,x,3,2,1,=",assert);
    assert.ok( 0 == $("#main").text(), "Passed!" );
});

QUnit.test( "float", function( assert ) {
    input("3,%,2,+,3,%,2,=",assert);
    assert.ok( 2 == $("#main").text(), "Passed!" );
});

QUnit.test( "continous", function( assert ) {
    input("1,2,%,2,x,3,%,2,%,3,x,2,=",assert);
    assert.ok( 6 == $("#main").text(), "Passed!" );
});

QUnit.test( "clear 1", function( assert ) {
    input("1,2,3,+,4,5,6,CE,-,2,+,1,=",assert);
    assert.ok( 122 == $("#main").text(), "Passed!" );
});

QUnit.test( "clear 2", function( assert ) {
    input("1,2,3,+,1,2,3,x,3,4,5,CE,1,±,+,1,=",assert);
    assert.ok( 1 == $("#main").text(), "Passed!" );
});

QUnit.test( "clear 3", function( assert ) {
    input("1,2,3,+,1,2,3,x,3,4,5,CLS,1,±,+,1,=",assert);
    assert.ok( 0 == $("#main").text(), "Passed!" );
});

QUnit.test( "equals", function( assert ) {

    input("3,4,+,5,=,=,=");
    assert.ok( 49 == $("#main").text(), "Passed" );

} );


QUnit.module('number test', {beforeEach:init});

QUnit.test( "positive number", function( assert ) {
	input("1,2,3",assert);
	assert.ok( 123 == $("#main").text(), "Passed!" );
});

QUnit.test( "negative number", function( assert ) {
	input("9,8,7,±",assert);
	assert.ok( "-987" == $("#main").text(), "Passed!" );
});

QUnit.test( "negative^2", function( assert ) {
    input("9,8,7,±,±",assert);
    assert.ok( "987" == $("#main").text(), "Passed!" );
});

QUnit.test( "default number", function( assert ) {
    input("+,+,1",assert);
    assert.ok( "1" == $("#main").text(), "Passed!" );
});


QUnit.test( "hex number", function( assert ) {
	input("hex,A,F,1",assert);
	assert.ok( "AF1" == $("#main").text(), "Passed!" );
});

QUnit.test( "oct number", function( assert ) {
	input("oct,1,0,1",assert);
	assert.ok( "101" == $("#main").text(), "Passed!" );
});

QUnit.test( "bin number", function( assert ) {
    input("bin,1,0,1",assert);
    assert.ok( "101" == $("#main").text(), "Passed!" );
});

QUnit.test( "change base 1", function( assert ) {
	input("bin,1,0,1,dec",assert);
	assert.ok( "5" == $("#main").text(), "Passed!" );
});

QUnit.test( "change base 2", function( assert ) {
    input("hex,F,F,F,F,+,1,=,dec",assert);
    assert.ok( "0" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 1", function( assert ) {
    input("bin,1,2,3,4,5,6,7,8,9,0,A,B,C,D,E,F",assert);
    assert.ok( "10" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 2", function( assert ) {
    input("oct,1,2,3,4,5",assert);
    assert.ok( "12345" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 3", function( assert ) {
    input("oct,6,7,8,9,0",assert);
    assert.ok( "670" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 4", function( assert ) {
    input("oct,A,B,C,D,E,F",assert);
    assert.ok( "0" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 5", function( assert ) {
    input("dec,1,3,5,7,9",assert);
    assert.ok( "13579" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 6", function( assert ) {
    input("dec,2,4,6,8,0,A,B,C,D,E,F",assert);
    assert.ok( "24680" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 7", function( assert ) {
    input("hex,1,2,3",assert);
    assert.ok( "123" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 8", function( assert ) {
    input("hex,4,5,6",assert);
    assert.ok( "456" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 9", function( assert ) {
    input("hex,7,8,9",assert);
    assert.ok( "789" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 10", function( assert ) {
    input("hex,A,B,C",assert);
    assert.ok( "ABC" == $("#main").text(), "Passed!" );
});

QUnit.test( "base constrain 11", function( assert ) {
    input("hex,D,E,F,0",assert);
    assert.ok( "DEF0" == $("#main").text(), "Passed!" );
});

QUnit.test( "huge number", function( assert ) {
    input("hex,A,B,C,D,E,F",assert);
    assert.ok( "ABCD" == $("#main").text(), "Passed!" );
});