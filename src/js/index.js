class FormValidation {
	constructor(selector) {
		this.form = document.querySelector(selector)
		this.inputs = [...this.form.querySelectorAll('input')]
		this.requiredInputs = [...this.form.querySelectorAll('[required]')]
		this.target = false
		this.input = false
		this.event = false
		this.keyType = false
		this.previousFocus = false
		this.timeout = false
		// this.upperCase = false
		this.setDataHelpers()
		this.bindEvents()
		this.initEvents()
	}

	mouseClick (e) {
		this.setPreviousFocus(e)
		this.input = e.target
		this.target = e.target.closest('div')
		this.event = 'click'
		this.moveLabel()
		this.setActive()
		this.validateInput()
	}

	keyPress (e) {
		this.event = 'keypress'
		this.checkWhichKey(e)
		this.setPreviousFocus(e)
		this.input = e.target
		this.target = e.target.closest('div')
		this.moveLabel()
		this.setActive()
		this.validateInput()
	}

	checkWhichKey (e) {
		if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122)) this.keyType = 'letter'
		else if (e.keyCode >= 48 && e.keyCode <= 57) this.keyType = 'number'
		else if (e.keyCode === 9) this.keyType = 'tab'
	}

	moveLabel () {
		this.inputs.forEach(inputField => {
			if (inputField.value === '') {
				inputField.closest('div').classList.remove('activated')
			}
		})
		this.target.classList.add('activated')
	}

	setActive () {
		this.inputs.forEach(inputField => {
			inputField.closest('div').classList.remove('active')
		})

		this.target.classList.add('active')
	}

	validateInput () {
		// Check if clicked previous is required and empty on click
		if (this.previousFocus && this.previousFocus.querySelector('input').hasAttribute('required')) {
			if (this.previousFocus.querySelector('input').value === '') {
				this.previousFocus.classList.remove('valid')
				this.previousFocus.classList.add('invalid')
			} else {
				this.previousFocus.classList.remove('invalid')
				this.previousFocus.classList.add('valid')
			}
		} 

		// Not a required input, so validation not required
		if (!this.requiredInputs.includes(this.input)) return 

		// If input is text
		if (this.input.type === 'text') {
			if (this.input.value !== '') {
				this.target.classList.remove('invalid')
				this.target.classList.add('valid')
			}
		}

		// If input is email
		if (this.input.type === 'email') {
			this.target.classList.remove('invalid')
			const emailCheck = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (this.timeout) clearTimeout(this.timeout)
			this.timeout = setTimeout(() => {
				console.log('run')
				if (emailCheck.test(String(this.input.value).toLowerCase())) {
					this.target.classList.remove('invalid')
					this.target.classList.add('valid')
				} else {
					this.target.classList.remove('valid')
					this.target.classList.add('invalid')
				}
			}, 1000)
		}


	}

	setPreviousFocus (e) {
		// return if previous is not set or event is keypress (not a tab)
		if (this.target === false) return
		else if (this.event === 'keypress' && this.keyType !== 'tab') return
		else {
			this.previousFocus = this.target
		}

		this.inputs.forEach(inputField => {
			inputField.closest('div').classList.remove('previous')
		})
		this.previousFocus.classList.add('previous')
	}

	setDataHelpers () {
		this.inputs.forEach(inputField => {
			const dataHelper = inputField.getAttribute('data-helper')
			if (dataHelper) {
				const dataEl = document.createElement('p')
				dataEl.classList.add('data-helper')
				dataEl.textContent = dataHelper
				inputField.closest('div').appendChild(dataEl)
			}
			const dataError = inputField.getAttribute('data-error')
			if (dataError) {
				const dataEl = document.createElement('p')
				dataEl.classList.add('data-error')
				dataEl.textContent = dataError
				inputField.closest('div').appendChild(dataEl)
			}
		})
	}

	bindEvents () {
    ;['mouseClick', 'keyPress'].forEach(event => {
      this[event] = this[event].bind(this)
    })
	}
	
	initEvents () {
		this.inputs.forEach(input => {
			input.addEventListener('click', (e) => {
				this.mouseClick(e)
			})

			input.addEventListener('keyup', (e) => {
				this.keyPress(e)
			})
		})
	}
}

let form = new FormValidation('.form')