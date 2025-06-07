const baseUrl = Cypress.config('baseUrl');
const headerCart = '#header > .header-cart';

/** 
 * Test case 7: Cập nhật giỏ hàng
 */
describe('Testcase 7', () => {
    // ***Setup***
    beforeEach(() => {
        cy.visit('/');
    });

    // ***Testcases***

    /**
     * Tại trang Store, thêm tất cả sản phẩm vào giỏ hàng, mỗi mặt hàng được thêm bằng cách click button add với số lần click là một số random 
     * trong khoảng 1 tới 10, sau khi click hoàn tất thì ghi lại các thông tin id, name, brand, photo1, price, counter, total của từng mặt hàng, và tổng counter, tổng total.
     * Điều hướng đến trang Cart, thay đổi số lượng Hamburguesa thành 3, Helado 2 và ghi lại các thông tin mới,
     * đảm bảo các thông tin đã thay đổi trên giao diện và trong cartContent, cartTotals đúng với tính toán
     */
    it('Step 1', () => {
        cy.addCartByClickButton('#itemsContainer article', 'random')
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

                // Thay đổi số lượng của Hamburguesa và Helado
                const itemChanges = [
                    { index: 2, counter: 3 },
                    { index: 3, counter: 2 }
                ];
                cy.changeCartItemsCounter(itemInfos, itemTotals, itemChanges)
                    .then(([itemInfos, itemTotals]) => {
                        cy.checkCart(baseUrl, itemInfos, itemTotals);
                        cy.checkCartPage(itemInfos, itemTotals);
                    });
            });
    });


    /**
     * Lặp lại việc thêm giỏ hàng ở step 1, thay đổi số lượng và ghi lại thông tin ở step 1, kiểm tra khớp thông tin ở trang Cart.
     * Điều hướng về trang Store, click vào button +info mở modal của các mặt hàng Hamburguesa, Helado,
     * đảm bảo số lượng hiển thị và tổng tiền đã thay đổi khớp với trên modal chi tiết
     */
    it('Step 2', () => {
        cy.addCartByClickButton('#itemsContainer article', 'random')
            .then(results => {
                const itemInfos = results[0];
                const itemTotals = results[1];
                // Điều hướng tới trang Cart và kiểm tra
                cy.visit('/#/cart');
                cy.checkCartPage(itemInfos, itemTotals);

                // Thay đổi số lượng của Hamburguesa và Helado
                const itemChanges = [
                    { index: 2, counter: 3 },
                    { index: 3, counter: 2 }
                ];
                cy.changeCartItemsCounter(itemInfos, itemTotals, itemChanges)
                    .then(([itemInfos, itemTotals]) => {
                        // Kiểm tra trên header và tổng tiền phía dưới
                        cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${itemTotals['counter']})`);
                        cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${itemTotals['total']}`);
                        cy.checkCartPage(itemInfos, itemTotals);
                        // Điều hướng về trang Store và verify các item đã thay đổi
                        cy.visit('/#/inicio');
                        itemChanges.forEach(infoChange => {
                            // Lấy các thông tin cần thiết
                            const index = infoChange['index'];
                            const newItem = itemInfos[index - 1];
                            // Mở modal
                            cy.get(`#itemsContainer article:nth-child(${index}) > .item-details`).click();
                            cy.get('#modalContainer').should('be.visible');
                            // Kiểm tra counter và total
                            cy.get('#modalContainer > .modal').within($modal => {
                                cy.checkElement('#modalCartCounter', { text: `${newItem['counter']}` });
                                cy.checkElement('#modalCartTotal', { text: `$${newItem['total']}` });
                            });
                            // Đóng modal
                            cy.get('body').type('{esc}');
                            cy.get('#modalContainer').should('not.be.visible');
                        });
                    });
            });
    });


    /**
     * Lặp lại thêm giỏ hàng ở step 1 rồi điều hướng đến trang Cart, click button – của Pizza và Cafe để xoá 2 mặt hàng này,
     * kiểm tra và đảm bảo 2 mặt hàng đã bị xoá trên cartContent, cartTotals, button Cart và modal hiển thị chi tiết ở trang Store
     */
    it('Step 3', () => {
        cy.addCartByClickButton('#itemsContainer article', 'random')
            .then(results => {
                const itemInfos = results[0];
                const itemTotals = results[1];

                // Điều hướng tới trang Cart và kiểm tra
                cy.visit('/#/cart');
                cy.checkCartPage(itemInfos, itemTotals);

                // Chọn các mặt hàng Pizza và Cafe để xoá
                const itemDeletes = [4, 1];
                cy.deleteCartItems(itemInfos, itemTotals, itemDeletes)
                    .then(([itemInfos, itemTotals]) => {
                        // Kiểm tra trên header và tổng tiền phía dưới
                        cy.get(`${headerCart} > .header-cart-counter > span~span`).should('have.text', `(${itemTotals['counter']})`);
                        cy.get(`${headerCart} > .header-cart-total`).should('have.text', `$${itemTotals['total']}`);
                        cy.checkCartPage(itemInfos, itemTotals);
                        // Điều hướng về trang Store và verify các item đã thay đổi
                        cy.visit('/#/inicio');
                        itemDeletes.forEach(index => {
                            // Mở modal
                            cy.get(`#itemsContainer article:nth-child(${index}) > .item-details`).click();
                            cy.get('#modalContainer').should('be.visible');
                            // Kiểm tra counter và total
                            cy.get('#modalContainer > .modal').within($modal => {
                                cy.checkElement('#modalCartCounter', { text: '0' });
                                cy.checkElement('#modalCartTotal', { text: '$0' });
                            });
                            // Đóng modal
                            cy.get('body').type('{esc}');
                            cy.get('#modalContainer').should('not.be.visible');
                        });
                    });
            });
    });

    /**
     * Thực hiện các thao tác thêm giỏ hàng ở step 1. Điều hướng đến trang Cart, kiểm tra so khớp thông tin rồi click nút Empty cart, 
     * kiểm tra cartContent rỗng, cartTotals có counter và total đều bằng 0, tổng counter và tổng total ở button Cart cũng như ở cuối bảng item cũng bằng 0. 
     * Điều hướng về trang Store và kiểm tra tất cả mặt hàng đều có counter, và total bằng 0
     */
    it('Step 4', () => {
        cy.addCartByClickButton('#itemsContainer article', 'random')
            .then(results => {
                const itemInfos = results[0];
                const itemTotals = results[1];

                // Điều hướng tới trang Cart và kiểm tra
                cy.visit('/#/cart');
                cy.checkCartPage(itemInfos, itemTotals);

                // Xoá tất cả mặt hàng
                cy.get('.cartActions-btn').click();

                // Kiểm tra cartContent và cartTotals
                cy.getAllSessionStorage()
                    .then(storage => storage[baseUrl])
                    .then(storage => {
                        return {
                            'cartContent': JSON.parse(storage['cartContent']),
                            'cartTotals': JSON.parse(storage['cartTotals'])
                        };
                    }).then(({ cartContent, cartTotals }) => {
                        cy.wrap(cartContent).should('have.length', 0);
                        cy.wrap(cartTotals)
                            .its('counter').should('eq', 0);
                        cy.wrap(cartTotals)
                            .its('total').should('eq', 0);
                    });

                // Kiểm tra tổng counter, tổng total ở button Cart và cuối bảng item
                cy.checkElement(`${headerCart} > .header-cart-counter > span~span`, { text: '(0)' });
                cy.checkElement(`${headerCart} > .header-cart-total`, { text: '$0' });

                // Điều hướng về trang Store và verify các item đã bị xoá khỏi giỏ hàng
                cy.visit('/#/inicio');
                cy.get('#itemsContainer article').each(($article, i) => {
                    const curArticle = `#itemsContainer article:nth-child(${i + 1})`;

                    // Mở modal
                    cy.get(`${curArticle}:nth-child(${i + 1}) > .item-details`).click();
                    cy.get('#modalContainer').should('be.visible');

                    // Kiểm tra counter và total
                    cy.get('#modalContainer > .modal').within($modal => {
                        cy.checkElement('#modalCartCounter', { text: '0' });
                        cy.checkElement('#modalCartTotal', { text: '$0' });
                    });

                    // Đóng modal
                    cy.get('body').type('{esc}');
                    cy.get('#modalContainer').should('not.be.visible');
                });
            });
    });
});