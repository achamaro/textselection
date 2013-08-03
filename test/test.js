(function() {

var $textarea = $('<textarea/>').appendTo('body');

module('textSelection', {

	setup: function() {
		$textarea.val(
			"abcde\nあいうえお"
		);
	}
});

test( 'get', function() {
	$textarea.textSelection('select', 0, 5);
	equal( $textarea.textSelection(), 'abcde' );
	
	$textarea.textSelection('select', 3, 7);
	equal( $textarea.textSelection(), "de\nあ" );
});

test( 'replace', function() {
	$textarea.textSelection('select', 3, 7);
	$textarea.textSelection('replace', '#rep#');
	equal( $textarea.val(), "abc#rep#いうえお" );
});

test( 'replace reg', function() {
	$textarea.textSelection('select', 3, 7);
	$textarea.textSelection('replace', /\n/, '');
	equal( $textarea.val(), "abcdeあいうえお" );
});

test( 'prepend', function() {
	$textarea.textSelection('select', 3, 7);
	$textarea.textSelection('prepend', '#prepend#');
	equal( $textarea.val(), "abc#prepend#de\nあいうえお" );
});

test( 'append', function() {
	$textarea.textSelection('select', 3, 7);
	$textarea.textSelection('append', '#append#');
	equal( $textarea.val(), "abcde\nあ#append#いうえお" );
});

test( 'wrap', function() {
	$textarea.textSelection('select', 3, 7);
	$textarea.textSelection('wrap', '#prepend#', '#append#');
	equal( $textarea.val(), "abc#prepend#de\nあ#append#いうえお" );
});

})();
