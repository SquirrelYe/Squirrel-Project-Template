// #ifndef APP-PLUS || MP-WEIXIN || H5

export default {
	data() {
		return {
			current: -1,
			transX: '0px',
			transY: '0px',
			startTouch: null,
			tDragging: false,
			sId: null,
			preStartKey: null
		}
	},
	methods: {
		isOutRange(x1, y1, x2, y2, x3, y3) {
			return x1 < 0 || x1 >= y1 || x2 < 0 || x2 >= y2 || x3 < 0 || x3 >= y3
		},
		sortCore(sKey, eKey) {
			var excludeFix = (cKey, type) => {
				// fixed 元素位置不会变化, 这里直接用 cKey(sortKey) 获取, 更加快捷
				if (this.list[cKey].fixed) {
					var _cKey = type ? --cKey : ++cKey;
					return excludeFix(cKey, type);
				}
				return cKey;
			}
			let endRealKey = -1;
			this.list.forEach((item) => {
				if (item.sortKey === eKey) endRealKey = item.realKey;
			});

			return this.list.map((item) => {
				let cKey = item.sortKey;
				let rKey = item.realKey;
				if (sKey < eKey) {
					if (cKey > sKey && cKey <= eKey) {
						--rKey;
						cKey = excludeFix(--cKey, true);
					} else if (cKey === sKey) {
						rKey = endRealKey;
						cKey = eKey;
					}
				} else if (sKey > eKey) {
					if (cKey >= eKey && cKey < sKey) {
						++rKey;
						cKey = excludeFix(++cKey, false);
					} else if (cKey === sKey) {
						rKey = endRealKey;
						cKey = eKey;
					}
				}
				if (item.sortKey !== cKey && !item.fixed) {
					let columns = Number(this.columns)
					item.transX = (cKey % columns) * this.baseData.itemWidth + "px";
					item.transY = Math.floor(cKey / columns) * this.baseData.itemHeight + "px";
					item.sortKey = cKey;
					item.realKey = rKey;
				}
				return item;
			});
		},
		emitsEvent(list, type) {
			let changeList = [],
				itemList = [];

			list.forEach((item) => {
				changeList[item.sortKey] = item;
			});

			changeList.forEach((item) => {
				itemList.push(item.data);
			});
			if (type == "change") {
				this.change({
					listData: itemList
				});
			} else {
				this.sort_end({
					listData: itemList
				});
			}
		},
		longPress(e) {
			if (!this.isEdit) return;
			let touch = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : this.startTouch;
			if (!touch) return;
			this.current = Number(e.currentTarget.dataset.index);
			// 初始项是固定项则返回
			let item = this.list[this.current];
			if (item && item.fixed) return;

			if (this.tDragging) return;
			//pageX
			this.transX = this.columns == 1 ? 0 : touch.clientX - (this.baseData.itemWidth / 2 + this.baseData.wrapLeft) + 'px';
			this.transY = touch.clientY - (this.baseData.itemHeight / 2 + this.baseData.wrapTop) + 'px';
			this.sId = touch.identifier;
			this.tDragging = true;
		},
		touchstart(e) {
			if (!this.isEdit) return;
			this.startTouch = e.changedTouches[0] || e.touches[0];
		},
		touchmove(e) {
			if (!this.isEdit || !this.tDragging) return;
			let touch = e.changedTouches[0] || e.touches[0];
			if (!touch || this.sId !== touch.identifier) return;
			let transX = this.columns == 1 ? 0 : touch.clientX - (this.baseData.itemWidth / 2 + this.baseData.wrapLeft);
			let transY = touch.clientY - (this.baseData.itemHeight / 2 + this.baseData.wrapTop);

			if (touch.clientY > this.baseData.windowHeight - this.baseData.itemHeight) {
				this.pageScroll({
					scrollTop: touch.pageY + this.baseData.itemHeight - this.baseData.windowHeight
				})
			} else if (touch.clientY < this.baseData.itemHeight) {
				this.pageScroll({
					scrollTop: touch.pageY - this.baseData.itemHeight
				})
			}
			this.transX = transX + 'px'
			this.transY = transY + 'px'

			let startKey = this.list[this.current].sortKey;
			let curX = Math.round(transX / this.baseData.itemWidth);
			let curY = Math.round(transY / this.baseData.itemHeight);
			let endKey = curX + Number(this.columns) * curY;
			// 目标项是固定项则返回
			var item = this.list[endKey];
			if (item && item.fixed) return;

			if (this.isOutRange(curX, Number(this.columns), curY, this.rows, endKey, this.list.length)) return;

			if (startKey === endKey || startKey === this.preStartKey) return;
			this.preStartKey = startKey;

			let list = this.sortCore(startKey, endKey);
			this.listChange({
				list: list
			})
			this.emitsEvent(list, "change");
		},
		touchend(e) {
			if (!this.isEdit || !this.tDragging) return;
			this.emitsEvent(this.list, "sortend");
			this.preStartKey = -1;
			this.tDragging = false;
			this.current = -1;
			this.transX = '0px';
			this.transY = '0px';
		}
	}
}

// #endif

// #ifdef APP-PLUS|| MP-WEIXIN || H5
export default {}
// #endif
