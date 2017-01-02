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

    btns["CLS"] = $("#C[class=btn-mark]");
}

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