function Create(components, propsData, parentNode) {
  this.cmp = null
  this.components = components
  this.propsData = propsData
  this._init()
  this._insert(parentNode)
}

Create.prototype._init = function() {
  this.cmp = new (Vue.extend(this.components))({propsData: this.propsData}).$mount()
}

Create.prototype._insert = function(parentNode) {
  parentNode.appendChild(this.cmp.$el)
}

Create.prototype.on = function(eventName, callback) {
  this.cmp.$on(eventName, callback)
}