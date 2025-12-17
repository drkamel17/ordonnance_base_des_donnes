// JsBarcode configuration
window.JsBarcode = function (element, value, options) {
    if (!element) {
        throw new Error("Element not found");
    }

    this.element = element;
    this.value = value || "";
    this.options = options || {};

    return this;
};

JsBarcode.prototype.code128 = function (value) {
    this.value = value;
    return this;
};

JsBarcode.prototype.render = function () {
    // Simple mock implementation for testing
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 300 100");

    // Create rect element
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "300");
    rect.setAttribute("height", "100");
    rect.setAttribute("fill", "#FFFFFF");

    // Create text element
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "50%");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#000000");
    text.textContent = this.value;

    svg.appendChild(rect);
    svg.appendChild(text);
    this.element.appendChild(svg);
};
