(function() {

module('textSelection no Element');

test( 'get', function() {
	equal( $('.dummy').textSelection('get'), undefined );
});

var $textarea = $('<textarea/>').appendTo('body');

module('textSelection', {

	setup: function() {
		$textarea.val(
			"abcde\nあいうえお"
		);
		$textarea.textSelection('select', 3, 7);
	}
});

test( 'get', function() {
	equal( $textarea.textSelection().replace(/\r/g, ''), "de\nあ" );
	
	$textarea.textSelection('select', 0, 5);
	equal( $textarea.textSelection(), 'abcde' );
});

test( 'replace', function() {
	$textarea.textSelection('replace', '#rep#');
	equal( $textarea.val(), "abc#rep#いうえお" );
});

test( 'replace reg', function() {
	$textarea.textSelection('replace', /\r?\n/, '');
	equal( $textarea.val(), "abcdeあいうえお" );
});

test( 'prepend', function() {
	$textarea.textSelection('prepend', '#prepend#');
	equal( $textarea.val(), "abc#prepend#de\nあいうえお" );
});

test( 'append', function() {
	$textarea.textSelection('append', '#append#');
	equal( $textarea.val(), "abcde\nあ#append#いうえお" );
});

test( 'wrap', function() {
	$textarea.textSelection('wrap', '#prepend#', '#append#');
	equal( $textarea.val(), "abc#prepend#de\nあ#append#いうえお" );
});


test( 'callbakc', function() {
	$textarea.textSelection('callback', function(range) {
		equal( range.start, 3 );
		equal( range.end , 7 );
		equal( range.text.replace(/\r/g, ''), "de\nあ" );
		
		range.setText( '#rep1#' );
		range.select();
		equal( range.text, '#rep1#');
		equal( $textarea.val(), 'abc#rep1#いうえお' );
		range.setText( range.text + '\n#rep2#' );
		equal( $textarea.val().replace(/\r/g, ''), 'abc#rep1#\n#rep2#いうえお' );
		range.select();
		equal( range.text.replace(/\r/g, ''), '#rep1#\n#rep2#' );
	});
});

$textarea2 = $textarea.add( $('<textarea/>').appendTo('body') );
module( 'textSelection Double', {
	
	setup: function() {
		$textarea2.eq(0).val( '123456789' );
		$textarea2.eq(1).val( 'abcdefghi' );
		
		$textarea2.textSelection('select', 2, 4);
	}
	
});

test( 'get all', function() {
	deepEqual( $textarea2.textSelection( true ), ['34', 'cd'] );
});

})();
