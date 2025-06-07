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
const items = '#itemsContainer article';
const modal = '#modalContainer > .modal';
const searcher = 'input[name="searcher"]';

/** 
 * Test case 3: Tìm kiếm sản phẩm theo tên
 */
describe('Test case 3', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    /**
     * Tại trang Store (vì muốn đầy đủ dữ liệu), tìm kiếm sản phẩm với kết quả không tồn tại bằng cách nhập vào thanh tìm kiếm và bấm phím Enter với lần lượt các text:
     * “fsf”, “35253fas”, “jg”.
     * Đảm bảo section chỉ hiện ra nội dung “Sin Resultados” với background color là rgba(255, 0, 0, 0.3)
     */
    it('Step 1', () => {
        const searchText = ['fsf', '35253fas', 'jg'];
        searchText.forEach(text => {
            // Lấy data từ cơ sở dữ liệu và tìm kiếm
            const dataSearch = data.filter(item => item['name'].includes(text));
            cy.typeSearchBar(searcher, text);
            // Verify
            cy.wrap(dataSearch).should('have.length', 0);
            cy.get('#itemsContainer > div')
            .invoke('css', 'background-color')
            .should('eq', 'rgba(255, 0, 0, 0.3)');
            // Clear
            cy.typeSearchBar(searcher, '{clear}');
        });
    });

    /**
     * Tại trang Store, tìm kiếm sản phẩm với kết quả tồn tại ít nhất 1 sản phẩm với các text lần lượt là:
     * “m”, “a”, “e”, filter các text tìm kiếm này vào data gốc để lấy các data kiểm tra.
     * Đảm bảo số lượng item tìm >= 1, và khớp các item tìm kiếm với data kiểm tra
     */
    it('Step 2', () => {
        const searchText = ['m', 'a', 'e'];
        searchText.forEach(text => {
            // Lấy data từ cơ sở dữ liệu và tìm kiếm
            const dataSearch = data.filter(item => item['name'].includes(text));
            cy.typeSearchBar(searcher, text);
            // Verify
            cy.get('#itemsContainer article').should('have.length.gte', 1);
            cy.wrap(dataSearch).should('have.length.gte', 1);
            cy.checkDetailProducts(items, modal, dataSearch);
            // Clear
            cy.typeSearchBar(searcher, '{clear}');
        });
    });

    /**
     * Tại trang Store, tìm kiếm sản phẩm với kết quả yêu cầu tồn tại đúng 1 sản phẩm với các text hiển thị giống như trên web hiển thị lần lượt là: 
     * “Cafe”, “Refresco”, “Pizza”
     */
    it('Step 3', () => {
        const searchText = ['Cafe', 'Refresco', 'Pizza'];
        searchText.forEach(text => {
            // Lấy data từ cơ sở dữ liệu và tìm kiếm
            const dataSearch = data.filter(item => item['name'].includes(text));
            cy.typeSearchBar(searcher, text);
            // Verify
            cy.get('#itemsContainer article').should('have.length', 1);
            cy.wrap(dataSearch).should('have.length', 1);
            cy.checkDetailProducts(items, modal, dataSearch);
            // Clear
            cy.typeSearchBar(searcher, '{clear}');
        });
    });

    /**
     * Tại trang Store, tìm kiếm sản phẩm với kết quả yêu cầu tồn tại đúng 1 sản phẩm với các text hiển thị giống như trên web hiển thị lần lượt là: 
     * “cafe”, “refresco”, “pizza”
     */
    it('Step 4', () => {
        const searchText = ['cafe', 'refresco', 'pizza'];
        searchText.forEach(text => {
            // Lấy data từ cơ sở dữ liệu và tìm kiếm
            const dataSearch = data.filter(item => item['name'].includes(text));
            cy.typeSearchBar(searcher, text);
            // Verify
            cy.get('#itemsContainer article').should('have.length', 1);
            cy.wrap(dataSearch).should('have.length', 1);
            cy.checkDetailProducts(items, modal, dataSearch);
            // Clear
            cy.typeSearchBar(searcher, '{clear}');
        });
    });

    /**
     * Filter data trong cơ sở dữ liệu theo tiêu chí:
     * - Tại trang Home/Store (denStore), tất cả data
     * - Tại trang new products (Productos Nuevos), data có newRelease=true
     * - Tại trang promotions (Promociones), data có promotions=true
     * Điều hướng đến các trang denStore, Productos Nuevos, Promociones, tìm kiếm với text bất kỳ rồi xoá đi,
     * đảm bảo nội dung trả về có số lượng đúng như khi mới mở trang (ví dụ promotions là 3 sản phẩm, tìm kiếm trả về 1 sản phẩm, xoá tìm kiếm thì trở về lại 3 sản phẩm)
     */
    it('Step 5', () => {
        const homeData = data.filter(item => item);
        const newProductsData = data.filter(item => item['newRelease']);
        const promotionsData = data.filter(item => item['promotions']);

        const dataLenghts = [homeData.length, newProductsData.length, promotionsData.length];
        const btnLocators = [goStore, goReleases, goPromotions];
        const searchText = 'ssuuuff';

        for (let i = 0; i < btnLocators.length; i++) {
            cy.get(btnLocators[i]['btn']).click();
            
            // Tìm kiếm rồi xoá
            cy.typeSearchBar(searcher, searchText);
            cy.typeSearchBar(searcher, '{clear}');
            // Verify số lượng ban đầu
            cy.get('#itemsContainer article')
            .should('have.length', dataLenghts[i]);
        }
    });
});