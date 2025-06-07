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
const {} = require('cypress-promise');

/** 
 * Test case 2: Xem chi tiết các sản phẩm
 */
describe('Test case 2', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    /**
     * Tại trang Store, click vào button +info của 1 sản phẩm bất kỳ, đảm bảo modal được hiện ra, 
     * press phím Esc, đảm bảo modal biến mất
     */
    it('Step 1', () => {
        cy.get('button[name="info1"]').click();
        cy.checkElement('#modalContainer', {visible: true});
        cy.get('body').type('{esc}');
        cy.checkElement('#modalContainer', {visible: false});
    });
    
    /**
     * Tại trang Store, click vào button +info của các sản phẩm để modal hiện ra, 
     * đảm bảo thông tin trên modal khớp với thông tin từ article truyền chính xác vào modal 
     * bao gồm: name, price, photo1
     */
    it('Step 2', () => {
        let infors = [];

        cy.get('#itemsContainer article').should('be.visible').each($article => {
            // Ghi lại thông tin trên article
            cy.wrap($article).within(async () => {
                const getName = cy.get('.item-name').invoke('text');
                const getImage = cy.get('.item-imgBox > img').invoke('attr', 'src');
                const getPrice = cy.get('.item-price').invoke('text');
                
                Cypress.Promise.all([getName, getImage, getPrice]).then(results => {
                    infors.push({
                        name: results[0],
                        photo1: results[1],
                        price: results[2]
                    });
                });
            });
        })
        .then(() => {
            cy.get('#itemsContainer article').each(($article, i) => {
                cy.wrap($article).find('.item-details').click();

                // Kiểm tra name, price, photo1 được gửi từ article lên modal
                cy.get('#modalContainer > .modal').within($modal => {
                    cy.checkElement('.modal-info-name', {text: infors[i]['name']});
                    cy.checkElement('.modal-info-price', {text: infors[i]['price']});
                    cy.checkElement('.modal-imgBox > img', {attr: 'src', value: infors[i]['photo1']});
                }); 

                cy.get('body').type('{esc}');
            });
        });
    });

    /**
     * Filter data trong cơ sở dữ liệu theo tiêu chí:
     * - Tại trang Home/Store (denStore), tất cả data
     * - Tại trang new products (Productos Nuevos), data có newRelease=true
     * - Tại trang promotions (Promociones), data có promotions=true
     * Điều hướng đến các trang denStore, Productos Nuevos, Promociones. Đảm bảo đúng thông tin chi tiết mỗi sản phẩm về các thông tin:
     * id, name, brand, likes, dislikes, price, photo1, photo2, photo3, description
     */
    it('Step 3', () => {
        const homeData = data.filter(item => item);
        const newProductsData = data.filter(item => item['newRelease']);
        const promotionsData = data.filter(item => item['promotions']);

        const expectedData = [homeData, newProductsData, promotionsData];
        const btnLocators = [goStore, goReleases, goPromotions];

        for (let i = 0; i < btnLocators.length; i++) {
            // Điều hướng tới các trang và verify data của các trang đó
            cy.get(btnLocators[i]['btn']).click();
            cy.checkDetailProducts('#itemsContainer article', '#modalContainer > .modal', expectedData[i]);
        }
    });

    /**
     * Tại trang Store, chọn 1 sản phẩm, click vào button +info, click lần lượt vào các hình con của sản phẩm,
     * đảm bảo ô hiển thị hình ảnh hiển thị chính xác với hình ảnh con đã click (verify thuộc tính src của ảnh)
     */
    it('Step 4', () => {
        cy.get('button[name="info1"]').click();
        cy.checkElement('#modalContainer', {visible: true});

        cy.get('#modalContainer > .modal').within($modal => {
            for (let i = 1; i <= 3; i++) {
                cy.get(`.modal-gallery > button:nth-child(${i}) > img`).invoke('attr', 'src')
                .then(image => {
                    cy.get(`.modal-gallery > button:nth-child(${i}) > img`).click();
                    cy.checkElement('.modal-imgBox > img', {attr: 'src', value: image});
                });   
            }
        }); 
    });
});