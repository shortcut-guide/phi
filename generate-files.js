import fs from 'fs';
import path from 'path';

const directories = [
  // フロントエンド (Astro)
  "frontend/src/components",
  "frontend/src/components/ui",
  "frontend/src/components/forms",
  "frontend/src/components/search",
  "frontend/src/components/icons",
  "frontend/src/components/images",
  "frontend/src/components/tables",
  "frontend/src/components/pagination",
  "frontend/src/components/alerts",
  "frontend/src/components/messages",
  "frontend/src/components/emails",
  "frontend/src/components/announcements",
  "frontend/src/components/qa",
  "frontend/src/components/ranking",
  "frontend/src/components/comparison",
  "frontend/src/pages",
  "frontend/src/layouts",
  "frontend/public/styles",

  // バックエンド (Node.js + Express)
  "backend",
  "backend/config",
  "backend/controllers",
  "backend/models",
  "backend/routes",
  "backend/services",
  "backend/utils"
];

const files = [
  // フロントエンド (Astro)
  "frontend/src/components/ui/Button.astro",
  "frontend/src/components/ui/Card.astro",
  "frontend/src/components/ui/Modal.astro",
  "frontend/src/components/forms/Input.astro",
  "frontend/src/components/forms/Select.astro",
  "frontend/src/components/forms/Checkbox.astro",
  "frontend/src/components/forms/Radio.astro",
  "frontend/src/components/forms/Form.astro",
  "frontend/src/components/search/SearchBar.astro",
  "frontend/src/components/search/SearchResult.astro",
  "frontend/src/components/search/Filters.astro",
  "frontend/src/components/icons/Icon.astro",
  "frontend/src/components/icons/FavoriteIcon.astro",
  "frontend/src/components/icons/CartIcon.astro",
  "frontend/src/components/icons/UserIcon.astro",
  "frontend/src/components/images/Image.astro",
  "frontend/src/components/images/ProductImage.astro",
  "frontend/src/components/images/Avatar.astro",
  "frontend/src/components/tables/Table.astro",
  "frontend/src/components/tables/TableRow.astro",
  "frontend/src/components/tables/TableHeader.astro",
  "frontend/src/components/pagination/Pagination.astro",
  "frontend/src/components/alerts/Alert.astro",
  "frontend/src/components/alerts/Toast.astro",
  "frontend/src/components/messages/Chat.astro",
  "frontend/src/components/messages/Notification.astro",
  "frontend/src/components/emails/EmailList.astro",
  "frontend/src/components/emails/EmailDetail.astro",
  "frontend/src/components/announcements/Announcement.astro",
  "frontend/src/components/qa/QAList.astro",
  "frontend/src/components/qa/QADetail.astro",
  "frontend/src/components/ranking/Ranking.astro",
  "frontend/src/components/ranking/RankingItem.astro",
  "frontend/src/components/comparison/Comparison.astro",
  "frontend/src/components/comparison/ComparisonTable.astro",
  "frontend/src/pages/index.astro",
  "frontend/src/pages/login.astro",
  "frontend/src/pages/dashboard.astro",
  "frontend/src/pages/purchase.astro",
  "frontend/src/pages/favorites.astro",
  "frontend/src/pages/settings.astro",
  "frontend/src/pages/shipping.astro",
  "frontend/src/pages/cancel.astro",
  "frontend/src/layouts/BaseLayout.astro",
  "frontend/public/styles/globals.css",

  // バックエンド (Node.js + Express)
  "backend/config/database.js",
  "backend/config/auth.js",
  "backend/controllers/authController.js",
  "backend/controllers/purchaseController.js",
  "backend/controllers/scrapingController.js",
  "backend/controllers/emailController.js",
  "backend/controllers/pointController.js",
  "backend/controllers/shippingController.js",
  "backend/controllers/cancelController.js",
  "backend/controllers/apiCheckController.js",
  "backend/models/User.js",
  "backend/models/Product.js",
  "backend/models/Purchase.js",
  "backend/models/ECAccount.js",
  "backend/models/Point.js",
  "backend/models/Shipping.js",
  "backend/models/Favorite.js",
  "backend/models/APIStatus.js",
  "backend/routes/authRoutes.js",
  "backend/routes/purchaseRoutes.js",
  "backend/routes/scrapingRoutes.js",
  "backend/routes/emailRoutes.js",
  "backend/routes/pointRoutes.js",
  "backend/routes/shippingRoutes.js",
  "backend/routes/cancelRoutes.js",
  "backend/routes/apiCheckRoutes.js",
  "backend/routes/recommendationRoutes.js",
  "backend/services/scrapingService.js",
  "backend/services/authService.js",
  "backend/services/emailService.js",
  "backend/services/pointService.js",
  "backend/services/shippingService.js",
  "backend/services/cancelService.js",
  "backend/services/apiCheckService.js",
  "backend/utils/puppeteerUtils.js",
  "backend/utils/emailParser.js",
  "backend/utils/pointCalculator.js",
  "backend/utils/apiChecker.js",
  "backend/index.js",
  "backend/server.js"
];

// ディレクトリ作成
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
};

// ファイル作成
const createFile = (file) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '');
    console.log(`📄 Created file: ${file}`);
  }
};

// ディレクトリ作成
directories.forEach(createDir);

// ファイル作成
files.forEach(createFile);

console.log("✅ All directories and files have been created successfully!");