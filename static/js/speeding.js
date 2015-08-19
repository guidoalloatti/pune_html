// This function do the real speeding
function doSpeeding() {
	playSound("speeding")
	speed += speedingIncrementSpeed
	changeInterval(speed)
	addMessage(speed/5, "speed")
}

// This function do the real speeding reduce
function reduceSpeeding() {
	playSound("ohh")
	speed -= speedingIncrementSpeed
	changeInterval(speed)
	addMessage(speed/5, "speed")
}

// This function evaluates and if random numbers matchs speeds
function speeding() {
	random_1 = Math.floor(Math.random()*(speedingChance+speed))
	random_2 = (speedingChance+speed) - Math.floor(Math.random()*(speedingChance+speed))
	if(random_1 == random_2 && !onPause) doSpeeding()
}