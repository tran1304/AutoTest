/** 
 * Kiểm tra các thuộc tính của phần tử
 */
Cypress.Commands.add("checkElement", (selector, options) => {
    //Exist
    if (options.exist !== undefined) {
        cy.get(selector).should(options.exist ? "exist" : "not.exist");
    }

    //Visible
    if (options.visible !== undefined) {
        cy.get(selector).should(options.visible ? "be.visible" : "not.be.visible");
    }

    //Input
    if (options.inputValue !== undefined) {
        cy.get(selector).should("have.value", options.inputValue);
    }

    //Class
    if (options.class !== undefined) {
        cy.get(selector).should("have.class", options.class);
    }

    //Attribute
    if (options.attr !== undefined) {
        cy.get(selector).should("have.attr", options.attr, options.value);
    }

    //Text
    if (options.text !== undefined) {
        cy.get(selector).should("have.text", options.text);
    }
});

/** 
 * Kiểm tra url và title của trang web
 */
Cypress.Commands.add("checkUrlAndTitle", (url, title) => {
    if (title !== undefined) {
        cy.title().should("eq", title);
    }

    if (url !== undefined) {
        cy.url().should("eq", url);
    }
});

/**
 * Click 1 button với số lần click cho trước
 */
Cypress.Commands.add('clickButtonWithNumber', (button, numberOfClicks) => {
    for (let i = 0; i < numberOfClicks; i++) {
        cy.get(button).click();
    }
});

/** 
 * Kiểm tra chi tiết các sản phẩm (các phần tử article, modal) với data
 */
Cypress.Commands.add('checkDetailProducts', (items, modal, data) => {
    cy.get(items).should('be.visible').should('have.length', data.length)
        .each(($article, index) => {
            // Check brand và id
            cy.wrap($article).find('.item-brand > span').should('have.text', data[index]['brand']);
            cy.wrap($article).find('.item-details').should('have.attr', 'name', `info${data[index]['id']}`);

            // Mở modal để check các thông tin còn lại
            cy.wrap($article).find('.item-details').click();

            // Check theo thứ tự: name, likes, dislikes, price, photo1, photo2, photo3, description
            cy.get(modal).within($modal => {
                cy.checkElement('.modal-info-name', { text: data[index]['name'] });
                cy.checkElement('#likecounter', { text: data[index]['likes'] });
                cy.checkElement('#dislikecounter', { text: data[index]['dislikes'] });
                cy.checkElement('.modal-info-price', { text: `$ ${data[index]['price']}` });
                cy.checkElement('.modal-gallery > button:nth-child(1) > img', { attr: 'src', value: data[index]['photo1'] });
                cy.checkElement('.modal-gallery > button:nth-child(2) > img', { attr: 'src', value: data[index]['photo2'] });
                cy.checkElement('.modal-gallery > button:nth-child(3) > img', { attr: 'src', value: data[index]['photo3'] });
                cy.checkElement('.modal-aside-description', { text: data[index]['description'] });
            });

            // Đóng modal chuẩn bị kiểm tra các sản phẩm tiếp theo
            cy.get('body').type('{esc}');
        });
});

/**
 * Nhập dữ liệu vào thanh tìm kiếm
 */
Cypress.Commands.add('typeSearchBar', (searchBar, text) => {
    cy.get(searchBar).click().should('be.focused');
    (text === '{clear}')? cy.get(searchBar).clear(): cy.get(searchBar).type(text);
    cy.get(searchBar).type('{enter}');
});


/**
 * Đánh giá sản phẩm bằng cách bấm like và dislike
 */
Cypress.Commands.add('evaluateProduct', (redirectBtn, expectedUrl, itemPosition, numberOfLikeClicks, numberOfDislikeClicks) => {
    // Click điều hướng tới trang yêu cầu
    cy.get(redirectBtn).click();

    // Lấy số lần click của mỗi button
    if (numberOfLikeClicks === 'random') {
        numberOfLikeClicks = parseInt(Math.floor(Math.random() * 10) + 1);
    }
    if (numberOfDislikeClicks === 'random') {
        numberOfDislikeClicks = parseInt(Math.floor(Math.random() * 10) + 1);
    }

    // Ghi lại lượt like và dislike ban đầu
    let likes = 0;
    let dislikes = 0;
    cy.get(`#itemsContainer article:nth-child(${itemPosition}) > .item-details`).click();
    cy.get('#modalContainer > .modal').should('be.visible').within($modal => {
        const getLikes = cy.get('#likecounter').invoke('text');
        const getDislikes = cy.get('#dislikecounter').invoke('text');
        Cypress.Promise.all([getLikes, getDislikes]).then(results => {
            likes = parseInt(results[0]);
            dislikes = parseInt(results[1]);
        });
    }).then(() => {
        cy.clickButtonWithNumber('.modal-info-btns > button:nth-child(1)', numberOfLikeClicks);
        cy.clickButtonWithNumber('.modal-info-btns > button:nth-child(2)', numberOfDislikeClicks);
        cy.get('body').type('{esc}');
    }).then(() => {
        return {
            likes: likes,
            dislikes: dislikes,
            likesClicked: numberOfLikeClicks,
            dislikesClicked: numberOfDislikeClicks,
            newLikes: likes + numberOfLikeClicks,
            newDislikes: dislikes + numberOfDislikeClicks
        };
    });
});

/**
 * Kiểm tra lượt likes và dislikes của sản phẩm
 */
Cypress.Commands.add('checkEvaluation', (redirectBtn, expectedUrl, itemPosition, expectedLikes, expectedDislikes) => {
    // Click điều hướng tới trang yêu cầu
    cy.get(redirectBtn).click();
    
    // Mở modal kiếm tra
    cy.get(`#itemsContainer article:nth-child(${itemPosition}) > .item-details`).click();
    
    // Verify lượt like và dislike
    cy.get('#modalContainer > .modal').should('be.visible').within($modal => {
        cy.get('#likecounter').should('have.text', `${expectedLikes}`);
        cy.get('#dislikecounter').should('have.text', `${expectedDislikes}`);
    });

    // Đóng modal
    cy.get('body').type('{esc}');
});

/**
 * Click nút thêm giỏ hàng với số lần click đã cho trước hoặc random
 */
Cypress.Commands.add('addCartByClickButton', (item, numberOfClicks) => {
    let itemInfos = [];
    let itemTotals = { counter: 0, total: 0 };

    cy.get(item).each($article => {
        // Lấy số lần click của mỗi item
        if (numberOfClicks === 'random') {
            numberOfClicks = parseInt(Math.floor(Math.random() * 10) + 1);
        }
        const counterClick = numberOfClicks;
        // Click các button add để thêm giỏ hàng và return
        cy.wrap($article).within(() => {
            cy.clickButtonWithNumber('.item-btn', counterClick);
            const getName = cy.get('.item-name').invoke('text');
            const getImage = cy.get('.item-imgBox > img').invoke('attr', 'src');
            const getId = cy.get('.item-btn').invoke('attr', 'name');
            const getBrand = cy.get('.item-brand > span').invoke('text');
            const getPrice = cy.get('.item-price').invoke('text');

            Cypress.Promise.all([getName, getImage, getId, getBrand, getPrice]).then(results => {
                const newLength = itemInfos.push({
                    name: results[0],
                    photo1: results[1],
                    id: parseInt(results[2].split('add')[1]),
                    brand: results[3],
                    price: parseInt(results[4].split(' ')[1]),
                    counter: counterClick,
                    total: parseInt(results[4].split(' ')[1]) * counterClick
                });
                itemTotals['counter'] += itemInfos[newLength - 1]['counter'];
                itemTotals['total'] += itemInfos[newLength - 1]['total'];
            });
        });
    }).then(() => {
        return [itemInfos, itemTotals];
    });
});

/**
 * Thay đổi số lượng trên modal chi tiết để thêm giỏ hàng bằng cách bấm nút + và -
 */
Cypress.Commands.add('addCartByViewModal', (item, numberOfIncreaseClicks, numberOfDecreaseClicks = 0) => {
    let itemInfos = [];
    let itemTotals = { counter: 0, total: 0 };

    cy.get(item).each(($article, i) => {
        // Lấy số lần click của mỗi item
        if (numberOfIncreaseClicks === 'random') {
            numberOfIncreaseClicks = parseInt(Math.floor(Math.random() * 10) + 1);
        }
        if (numberOfDecreaseClicks === 'random') {
            numberOfDecreaseClicks = parseInt(Math.floor(Math.random() * numberOfIncreaseClicks));
        }

        // Khởi tạo các phần tử và lưu các thông tin không có trong modal
        const curArticle = `${item}:nth-child(${i + 1})`;
        const getBrand = cy.get(`${curArticle} > .item-brand > span`).invoke('text');

        // Click mở modal
        cy.get(`${curArticle} > .item-details`).click();
        cy.get('#modalContainer').should('be.visible');

        // Click thay đổi số lượng và ghi lại thông tin
        cy.get('#modalContainer > .modal').within($modal => {
            // Click lần lượt các button + và - thay đổi số lượng
            cy.clickButtonWithNumber('.modal-aside-buying-btns > button:nth-child(2)', numberOfIncreaseClicks);
            cy.clickButtonWithNumber('.modal-aside-buying-btns > button:nth-child(1)', numberOfDecreaseClicks);

            // Ghi lại các thông tin
            const getName = cy.get('.modal-info-name').invoke('text');
            const getImage = cy.get('.modal-imgBox > img').invoke('attr', 'src');
            const getId = cy.get('.modal-imgBox > img').invoke('attr', 'id');
            const getPrice = cy.get('.modal-info-price').invoke('text');
            const getCounter = cy.get('#modalCartCounter').invoke('text');

            Cypress.Promise.all([getName, getImage, getId, getBrand, getPrice, getCounter]).then(results => {
                const newLength = itemInfos.push({
                    name: results[0],
                    photo1: results[1],
                    id: parseInt(results[2].split('mainphoto')[1]),
                    brand: results[3],
                    price: parseInt(results[4].split(' ')[1]),
                    counter: parseInt(results[5]),
                    total: parseInt(results[4].split(' ')[1]) * parseInt(results[5])
                });
                itemTotals['counter'] += itemInfos[newLength - 1]['counter'];
                itemTotals['total'] += itemInfos[newLength - 1]['total'];
            });
        });

        // Đóng modal
        cy.get('body').type('{esc}');
        cy.get('#modalContainer').should('not.be.visible');
    }).then(() => {
        return [itemInfos, itemTotals];
    });
});

/**
 * Verify các cartContent và cartTotals
 */
Cypress.Commands.add('checkCart', (key, itemInfos, itemTotals) => {
    cy.getAllSessionStorage()
        .then(storage => storage[key])
        .then(storage => {
            return {
                'cartContent': JSON.parse(storage['cartContent']),
                'cartTotals': JSON.parse(storage['cartTotals'])
            };
        }).then(storage => {
            const cartContent = storage['cartContent'];
            const cartTotals = storage['cartTotals'];

            // Kiểm tra cartContent
            cy.wrap(cartContent)
                .should('have.length', itemInfos.length)
                .each((item, index) => {
                    cy.wrap(item).its('name').should('eq', itemInfos[index]['name']);
                    cy.wrap(item).its('photo1').should('eq', itemInfos[index]['photo1']);
                    cy.wrap(item).its('id').should('eq', itemInfos[index]['id']);
                    cy.wrap(item).its('brand').should('eq', itemInfos[index]['brand']);
                    cy.wrap(item).its('price').should('eq', itemInfos[index]['price']);
                    cy.wrap(item).its('counter').should('eq', itemInfos[index]['counter']);
                    cy.wrap(item).its('total').should('eq', itemInfos[index]['total']);
                });

            // Kiểm tra cartTotal
            cy.wrap(cartTotals).its('counter').should('eq', itemTotals['counter']);
            cy.wrap(cartTotals).its('total').should('eq', itemTotals['total']);
        });
});

/**
 * Verify các thông tin trong trang Cart
 */
Cypress.Commands.add('checkCartPage', (itemInfos, itemTotals) => {
    cy.get('#itemsContainer > .cartContainer').should('be.visible').each(($item, index) => {
        cy.wrap($item).within(() => {
            cy.checkElement('button[name="removeone"]', { attr: 'id', value: itemInfos[index]['id'] });
            cy.checkElement('.cartContainer-imgBox > img', { attr: 'src', value: itemInfos[index]['photo1'] });
            cy.checkElement('.cartContainer-details > .cartContainer-details-text:nth-child(1)', { text: itemInfos[index]['name'] });
            cy.checkElement('.cartContainer-details > .cartContainer-details-text:nth-child(2)', { text: itemInfos[index]['brand'] });
            cy.checkElement('.cartContainer-details > .cartContainer-details-price', { text: `$${itemInfos[index]['price']}` });
            cy.checkElement('.cartContainer-oncart-counter', { attr: 'value', value: `${itemInfos[index]['counter']}` });
            cy.checkElement('.cartContainer-oncart-total', { text: `$${itemInfos[index]['total']}` });
        });
    });
    cy.checkElement('#itemsContainer > .cartTotals > .cartTitle-cart > span:nth-child(1)', { text: `${itemTotals['counter']}` });
    cy.checkElement('#itemsContainer > .cartTotals > .cartTitle-cart > span:nth-child(2)', { text: `$${itemTotals['total']}` });
});

/**
 * Thay đổi số lượng các item trong cart
 */
Cypress.Commands.add('changeCartItemsCounter', (itemInfos, itemTotals, itemChanges) => {
    itemChanges.forEach(infoChange => {
        // Lấy các thông tin thay đổi
        const index = infoChange['index'];
        const newCounter = infoChange['counter'];
        // Thay đổi số lượng
        cy.get(`#itemsContainer > div:nth-child(${index + 2}) .cartContainer-oncart-counter`)
        .clear().type(newCounter).type('{enter}')
        .then(() => {
            // Cập nhật lại kết quả
            const diffCounter = newCounter - itemInfos[index - 1]['counter'];
            const diffTotal = itemInfos[index - 1]['price'] * diffCounter;
            itemInfos[index - 1]['counter'] = newCounter;
            itemInfos[index - 1]['total'] += diffTotal;
            itemTotals['counter'] += diffCounter;
            itemTotals['total'] += diffTotal;
            return [itemInfos, itemTotals];
        });
    });
});

/**
 * Xoá các item trong cart
 */
Cypress.Commands.add('deleteCartItems', (itemInfos, itemTotals, itemDeletes) => {
    itemDeletes.forEach(index => {
        // Click button - của mặt hàng để xoá
        cy.get(`#itemsContainer > div:nth-child(${index + 2}) > button`).click()
        .then(() => {
            // Cập nhật lại kết quả
            itemTotals['counter'] -= itemInfos[index - 1]['counter'];
            itemTotals['total'] -= itemInfos[index - 1]['total'];
            itemInfos.splice(index - 1, 1);

            return [itemInfos, itemTotals];
        });
    });
});