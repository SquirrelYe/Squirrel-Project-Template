// #ifndef APP-PLUS || MP-WEIXIN || H5
export default {
	data() {
		return {
			transform: '',
			slipOverWidth: 0,
			startX: 0,
			lastLeft: 0,
			resetAni: false
		}
	},
	watch: {
		reset(val) {
			this.startX = 0;
			this.lastLeft = 0;
			this.styleChange(0)
		}
	},
	methods: {
		styleChange(left) {
			if (left == 0) {
				this.resetAni = true
			} else {
				this.resetAni = false
			}
			this.slipOverWidth = left
			this.transform = 'translate3d(' + left + 'px,0,0)'
		},
		touchstart(e) {
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.clientX
		},
		touchmove(e) {
			if (this.isPass) return;
			let touch = e.touches[0] || e.changedTouches[0]
			let pageX = touch.clientX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.slideBarWidth - this.slideBlockWidth;
			left = left >= width ? width : left;
			this.startX = pageX
			this.lastLeft = left
			this.styleChange(left)
		},
		touchend(e) {
			if (this.isPass) return;
			let left = this.slideBarWidth - this.slideBlockWidth
			if (Math.abs(left - this.lastLeft) <= Number(this.errorRange)) {
				// this.styleChange(left)
				this.success()
			} else {
				this.startX = 0;
				this.lastLeft = 0;
				this.styleChange(0)
			}
		}
	}
}

// #endif

// #ifdef APP-PLUS|| MP-WEIXIN || H5 
export default {}
// #endif
