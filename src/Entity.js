export default class Entity {

  constructor({tag = 'div' , className =''} = {}) {
    this.el  = document.createElement(tag);
    document.body.appendChild(this.el);
    this.el.className = 'entity ' + className;
  }

  SettterX(x) {
    this.x = x;
    this.el.style.left = `${this.x}px`; 
  }

  SetterY(y) {
    this.y = y;
    this.el.style.top = `${this.y}px`;
  }

  remove() {
    this.el.remove();
    this.el = null;
  }

   
} 
