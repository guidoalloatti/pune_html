/**
 * Created by JetBrains PhpStorm.
 * User: guido
 * Date: 8/12/11
 * Time: 3:26 PM
 * To change this template use File | Settings | File Templates.
 */

function getPlayingWorms()
{
	playingWorms = {
		'red'	: true,
		'blue'	: true,
		'green'	: true,
		'purple': true,
		'cyan'	: true,
		'yellow': true
	};
	return playingWorms;
}

/**
 * Setup for all the worms
 * @param color
 */
function setupWorms()
{
	var playingWorms = getPlayingWorms();

	$.each(playingWorms, function(key, value){
		if(value)
		console.log(key, value);
	});

}