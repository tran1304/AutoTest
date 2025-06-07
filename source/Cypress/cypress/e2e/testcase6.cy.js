const baseUrl = Cypress.config('baseUrl');
const headerCart = '#header > .header-cart';

/** 
 * Test case 6: Kiểm tra giỏ hàng
 */
describe('Testcase 6', () => {
// ***Setup***
    beforeEach(() => {
        cy.visit('/');
    });

// ***Testcases***

    /**
     * Tại trang Store, thêm tất cả sản phẩm vào giỏ hàng, mỗi mặt hàng thực hiện theo các bước:
     * - Click vào button +info mở modal chi tiết
     * - Chọn số lần click của button + là một số random trong khoảng từ 1 tới 10, và button – là random khoảng 0 tới số lần click của button + trừ đi 1
     * - Click button + và button – theo số lần đã tạo, ghi lại các thông tin id, name, brand, photo1, price, counter, total, tổng counter, tổng total
     * Điều hướng đến trang Cart, đảm bảo các thông tin hiển thị đúng như các thông tin đã lưu bao gồm: 
     * id (lấy tại button -), photo1, name, brand, price, counter, total, tổng counter, tổng total
     */
    it('Step 1', () => {
        cy.addCartByViewModal('#itemsContainer article', 'random', 'random')
        .then(results => {
            const itemInfos = results[0];
            const itemTotals = results[1];
            // Kiểm tra cartContent và cartTotals
            cy.checkCart(baseUrl, itemInfos, itemTotals);
            // Kiểm tra trên header
            cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${itemTotals['counter']})`);
            cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${itemTotals['total']}`);
            // Điều hướng tới trang Cart và kiểm tra
            cy.visit('/#/cart');
            cy.checkCartPage(itemInfos, itemTotals);
        });
    });

    /**
     * Lặp lại step 1 nhưng thay đổi số lần click button + là 5, số lần click button – là 5
     */
    it('Step 2', () => {
        cy.addCartByViewModal('#itemsContainer article', 5, 5)
        .then(results => {
            const itemInfos = results[0];
            const itemTotals = results[1];
            // Kiểm tra cartContent và cartTotals
            cy.checkCart(baseUrl, itemInfos, itemTotals);
            // Kiểm tra trên header
            cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${itemTotals['counter']})`);
            cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${itemTotals['total']}`);
            // Điều hướng tới trang Cart và kiểm tra
            cy.visit('/#/cart');
            cy.checkCartPage(itemInfos, itemTotals);
        });
    });

    /**
     * Lặp lại step 1 nhưng thay đổi số lần click button + là 2, số lần click button – là 5
     */
    it('Step 3', () => {
        cy.addCartByViewModal('#itemsContainer article', 2, 5)
        .then(results => {
            const itemInfos = results[0];
            const itemTotals = results[1];
            // Kiểm tra cartContent và cartTotals
            cy.checkCart(baseUrl, itemInfos, itemTotals);
            // Kiểm tra trên header
            cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${itemTotals['counter']})`);
            cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${itemTotals['total']}`);
            // Điều hướng tới trang Cart và kiểm tra
            cy.visit('/#/cart');
            cy.checkCartPage(itemInfos, itemTotals);
        });
    });
});