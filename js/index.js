document.addEventListener('DOMContentLoaded', () => {
	
	// initSlider('.participants-slider', {
	// 	showSlide: 3,
	// 	swipeSlide: 3,
	// 	swipeBetween: 20,
	// 	pagination: {
	// 		prev: '.participants-btn__prev',
	// 		next: '.participants-btn__next',
	// 		counter: '.participants-counter',
	// 	}
	// })
	
	function slidersActive() {
		if (window.innerWidth > 992) {
			initSlider('.participants-slider', {
				showSlide: 3,
				swipeSlide: 3,
				swipeBetween: 20,
				pagination: {
					prev: '.participants-btn__prev',
					next: '.participants-btn__next',
					counter: '.participants-counter',
				}
			})
		}
		if (window.innerWidth > 768 && window.innerWidth <= 992) {
			initSlider('.participants-slider', {
				showSlide: 2,
				swipeSlide: 2,
				swipeBetween: 20,
				pagination: {
					prev: '.participants-btn__prev',
					next: '.participants-btn__next',
					counter: '.participants-counter',
				}
			})
		}
		if (window.innerWidth <= 768) {
			initSlider('.participants-slider', {
				showSlide: 1,
				swipeSlide: 1,
				pagination: {
					prev: '.participants-btn__prev',
					next: '.participants-btn__next',
					counter: '.participants-counter',
				}
			})
		}
		
		if (window.innerWidth <= 768) {
			initSlider('.stages-slider', {
				showSlide: 1,
				swipeSlide: 1,
				pagination: {
					prev: '.stages-btn__prev',
					next: '.stages-btn__next',
					dots: '.stages-dots',
				}
			})
		}
	}
	
	slidersActive()
	window.addEventListener('resize', slidersActive)
	
	function initSlider(src, options = {
		showSlide: 1,
		swipeSlide: 1,
		swipeBetween: 0,
		pagination: {
			prev: null,
			next: null,
			counter: null,
			dots: null
		},
	}) {
		let slider = document.querySelector(src)
		if (slider) {
			// Переменные и настройки
			const list = slider.querySelector('.c-slider__list')
			const track = slider.querySelector('.c-slider__track')
			const prev = document.querySelector(options.pagination.prev)
			const next = document.querySelector(options.pagination.next)
			const slides = slider.querySelectorAll('.c-slider__slide');
			const counter = document.querySelector(options.pagination.counter);
			const dots = document.querySelector(options.pagination.dots);
			
			const showSlide = options.showSlide;
			const swipeSlide = options.swipeSlide;
			let swipeBetween = 0
			if (options.swipeBetween > 0) {
				swipeBetween = options.swipeBetween
			}
			
			let index = 0;
			let maxIndex = slides.length;
			let fullWidth = null;
			let slideWidth = null;
			let fullBetween = 0
			
			let shifted = 0;
			
			let stopTimer = null;
			let stopSwipe = false;
			
			let firstInitDotsSlides = false;
			
			// Обновление слайдера на странице
			function initSlides(countSlide) {
				track.style.gap = swipeBetween + 'px'
				
				fullWidth = list.offsetWidth
				slideWidth = fullWidth / countSlide
				let sInd = 0;
				fullBetween = 0;
				slides.forEach((slide) => {
					sInd = sInd + 1;
					if (sInd < slides.length) {
						fullBetween = fullBetween + swipeBetween
					}
				})
				slides.forEach((slide) => {
					slide.style.width = slideWidth - (fullBetween / slides.length) + 'px'
				})
				
				counterSlides();
				dotsSlides();
			}
			
			initSlides(showSlide)
			window.addEventListener('resize', () => initSlides(showSlide))
			
			// Функционал
			if (prev) {
				function prevSlide() {
					if (!stopSwipe) {
						stopSwipe = true
						clearTimeout(stopTimer);
						if (shifted !== 0 && shifted > 0 && index > 0) {
							index = index - 1
							shifted -= slideWidth
							track.style.transform = `translateX(${-(shifted * swipeSlide)}px)`
						}
						
						if (index === 0) {
							prev.classList.add('disabled')
							next.classList.remove('disabled')
						}
						
						stopTimer = setTimeout(() => {
							stopSwipe = false
						}, 100)
						counterSlides()
						dotsSlides()
					}
				}
				
				prev.addEventListener('click', prevSlide)
			}
			
			if (next) {
				function nextSlide() {
					if (!stopSwipe) {
						stopSwipe = true
						clearTimeout(stopTimer);
						if (index < ((maxIndex / swipeSlide) - 1)) {
							index = index + 1
							shifted += slideWidth
							track.style.transform = `translateX(${-(shifted * swipeSlide)}px)`
						}
						if (index === ((maxIndex / swipeSlide) - 1)) {
							prev.classList.remove('disabled')
							next.classList.add('disabled')
						}
						
						stopTimer = setTimeout(() => {
							stopSwipe = false
						}, 100)
						counterSlides()
						dotsSlides()
					}
				}
				
				next.addEventListener('click', nextSlide)
			}
			
			function counterSlides() {
				if (counter) {
					const active = counter.querySelector('.c-slider__counter-active')
					const max = counter.querySelector('.c-slider__counter-max')
					
					active.innerText = showSlide * (index + 1);
					
					max.innerText = slides.length
				}
			}
			
			function initDotsSlides() {
				if (dots && showSlide === 1) {
					dots.classList.remove('hide')
					if (!firstInitDotsSlides) {
						firstInitDotsSlides = true
						dots.querySelectorAll('div').forEach(el => {
							el.remove()
						})
						slides.forEach((slide) => {
							const item = document.createElement('div');
							item.className = 'c-slider__dots-item'
							dots.append(item)
						})
						dots.querySelectorAll('.c-slider__dots-item').forEach((el, ind) => {
							if (ind === 0) {
								el.classList.add('active')
							}
						})
					}
				} else {
					if (dots) {
						dots.classList.add('hide')
						firstInitDotsSlides = false
					}
				}
			}
			
			function dotsSlides() {
				if (dots && showSlide === 1) {
					function changeDots(el) {
						dots.querySelectorAll('.c-slider__dots-item').forEach(i => i.classList.remove('active'))
						el.classList.add('active')
					}
					
					initDotsSlides()
					dots.querySelectorAll('.c-slider__dots-item').forEach((el, ind) => {
						if (ind === index) {
							changeDots(el)
						}
					})
				}
			}
		}
	}
})