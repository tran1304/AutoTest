Thông tin thành viên:
52100937 - Ao Thuỵ Ngọc Trân

Link trang web: https://final-swat-2324.netlify.app/
Kết quả kiểm thử: 7 test case, tổng 29 step, pass 27, fail 2
Kết quả kiểm thử được lưu tại 2 thư mục report và screenshots

Các bước vận hành cypress
Step 1: Nếu chưa có node js và yarn thì cài đặt node js và yarn
- Node JS: https://nodejs.org/en (phiên bản đang sử dung 21.7.1)
- Yarn: https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable (phiên bản đang sử dung 1.22.19)
Step 2: Mở thư mục source, mở CMD, chạy lệnh "cd SPA-ecommerce" để vào souce code của web
Step 3: Chạy lệnh "yarn install" để cài các package và lệnh "yarn start" để chạy web
(Step 3 sẽ được bỏ qua vì đã deploy lên host Netlify. Link: https://final-swat-2324.netlify.app/)
Step 4: Chạy lệnh "cd ../Cypress" để điều hướng đến thư mục Cypress
Step 5: Nếu muốn chạy thông qua Test Runner thì chạy lệnh "yarn run cy:open", sau khi cửa sổ bật lên thì bấm vào "E2E Testing", chọn trình duyệt "Chrome", khi này sẽ hiện ra các spec, mỗi spec là 1 file *.cy.js để viết các test case, chọn từng file spec để kiểm tra kết quả
Step 6: Nếu muốn xuất kết quả thì quay lại CMD, chạy lệnh "yarn run cy:run" để chạy chế độ headless, khi chạy xong thư mục Cypress sẽ xuất hiện file result/result.html chứa báo cáo kết quả, và thư mục screenshots (nếu có fail) chứa các ảnh chụp màn hình các test fail