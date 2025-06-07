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
const goCart = {
    'btn': '#header > .header-cart > .header-cart-title',
    'textContent': '#header > .header-cart > .header-cart-counter > span:nth-child(1)',
    'url': `${baseUrl}/#/cart`
};
const data = Cypress.env('data');

/** 
 * Test case 1: Kiểm tra trang chủ/store, các button dẫn đến các trang trong header
 */
describe('Test case 1', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    /**
     * Kiểm tra trang chủ khi mới mở lên có đủ các phần header, main gồm có các section, footer, trong đó không có modal nào tự động hiện lên
     */
    it('Step 1', () => {
        // Kiểm tra sự tồn tại của header
        cy.checkElement('header[id="header"]', {exist: true, visible: true});

        // Kiểm tra main có các section
        cy.checkElement('main section', {exist: true});

        // Kiểm tra footer
        cy.checkElement('footer[id="footer"] > span', {exist: true, visible: true, text: 'info@thisstore.com'});
    
        // Kiểm tra modal
        cy.checkElement('#modalContainer', {exist: true, visible: false});
    });

    /**
     * Kiểm tra 4 button denStore, Productos Nuevos, Promociones, Carrito có tồn tại và đang hiển thị trên web,
     * đồng thời 4 button này mang các text đại diện denStore, Productos Nuevos, Promociones, Carrito
     */
    it('Step 2', () => {
        const btnLocators = [goStore, goReleases, goPromotions, goCart];
        const btnContents = ['denStore', 'Productos Nuevos', 'Promociones', 'Carrito'];
        
        for (let i = 0; i < btnLocators.length; i++) {
            cy.checkElement(btnLocators[i]['textContent'], {exist: true, visible: true, text: btnContents[i]});
        }
    });

    /**
     * Click điều hướng 4 button denStore, Productos Nuevos, Promociones, Carrito, 
     * đảm bảo điều hướng đúng url có các path /#/inicio, /#/nuevosproductos, /#/promociones, /#/cart (baseUrl: https://final-swat-2324.netlify.app),
     * đồng thời cả 4 trang đều có đủ 3 phần header, main, footer, không có modal xuất hiện, và title đều là “Den Store”
     */
    it('Step 3', () => {
        const btnLocators = [goStore, goReleases, goPromotions, goCart];
        const paths = ['/#/inicio', '/#/nuevosproductos', '/#/promociones', '/#/cart'];
        
        for (let i = 0; i < btnLocators.length; i++) {
            cy.get(btnLocators[i]['btn']).click();
            // Kiểm tra url và title
            cy.checkUrlAndTitle(`${baseUrl}${paths[i]}`, 'Den Store');
            // Kiểm tra đủ 3 phần header, main, footer và modal
            cy.checkElement('header[id="header"]', {exist: true, visible: true});
            cy.checkElement('main section', {exist: true});
            cy.checkElement('footer[id="footer"] > span', {exist: true, visible: true, text: 'info@thisstore.com'});
            cy.checkElement('#modalContainer', {exist: true, visible: false});
        }
    });

    /**
     * Click điều hướng 3 button denStore, Productos Nuevos, Promociones, 
     * đảm bảo điều hướng đúng nội dung có các thông tin category lần lượt là Catalogo, Nuevos, Promociones, 
     * cùng lúc đó đảm bảo cả 3 trang đều có thanh tìm kiếm
     */
    it('Step 4', () => {
        const btnLocators = [goStore, goReleases, goPromotions];
        const categories = ['Catalogo', 'Nuevos', 'Promociones'];
        
        for (let i = 0; i < btnLocators.length; i++) {
            cy.get(btnLocators[i]['btn']).click();
            cy.checkElement('#Category', {exist: true, visible: true, text: categories[i]});
            cy.checkElement('input[name="searcher"]', {exist: true, visible: true, attr: 'placeholder', value: 'busca un articulo'});
        }
    });

    /**
     * Filter data trong cơ sở dữ liệu theo tiêu chí:
     * - Tại trang Home/Store (denStore), tất cả data
     * - Tại trang new products (Productos Nuevos), data có newRelease=true
     * - Tại trang promotions (Promociones), data có promotions=true
     * Điều hướng đến các trang denStore, Productos Nuevos, Promociones, đảm bảo số lượng sản phẩm (số phần tử article) đúng bằng số lượng các data đã filter
     */
    it('Step 5', () => {
        const homeData = data.filter(item => item);
        const newProductsData = data.filter(item => item['newRelease']);
        const promotionsData = data.filter(item => item['promotions']);

        const dataLengths = [homeData.length, newProductsData.length, promotionsData.length];
        const btnLocators = [goStore, goReleases, goPromotions];

        for (let i = 0; i < btnLocators.length; i++) {
            cy.get(btnLocators[i]['btn']).click();
            cy.get('#itemsContainer article').should('have.length', dataLengths[i]);
        }
    });

});