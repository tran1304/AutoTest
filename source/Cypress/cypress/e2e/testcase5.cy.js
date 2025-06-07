const baseUrl = Cypress.config('baseUrl');
const headerCart = '#header > .header-cart';

/** 
 * Test case 5: Chọn hàng (thêm vào giỏ hàng)
 */
describe('Testcase 5', () => {
// ***Setup***
    beforeEach(() => {
        cy.visit('/');
    });

// ***Testcases***

    /**
     * Tại trang Store (vì đầy đủ sản phẩm), thực hiện các thao tác:
     * - Click duy nhất 1 lần button add của cả 6 sản phẩm
     * - Ghi lại các counter=số lần click, price=giá sản phẩm, tính total từng sản phẩm
     * - Tính tổng counter, tổng total của tất cả sản phẩm đã click.
     * Đảm bảo counter, tổng total tại nút giỏ hàng hiện đúng tổng counter, tổng total đã tính được
     */
    it('Step 1', () => {
        cy.addCartByClickButton('#itemsContainer article', 1)
        .then(results => {
            const counter = results[1]['counter'];
            const total = results[1]['total'];
            cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${counter})`);
            cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${total}`);
        });
    });


    /**
     * Lặp lại các thao tác thêm giỏ hàng của step 1, và đảm bảo các tiêu chí sau:
     * - cartContent có đủ 6 sản phẩm, mỗi sản phẩm đảm bảo đúng id, name, brand, photo1, price, counter, total đúng với các thông tin (id, name, brand, photo1, price, counter, total) đã ghi lại
     * - cartTotals có counter, total đúng với tổng counter, tổng total đã tính được
     */
    it('Step 2', () => {
        cy.addCartByClickButton('#itemsContainer article', 1)
        .then(results => {
            const itemInfos = results[0];
            const itemTotals = results[1];
            cy.checkCart(baseUrl, itemInfos, itemTotals);
        });
    });

    /**
     * Lặp lại step 2 nhưng với số lần click button add của mỗi sản phẩm là random trong khoảng 1 tới 10
     */
    it('Step 3', () => {
        cy.addCartByClickButton('#itemsContainer article', 'random')
        .then(results => {
            const itemInfos = results[0];
            const itemTotals = results[1];
            cy.checkCart(baseUrl, itemInfos, itemTotals);
        });
    });

    /**
     * Tại trang Store, thêm tất cả sản phẩm vào giỏ hàng, mỗi mặt hàng thực hiện theo các bước:
     * - Click vào button +info mở modal chi tiết
     * - Click button + 3 lần, button – 2 lần, ghi lại các thông tin id, name, brand, photo1, price, counter, total, tổng counter, tổng total
     * Đảm bảo thông tin đúng theo các tiêu chí:
     * - Kiểm tra cartContent và cartTotals như step 2
     * - Kiểm tra tổng counter, tổng total tại nút giỏ hàng hiện đúng tổng counter, tổng total đã tính được
     */
    it('Step 4', () => {
        cy.addCartByViewModal('#itemsContainer article', 3, 2)
        .then(results => {
            const itemInfos = results[0];
            const itemTotals = results[1];
            // Kiểm tra cartContent và cartTotals
            cy.checkCart(baseUrl, itemInfos, itemTotals);
            // Kiểm tra trên header
            cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${itemTotals['counter']})`);
            cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${itemTotals['total']}`);
        });
    });

    /**
     * Thay đổi số lần click của button + là một số random trong khoảng từ 1 tới 10, và button – là random khoảng 0 tới số lần click của button + trừ đi 1.
     * Lặp lại việc ghi thông tin và kiểm tra của step 4
     */
    it('Step 5', () => {
        cy.addCartByViewModal('#itemsContainer article', 'random', 'random')
        .then(results => {
            const itemInfos = results[0];
            const itemTotals = results[1];
            // Kiểm tra cartContent và cartTotals
            cy.checkCart(baseUrl, itemInfos, itemTotals);
            // Kiểm tra trên header
            cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${itemTotals['counter']})`);
            cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${itemTotals['total']}`);
        });
    });
});