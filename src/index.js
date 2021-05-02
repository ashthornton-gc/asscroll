import Events from './Events'
import Controller from './Controller'
import E from './E'

/**
* Ash's Smooth Scroll 🍑
*/
class ASScroll {
	/**
	* Creates an ASScroll instance
	*
	* @example
	* ```js
	* const asscroll = new ASScroll({
	* containerElement: '.page-container',
	* scrollElements: '.my-page'
	* })
	* ```
	*
	* @typicalname asscroll
	* @param {object} [parameters]
	* @param {string|HTMLElement} [parameters.containerElement=.asscroll-container] The selector string for the outer container element, or the element itself
	* @param {string|HTMLElement|NodeList} [parameters.scrollElements=[data-asscroll]] The selector string for the elements to scroll, or the elements themselves
	* @param {number} [parameters.ease=0.075] The ease amount for the transform lerp
	* @param {number} [parameters.touchEase=1] The ease amount for the transform lerp on touch devices
	* @param {string} [parameters.touchScrollType=none] Set the scrolling method on touch devices. Other options are 'transform' and 'scrollTop'
	* @param {string} [parameters.scrollbarEl=.asscrollbar] The selector string for the custom scrollbar element
	* @param {string} [parameters.scrollbarHandleEl=.asscrollbar__handle] The selector string for the custom scrollbar handle element
	* @param {boolean} [parameters.customScrollbar=true] Toggle the custom scrollbar
	* @param {boolean} [parameters.scrollbarStyles=true] Include the scrollbar CSS via Javascript
	* @param {boolean} [parameters.disableNativeScrollbar=true] Disable the native browser scrollbar
	* @param {boolean} [parameters.disableRaf=false] Disable internal requestAnimationFrame loop in order to use an external one
	* @param {boolean} [parameters.disableResize=false] Disable internal resize event on the window in order to use an external one
	* @param {boolean} [parameters.limitLerpRate=true] Match lerp speed on >60Hz displays to that of a 60Hz display
	* @param {string} [parameters.blockScrollClass=.asscroll-block] The class to add to elements that should block ASScroll when hovered
	*/
	constructor({
		containerElement = '.asscroll-container',
		scrollElements = '[data-asscroll]',
		ease = 0.075,
		touchEase = 1,
		touchScrollType = 'none',
		scrollbarEl = '.asscrollbar',
		scrollbarHandleEl = '.asscrollbar__handle',
		customScrollbar = true,
		scrollbarStyles = true,
		disableNativeScrollbar = true,
		disableRaf = false,
		disableResize = false,
		limitLerpRate = true,
		blockScrollClass = '.asscroll-block'
	} = {}) {
		this.events = new Events({
			disableRaf,
			disableResize
		})

		this.controller = new Controller({
			containerElement,
			scrollElements,
			ease,
			touchEase,
			customScrollbar,
			scrollbarEl,
			scrollbarHandleEl,
			scrollbarStyles,
			disableNativeScrollbar,
			touchScrollType,
			limitLerpRate,
			blockScrollClass
		})
	}

	/**
	* Enable ASScroll.
	*
	* @example <caption>Enables ASScroll on the '.page' element and resets the scroll position to 0</caption>
	* asscroll.enable({ newScrollElements: document.querySelector('.page'), reset: true })
	*
	* @example <caption>Enables ASScroll and restores to the previous position before ASScroll.disable() was called</caption>
	* asscroll.enable({ restore: true })
	*
	* @param {object} [parameters]
	* @param {boolean|NodeList|HTMLElement} [parameters.newScrollElements=false] Specify the new element(s) that should be scrolled
	* @param {boolean} [parameters.reset=false] Reset the scroll position to 0
	* @param {boolean} [parameters.restore=false] Restore the scroll position to where it was when disable() was called
	* @param {boolean} [parameters.horizontalScroll=false] Toggle horizontal scrolling
	*/
	enable(parameters) {
		if (parameters !== undefined && typeof parameters !== 'object') {
			console.warn('ASScroll: Please pass an object with your parameters. Since 2.0')
		}
		this.controller.enable(parameters)
	}

	/**
	* Disable ASScroll.
	*
	* @example <caption>Disables the ability to manually scroll whilst still allowing position updates to be made via asscroll.currentScrollPos, for example</caption>
	* asscroll.disable({ inputOnly: true })
	*
	* @param {object} parameters
	* @param {boolean} [parameters.inputOnly=false] Only disable the ability to manually scroll (still allow transforms)
	*/
	disable(parameters) {
		if (parameters !== undefined && typeof parameters !== 'object') {
			console.warn('ASScroll: Please pass an object with your parameters. Since 2.0')
		}
		this.controller.disable(parameters)
	}

	/**
	* Call the internal animation frame request callback.
	* @function
	*/
	update = () => {
		this.events.onRaf()
	}

	/**
	* Call the internal resize callback.
	* @function
	* @param {object} [parameters]
	* @param {number} [parameters.width] Window width
	* @param {number} [parameters.height] Window height
	*/
	resize = (parameters) => {
		this.events.onResize(parameters)
	}

	/**
	* Add an event listener.
	*
	* @example <caption>Logs out the scroll position when the 'scroll' event is fired</caption>
	* asscroll.on('scroll', scrollPos => console.log(scrollPos))
	*
	* @example <caption>Returns the target scroll position and current scroll position during the internal update loop</caption>
	* asscroll.on('update', ({ targetScrollPos, currentScrollPos }) => console.log(targetScrollPos, currentScrollPos))
	*
	* @example <caption>Fires when the lerped scroll position has reached the target position</caption>
	* asscroll.on('scrollEnd', scrollPos => console.log(scrollPos))
	*
	* @param {string} eventName Name of the event you wish to listen for
	* @param {function} callback Callback function that should be executed when the event fires
	*/
	on(eventName, callback) {
		if (typeof callback !== 'function') {
			console.error('ASScroll: Function not provided as second parameter')
			return
		}

		if (eventName === 'scroll') {
			E.on(Events.EXTERNALSCROLL, callback)
			return
		}

		if (eventName === 'update') {
			E.on(Events.EXTERNALRAF, callback)
			return
		}

		if (eventName === 'scrollEnd') {
			E.on(Events.SCROLLEND, callback)
			return
		}

		console.warn(`ASScroll: "${eventName}" is not a valid event`)
	}

	/**
	* Remove an event listener.
	* @param {string} eventName Name of the event
	* @param {function} callback Callback function
	*/
	off(eventName, callback) {
		if (typeof callback !== 'function') {
			console.error('ASScroll: Function not provided as second parameter')
			return
		}

		if (eventName === 'scroll') {
			E.off(Events.EXTERNALSCROLL, callback)
			return
		}

		if (eventName === 'update') {
			E.off(Events.EXTERNALRAF, callback)
			return
		}

		if (eventName === 'scrollEnd') {
			E.off(Events.SCROLLEND, callback)
			return
		}

		console.warn(`ASScroll: "${eventName}" is not a valid event`)
	}

	/**
	* Scroll to a given position on the page.
	* @param {number} targetScrollPos Scroll position
	* @param {boolean} [emitEvent=true] Whether to emit the external scroll events or not
	*/
	scrollTo(targetScrollPos, emitEvent = true) {
		this.controller.scrollTo(-targetScrollPos, emitEvent)
	}

	/**
	* Returns the target scroll position.
	*
	* @return {number} Target scroll position
	*/
	get targetScrollPos() {
		return -this.controller.targetScrollPos
	}

	/**
	* Gets or sets the current scroll position.
	*
	* @example <caption>Sets the scroll position to 200, bypassing any lerps</caption>
	* asscroll.currentScrollPos = 200
	*
	* @param {number} scrollPos The desired scroll position
	* @return {number} Current scroll position
	*/
	get currentScrollPos() {
		return -this.controller.currentScrollPos
	}

	set currentScrollPos(scrollPos) {
		this.controller.targetScrollPos = this.controller.currentScrollPos = -scrollPos
	}

	/**
	* Returns the maximum scroll height of the page.
	* @return {number} Maxmium scroll height
	*/
	get maxScroll() {
		return -this.controller.maxScroll
	}

	/**
	 * Returns the outer element that ASScroll is attached to.
	 * @return {HTMLElement} The outer element
	 */
	get containerElement() {
		return this.controller.containerElement
	}

	/**
	 * Returns the the element(s) that ASScroll is scrolling.
	 * @return {Array} An array of elements ASScroll is scrolling
	 */
	get scrollElements() {
		return this.controller.scrollElements
	}
}

export default ASScroll