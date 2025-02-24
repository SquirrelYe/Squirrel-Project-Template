var _createClass = (function () {
  function a(a, b) {
    for (var c, d = 0; d < b.length; d++) (c = b[d]), (c.enumerable = c.enumerable || !1), (c.configurable = !0), 'value' in c && (c.writable = !0), Object.defineProperty(a, c.key, c);
  }
  return function (b, c, d) {
    return c && a(b.prototype, c), d && a(b, d), b;
  };
})();
function _classCallCheck(a, b) {
  if (!(a instanceof b)) throw new TypeError('Cannot call a class as a function');
}
if (!pv)
  var pv = {
    map: function (a, b) {
      var c = {};
      return b
        ? a.map(function (a, d) {
            return (c.index = d), b.call(c, a);
          })
        : a.slice();
    },
    naturalOrder: function (c, a) {
      return c < a ? -1 : c > a ? 1 : 0;
    },
    sum: function (a, b) {
      var c = {};
      return a.reduce(
        b
          ? function (a, e, d) {
              return (c.index = d), a + b.call(c, e);
            }
          : function (a, b) {
              return a + b;
            },
        0
      );
    },
    max: function (a, b) {
      return Math.max.apply(null, b ? pv.map(a, b) : a);
    }
  };
var MMCQ = (function () {
    function a(a, c, d) {
      return (a << 10) + (c << 5) + d;
    }
    function b(a) {
      function b() {
        c.sort(a), (d = !0);
      }
      var c = [],
        d = !1;
      return {
        push: function (a) {
          c.push(a), (d = !1);
        },
        peek: function (a) {
          return d || b(), void 0 === a && (a = c.length - 1), c[a];
        },
        pop: function () {
          return d || b(), c.pop();
        },
        size: function () {
          return c.length;
        },
        map: function (a) {
          return c.map(a);
        },
        debug: function () {
          return d || b(), c;
        }
      };
    }
    function c(a, b, c, d, e, f, g) {
      var h = this;
      (h.r1 = a), (h.r2 = b), (h.g1 = c), (h.g2 = d), (h.b1 = e), (h.b2 = f), (h.histo = g);
    }
    function d() {
      this.vboxes = new b(function (c, a) {
        return pv.naturalOrder(c.vbox.count() * c.vbox.volume(), a.vbox.count() * a.vbox.volume());
      });
    }
    function e(b) {
      var c,
        d,
        e,
        f,
        g = Array(32768);
      return (
        b.forEach(function (b) {
          (d = b[0] >> 3), (e = b[1] >> 3), (f = b[2] >> 3), (c = a(d, e, f)), (g[c] = (g[c] || 0) + 1);
        }),
        g
      );
    }
    function f(a, b) {
      var d,
        e,
        f,
        g = 1e6,
        h = 0,
        i = 1e6,
        j = 0,
        k = 1e6,
        l = 0;
      return (
        a.forEach(function (a) {
          (d = a[0] >> 3), (e = a[1] >> 3), (f = a[2] >> 3), d < g ? (g = d) : d > h && (h = d), e < i ? (i = e) : e > j && (j = e), f < k ? (k = f) : f > l && (l = f);
        }),
        new c(g, h, i, j, k, l, b)
      );
    }
    function g(b, c) {
      function d(a) {
        var b,
          d,
          e,
          f,
          g,
          h = a + '1',
          i = a + '2',
          j = 0;
        for (l = c[h]; l <= c[i]; l++)
          if (r[l] > q / 2) {
            for (e = c.copy(), f = c.copy(), b = l - c[h], d = c[i] - l, g = b <= d ? Math.min(c[i] - 1, ~~(l + d / 2)) : Math.max(c[h], ~~(l - 1 - b / 2)); !r[g]; ) g++;
            for (j = s[g]; !j && r[g - 1]; ) j = s[--g];
            return (e[i] = g), (f[h] = e[i] + 1), [e, f];
          }
      }
      if (c.count()) {
        var e = c.r2 - c.r1 + 1,
          f = c.g2 - c.g1 + 1,
          g = c.b2 - c.b1 + 1,
          h = pv.max([e, f, g]);
        if (1 == c.count()) return [c.copy()];
        var l,
          m,
          n,
          o,
          p,
          q = 0,
          r = [],
          s = [];
        if (h == e)
          for (l = c.r1; l <= c.r2; l++) {
            for (o = 0, m = c.g1; m <= c.g2; m++) for (n = c.b1; n <= c.b2; n++) (p = a(l, m, n)), (o += b[p] || 0);
            (q += o), (r[l] = q);
          }
        else if (h == f)
          for (l = c.g1; l <= c.g2; l++) {
            for (o = 0, m = c.r1; m <= c.r2; m++) for (n = c.b1; n <= c.b2; n++) (p = a(m, l, n)), (o += b[p] || 0);
            (q += o), (r[l] = q);
          }
        else
          for (l = c.b1; l <= c.b2; l++) {
            for (o = 0, m = c.r1; m <= c.r2; m++) for (n = c.g1; n <= c.g2; n++) (p = a(m, n, l)), (o += b[p] || 0);
            (q += o), (r[l] = q);
          }
        return (
          r.forEach(function (a, b) {
            s[b] = q - a;
          }),
          h == e ? d('r') : h == f ? d('g') : d('b')
        );
      }
    }
    return (
      (c.prototype = {
        volume: function (a) {
          var b = this;
          return (!b._volume || a) && (b._volume = (b.r2 - b.r1 + 1) * (b.g2 - b.g1 + 1) * (b.b2 - b.b1 + 1)), b._volume;
        },
        count: function (b) {
          var c = this,
            d = c.histo;
          if (!c._count_set || b) {
            var e,
              f,
              g,
              h,
              l = 0;
            for (f = c.r1; f <= c.r2; f++) for (g = c.g1; g <= c.g2; g++) for (h = c.b1; h <= c.b2; h++) (e = a(f, g, h)), (l += d[e] || 0);
            (c._count = l), (c._count_set = !0);
          }
          return c._count;
        },
        copy: function () {
          var a = this;
          return new c(a.r1, a.r2, a.g1, a.g2, a.b1, a.b2, a.histo);
        },
        avg: function (b) {
          var c = this,
            d = c.histo;
          if (!c._avg || b) {
            var e,
              f,
              g,
              h,
              l,
              m = 0,
              n = 0,
              o = 0,
              p = 0;
            for (f = c.r1; f <= c.r2; f++)
              for (g = c.g1; g <= c.g2; g++)
                for (h = c.b1; h <= c.b2; h++) (l = a(f, g, h)), (e = d[l] || 0), (m += e), (n += 8 * (e * (f + 0.5))), (o += 8 * (e * (g + 0.5))), (p += 8 * (e * (h + 0.5)));
            c._avg = m ? [~~(n / m), ~~(o / m), ~~(p / m)] : [~~((8 * (c.r1 + c.r2 + 1)) / 2), ~~((8 * (c.g1 + c.g2 + 1)) / 2), ~~((8 * (c.b1 + c.b2 + 1)) / 2)];
          }
          return c._avg;
        },
        contains: function (a) {
          var b = this,
            c = a[0] >> 3;
          return (gval = a[1] >> 3), (bval = a[2] >> 3), c >= b.r1 && c <= b.r2 && gval >= b.g1 && gval <= b.g2 && bval >= b.b1 && bval <= b.b2;
        }
      }),
      (d.prototype = {
        push: function (a) {
          this.vboxes.push({ vbox: a, color: a.avg() });
        },
        palette: function () {
          return this.vboxes.map(function (a) {
            return a.color;
          });
        },
        size: function () {
          return this.vboxes.size();
        },
        map: function (a) {
          for (var b = this.vboxes, c = 0; c < b.size(); c++) if (b.peek(c).vbox.contains(a)) return b.peek(c).color;
          return this.nearest(a);
        },
        nearest: function (a) {
          for (var b, c, d, e = Math.pow, f = this.vboxes, g = 0; g < f.size(); g++)
            (c = Math.sqrt(e(a[0] - f.peek(g).color[0], 2) + e(a[1] - f.peek(g).color[1], 2) + e(a[2] - f.peek(g).color[2], 2))), (c < b || void 0 === b) && ((b = c), (d = f.peek(g).color));
          return d;
        },
        forcebw: function () {
          var a = this.vboxes;
          a.sort(function (c, a) {
            return pv.naturalOrder(pv.sum(c.color), pv.sum(a.color));
          });
          var b = a[0].color;
          5 > b[0] && 5 > b[1] && 5 > b[2] && (a[0].color = [0, 0, 0]);
          var c = a.length - 1,
            d = a[c].color;
          251 < d[0] && 251 < d[1] && 251 < d[2] && (a[c].color = [255, 255, 255]);
        }
      }),
      {
        quantize: function (a, c) {
          function h(a, b) {
            for (var c, d = 1, e = 0; 1000 > e; ) {
              if (((c = a.pop()), !c.count())) {
                a.push(c), e++;
                continue;
              }
              var f = g(i, c),
                h = f[0],
                j = f[1];
              if (!h) return;
              if ((a.push(h), j && (a.push(j), d++), d >= b)) return;
              if (1000 < e++) return;
            }
          }
          if (!a.length || 2 > c || 256 < c) return !1;
          var i = e(a),
            j = 0;
          i.forEach(function () {
            j++;
          }),
            j <= c;
          var k = f(a, i),
            l = new b(function (c, a) {
              return pv.naturalOrder(c.count(), a.count());
            });
          l.push(k), h(l, 0.75 * c);
          for (
            var m = new b(function (c, a) {
              return pv.naturalOrder(c.count() * c.volume(), a.count() * a.volume());
            });
            l.size();

          )
            m.push(l.pop());
          h(m, c - m.size());
          for (var n = new d(); m.size(); ) n.push(m.pop());
          return n;
        }
      }
    );
  })(),
  ColorAnalysis = (function () {
    function a(b) {
      _classCallCheck(this, a), (this.canvasId = b);
    }
    return (
      _createClass(a, [
        {
          key: 'getPalette',
          value: function (a, c) {
            var b = this,
              d = a.width,
              e = a.height,
              f = a.imgPath,
              h = a.maxColors,
              j = a.step;
            ('undefined' == typeof h || 2 > h) && (h = 2), 256 < h && (h = 10), ('undefined' == typeof j || 1 > j) && (j = 10);
            var g = uni.createCanvasContext(this.canvasId);
            g.drawImage(f, 0, 0, d, e),
              g.draw(!1, function () {
                uni.canvasGetImageData({
                  canvasId: b.canvasId,
                  x: 0,
                  y: 0,
                  width: d,
                  height: e,
                  success: function (f) {
                    for (var k, l, m, n, o, p = f.data, q = [], s = 0; s < d * e; s += j)
                      (k = 4 * s), (l = p[k + 0]), (m = p[k + 1]), (n = p[k + 2]), (o = p[k + 3]), 125 <= o && !(250 < l && 250 < m && 250 < n) && q.push([l, m, n]);
                    var t = MMCQ.quantize(q, h),
                      u = t ? t.palette() : null;
                    c && c(u);
                  }
                });
              });
          }
        }
      ]),
      a
    );
  })();
export default ColorAnalysis;
