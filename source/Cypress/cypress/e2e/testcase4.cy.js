const baseUrl = Cypress.config('baseUrl');
const goStore = {
    'btn': '#header > .header-logo',
    'textContent': '#header > .header-logo > span',
    'url': `${baseUrl}/#/inicio`
};
const goReleases = {
    'btn': '#header > .header-menu > a[name="releases"]',
    'textContent': '#header > .header-menu > a[name="releases"] > span',
    'url': `${baseUrl}/#/nuevosproductos`
};
const goPromotions = {
    'btn': '#header > .header-menu > a[name="promotions"]',
    'textContent': '#header > .header-menu > a[name="promotions"] > span',
    'url': `${baseUrl}/#/promociones`
};
const data = Cypress.env('data');

/** 
 * Test case 4: Đánh giá sản phẩm
 */
describe('Test case 4', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    /**
     * Tại trang Store, click vào button +info của các sản phẩm Cafe (sản phẩm đầu tiên), ghi lại các lượt likes và dislikes ban đầu, click button like 3 lần và button dislike 3 lần.
     * Verify dữ liệu theo các bước:
     * - Các lượt đánh giá hiển thị khớp với số lượt kỳ vọng (like+3, dislike+3)
     * - Điều hướng tới trang new products (Productos Nuevos), mở modal chi tiết của Cafe lên và đảm bảo đúng với đánh giá đã lưu ở trang Store
     * - Tiếp tục điều hướng về trang Store và kiểm tra các lượt đánh giá của Cafe
     */
    it('Step 1', () => {
        const itemAtPages = [
            {btnRedirect: goReleases['btn'], url: goReleases['url'], position: 1},
            {btnRedirect: goStore['btn'], url: goStore['url'], position: 1}
        ];
        const posAtStore = 1;
        const likeClicks = 3;
        const dislikeClicks = 3;

        // Đánh giá và verify
        cy.evaluateProduct(goStore['btn'], goStore['url'], posAtStore, likeClicks, dislikeClicks)
        .then(({likes, dislikes, likesClicked, dislikesClicked, newLikes, newDislikes}) => {
            // Verify lượt likes và dislikes mới
            cy.wrap(newLikes).should('eq', likes + likesClicked);
            cy.wrap(newDislikes).should('eq', dislikes + dislikesClicked);
            
            // Verify lượt likes và dislikes mới trên các modal chi tiết tại các trang
            itemAtPages.forEach(item => {
                cy.checkEvaluation(item['btnRedirect'], item['url'], item['position'], newLikes, newDislikes);
            });
        });
    });

    /**
     * Thực hiện các thao tác ở step 1 và verify với like 4 lần và dislike 1 lần cho mặt hàng Hamburguesa
     */
    it('Step 2', () => {
        const itemAtPages = [
            {btnRedirect: goPromotions['btn'], url: goPromotions['url'], position: 1},
            {btnRedirect: goStore['btn'], url: goStore['url'], position: 2}
        ];
        const posAtStore = 2;
        const likeClicks = 4;
        const dislikeClicks = 1;

        // Đánh giá và verify
        cy.evaluateProduct(goStore['btn'], goStore['url'], posAtStore, likeClicks, dislikeClicks)
        .then(({likes, dislikes, likesClicked, dislikesClicked, newLikes, newDislikes}) => {
            // Verify lượt likes và dislikes mới
            cy.wrap(newLikes).should('eq', likes + likesClicked);
            cy.wrap(newDislikes).should('eq', dislikes + dislikesClicked);
            
            // Verify lượt likes và dislikes mới trên các modal chi tiết tại các trang
            itemAtPages.forEach(item => {
                cy.checkEvaluation(item['btnRedirect'], item['url'], item['position'], newLikes, newDislikes);
            });
        });
    });

    /**
     * Thực hiện step 1 với lượt like và dislike lần lượt là giá trị random trong khoảng từ 1 đến 10 cho mặt hàng Rosquilla
     */
    it('Step 3', () => {
        const itemAtPages = [
            {btnRedirect: goReleases['btn'], url: goReleases['url'], position: 3},
            {btnRedirect: goStore['btn'], url: goStore['url'], position: 5}
        ];
        const posAtStore = 5;
        const likeClicks = 'random';
        const dislikeClicks = 'random';

        // Đánh giá và verify
        cy.evaluateProduct(goStore['btn'], goStore['url'], posAtStore, likeClicks, dislikeClicks)
        .then(({likes, dislikes, likesClicked, dislikesClicked, newLikes, newDislikes}) => {
            // Verify lượt likes và dislikes mới
            cy.wrap(newLikes).should('eq', likes + likesClicked);
            cy.wrap(newDislikes).should('eq', dislikes + dislikesClicked);
            
            // Verify lượt likes và dislikes mới trên các modal chi tiết tại các trang
            itemAtPages.forEach(item => {
                cy.checkEvaluation(item['btnRedirect'], item['url'], item['position'], newLikes, newDislikes);
            });
        });
    });
});