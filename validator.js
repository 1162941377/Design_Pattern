// 校验函数
function dataValidator() {
  this.cache = []; // 缓存定义的校验规则
  this.warnDom = []; // 存储错误信息dom
  this.form = []; // 缓存整个表单中的输入框
}

/*
 * 原型链上有三个方法：
 * 1）add：添加校验规则
 * 2）start：只有当调用该方法时，才会开始校验
 * 3）extend：扩展方法，类似于 Jquery 提供的 extend 方法
 * 4）strategy：定义的是校验规则
 */
dataValidator.prototype.strategies = {
  isNonEmpty: function (value, errorMsg) {
    if (value === "") {
      return errorMsg;
    }
    return true;
  },
  maxLength: function (value, length, errorMsg) {
    if (value !== "" && value.length > length) {
      return errorMsg;
    }
    return true;
  },
  minLength: function (value, length, errorMsg) {
    if (value !== "" && value.length < length) {
      return errorMsg;
    }
    return true;
  },
};

/**
 * 添加校验规则
 * @param {*} dom 要校验的文本dom
 * @param {*} showDom 错误信息显示dom
 * @param {*} strategyArr 校验规则
 */
dataValidator.prototype.add = function (dom, showDom, strategyArr) {
  const self = this;
  self.warnDom.push(showDom);
  self.form.push(dom);
  strategyArr.forEach(function (ele) {
    self.cache.push(function () {
      const arr = ele.strategy.split(":");
      // console.log(arr);
      const type = arr.shift();
      // console.log(type);
      arr.unshift(dom.value);
      arr.push(ele.errorMsg);
      const msg = self.strategies[type].apply(self, arr);
      // console.log(self.strategies[type]);
      // console.log(msg);
      if (msg !== true) {
        showDom.innerText = msg;
      }
      // console.log(arr);
      return msg;
    });
  });
};

dataValidator.prototype.start = function () {
  let flag = true;
  this.warnDom.forEach(function (ele) {
    // console.log(ele);
    ele.innerText = "";
  });
  this.cache.forEach(function (ele) {
    // console.log(ele);
    if (ele() !== true) {
      flag = false;
    }
  });
  return flag;
};

dataValidator.prototype.clear = function () {
  this.warnDom.forEach(function (ele) {
    ele.innerText = "";
  });
  // console.log(this.form);
  this.form.forEach(function (ele) {
    ele.value = "";
  });
};

dataValidator.prototype.extend = function (config) {
  for (const prop in config) {
    this.strategies[prop] = config[prop];
  }
};
