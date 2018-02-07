console.log( 'lib' )
import {
	add
} from './utils'
export function init() {
	let btn = document.createElement( 'button' )
	btn.className = 'btn'
	btn.innerHTML = add( 1, 2, 3 )
	document.querySelectorAll( 'body' )[ 0 ].appendChild( btn )
}