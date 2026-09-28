/**
 * GitHub Pages 项目站（/angeles/）路径修正
 * 将错误的根路径 /images/... 重写到 /angeles/images/...
 * 在 React 加载前执行。
 */
(function () {
  var marker = '/angeles';
  var path = location.pathname || '/';
  var idx = path.indexOf(marker);
  var base = idx >= 0 ? path.slice(0, idx + marker.length + 1) : '/angeles/';

  function rewrite(url) {
    if (typeof url !== 'string') return url;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.indexOf(base) === 0) return url;
    if (url.charAt(0) === '/' && url.indexOf('/images/') === 0) {
      return base + url.slice(1);
    }
    if (url.indexOf('images/') === 0) {
      return base + url;
    }
    return url;
  }

  window.__ANGELES_BASE__ = base;

  var nativeFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    if (typeof input === 'string') {
      return nativeFetch(rewrite(input), init);
    }
    if (input instanceof Request) {
      var next = rewrite(input.url);
      if (next !== input.url) input = new Request(next, input);
    }
    return nativeFetch(input, init);
  };

  var srcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (srcDesc && srcDesc.set) {
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      enumerable: srcDesc.enumerable,
      get: srcDesc.get,
      set: function (value) {
        srcDesc.set.call(this, rewrite(value));
      },
    });
  }
})();
