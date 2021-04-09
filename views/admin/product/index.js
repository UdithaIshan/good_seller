const layout = require('../layout');

module.exports = ({ products }) => {
    const productList = products.map((product) => {
        return `<div>${product.title}</div>`;
    }).join('');

    return layout({
        content: 
        `
        <h1>Products</h1>
        ${productList} 
        `
    });
};
