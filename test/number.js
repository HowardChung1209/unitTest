btns = {};


function init()
{
	current = 0;
	operand = [];
	operator = [];
	latestOp = false;
	lastOpnd = 0;
	lastOptr = '';
	currSys = 'dec';

    $('.btn-mark').click(function() {
        let id = $(this).prop('id');
        console.log(id);
        if( '+-x%'.indexOf(id) >= 0 || id === 'Mod' ){
            //if prev is empty: add a 0 first
            //if prev is operator: cover it
            //if prev is number: store it
            if( operator.length > 0 && latestOp === true ){
                operator[operator.length-1] = id;
                latestOp = true;
            }
            else {
                latestOp = true;
                //check precedence
                while( operator.length > 0 && precedence(id, operator[operator.length-1]) ) {
                    //compute until id > top
                    let top = operator[operator.length-1];
                    let opnd = operand[operand.length-1];
                    operator.pop();
                    operand.pop();
                    if (top === '+') current = current + opnd;
                    if (top === '-') current = opnd - current;
                    if (top === 'x') current = current * opnd;
                    if (top === '%') current = parseInt(opnd / current);
                    if (top === 'Mod') current = opnd % current;
                    /*if(current > 32767 || current < -32768){
                        alert('The answer is overflow! Please use AC to clear and re-compute.');
                        return false;
                    }*/
                    //if(current > 0x7FFF) current = current - 0xFFFF - 1;
                    //if(current < -32768) current = current - 0xFFFF - 1;
                    current = current & 0xFFFF;
                    if(current > 0x7FFF) current = current - 0xFFFF - 1;
                    display(current);
                }
                operand.push(current);
                operator.push(id);
            }
        }
        if( id === 'CE' ){
            //only clear the latest key-in number (set as 0 at first, then can type other to cover)
            current = 0;
            display(current);
        }
        if( id === 'C' ){
            //clear stack and value
            current = 0;
            operand = [];
            operator = [];
            latestOp = false;
            lastOpnd = 0;
            lastOptr = '';
            display(current);
        }
        if( id === '←' ){
            if(latestOp === true || current.toString(convertSys[currSys]).length === 0) alert('Cant backtrack now!');
            else {
                let tmp = (current<0? 0xFFFF + current + 1 :current).toString(convertSys[currSys]);
                console.log(tmp);
                if(tmp.length === 1) current = 0;
                else current = parseInt(tmp.toString(convertSys[currSys]).substr(0,tmp.length-1), convertSys[currSys]);
                display(current);
            }
        }
        if(id === '='){
            latestOp = true;
            //start to compute
            //or repeat the latest oprate
            if ( operator.length === 0 ){
                console.log(lastOptr);
                console.log(lastOpnd);
                if (lastOptr === '+') current = current + lastOpnd;
                if (lastOptr === '-') current = current - lastOpnd;
                if (lastOptr === 'x') current = current * lastOpnd;
                if (lastOptr === '%') current = parseInt(current / lastOpnd);
                if (lastOptr === 'Mod') current = current % lastOpnd;
                /*if(current > 32767 || current < -32768){
                    alert('The answer is overflow! Please use AC to clean and re-compute.');
                    return false;
                }
                else*/
                current = current & 0xFFFF;
                if(current > 0x7FFF) current = current - 0xFFFF - 1;
                display(current);
            }
            var top, opnd;
            while( operator.length > 0 ) {
                top = operator[operator.length-1];
                opnd = operand[operand.length-1];
                operator.pop();
                operand.pop();

                lastOptr = top;
                lastOpnd = current;
                if (top === '+') current = current + opnd;
                if (top === '-') current = opnd - current;
                if (top === 'x') current = current * opnd;
                if (top === '%') current = parseInt(opnd / current);
                if (top === 'Mod') current = opnd % current;

                current = current & 0xFFFF;
                if(current > 0x7FFF) current = current - 0xFFFF - 1;
                display(current);
            }
        }
        if(id === '±'){
            //turn latest operand upside down
            current = -current;
            display(current);
        }
        return false;
    });
    $('.btn-normal').click(function() {
        let id = $(this).prop('id');
        console.log(id);

        if( '1234567890ABCDEF'.indexOf(id) >= 0 ){
            if( latestOp ) {
                current = 0;
                latestOp = false;
            }
            let tmp;
            if(current < 0) tmp = current * convertSys[currSys] - parseInt(id, convertSys[currSys]);
            else tmp = current * convertSys[currSys] + parseInt(id, convertSys[currSys]);
            console.log(tmp & 0xFFFF0000);
            if((currSys !== 'dec' && tmp & 0xFFFF0000) || (currSys === 'dec' && tmp > 32767 || tmp < -32768)){
                alert('You cannot type more!');
                return false;
            }

            current = tmp;
            if(current > 0x7FFF) current = current - 0xFFFF -1;
            display(current);
        }
        return false;
    });
    $('.convert-normal').click(function() {
        $(this).attr('disabled', true);
        $('#'+currSys).attr('disabled', false);
        currSys = $(this).attr('id');
        for(let i = 0; i < 16; i++){
            console.log(i.toString().toUpperCase(16));
            if( i < convertSys[currSys] ) $('.btn-normal#'+i.toString(16).toUpperCase()).attr('disabled', false);
            else $('.btn-normal#'+i.toString(16).toUpperCase()).attr('disabled', true);
        }
        display(current);
    });

    all_btns = $("button");

    for(var i = 0; i < all_btns.length; i++)
        btns[all_btns[i].id] = all_btns[i];
}

function input(inp,assert)
{
	arr = inp.split(",")
    for(var i = 0; i < arr.length; i++)
        btns[arr[i]].click();
}

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

