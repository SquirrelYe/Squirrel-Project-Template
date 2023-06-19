// #ifndef APP-PLUS || MP-WEIXIN || H5
export default {
	data() {
		return {
			useAngle: 0,
			transform: '',
			startX: 0,
			lastLeft: 0,
			resetAni: false
		}
	},
	created() {
		this.useAngle = this.angle
	},
	watch: {
		angle(val) {
			this.useAngle = this.angle
		},
		reset(val) {
			this.startX = 0;
			this.lastLeft = 0;
			this.styleChange(0, 0)
		}
	},
	methods: {
		styleChange(left, deg) {
			if (left == 0 && deg == this.angle) {
				this.resetAni = true
			} else {
				this.resetAni = false
			}
			this.transform = 'translate3d(' + left + 'px,0,0)'
			this.useAngle = deg
		},
		touchstart(e) {
			let touch = e.touches[0] || e.changedTouches[0];
			this.startX = touch.clientX
		},
		touchmove(e) {
			if (this.isPass || !this.show) return;
			let touch = e.touches[0] || e.changedTouches[0]
			let pageX = touch.clientX;
			let left = pageX - this.startX + this.lastLeft;
			left = left < 0 ? 0 : left;
			let width = this.sliderWidth - this.sliderHeight;
			left = left >= width ? width : left;
			this.startX = pageX
			this.lastLeft = left
			let deg = 360 / width * left + Number(this.angle)
			this.styleChange(left, deg)
		},
		touchend(e) {
			if (this.isPass || !this.show) return;
			let left = this.sliderWidth - this.sliderHeight;
			let deg = 360 / left * this.lastLeft + Number(this.angle)
			if (this.type == 1) {
				if (Math.abs(deg - 360) <= this.errorRange || Math.abs(deg) <= this.errorRange) {
					this.styleChange(this.lastLeft, deg)
					this.success()
				} else {
					this.startX = 0;
					this.lastLeft = 0;
					this.styleChange(0, Number(this.angle))
					this.error()
				}
			} else {
				this.result({
					angle: deg - Number(this.angle)
				})
			}

		}
	}
}

// #endif

// #ifdef APP-PLUS|| MP-WEIXIN || H5 
export default {}
// #endif
