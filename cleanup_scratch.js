const fs = require('fs');
const path = require('path');

const filesToTarget = [
  'D:\\Hungry\\final_setup.js',
  'D:\\Hungry\\fix_rider.js',
  'D:\\Hungry\\setup_rider.js',
  'D:\\Hungry\\test_delivery.js',
  'D:\\Hungry\\backend\\apply_specific_variants.js',
  'D:\\Hungry\\backend\\apply_variants.js',
  'D:\\Hungry\\backend\\check_db.js',
  'D:\\Hungry\\backend\\check_riders.js',
  'D:\\Hungry\\backend\\cleanup_variants.js',
  'D:\\Hungry\\backend\\create_admin.js',
  'D:\\Hungry\\backend\\debug_items.js',
  'D:\\Hungry\\backend\\delete_item.js',
  'D:\\Hungry\\backend\\final_setup.js',
  'D:\\Hungry\\backend\\fix_admin.js',
  'D:\\Hungry\\backend\\fix_roles.js',
  'D:\\Hungry\\backend\\recovery_server.js',
  'D:\\Hungry\\backend\\test_server.js',
  'D:\\Hungry\\backend\\test_signup.js',
  'D:\\Hungry\\backend\\tmp_check_admin.js',
  'D:\\Hungry\\backend\\tmp_check_data.js',
  'D:\\Hungry\\backend\\tmp_db_test.js',
  'D:\\Hungry\\backend\\tmp_test_db.js',
  'D:\\Hungry\\backend\\verify_data.js',
  'D:\\Hungry\\backend\\testAPI.js',
  'D:\\Hungry\\frontend\\src\\pages\\DeliveryLogin.js',
  'D:\\Hungry\\frontend\\src\\pages\\DeliveryRegister.js',
  'D:\\Hungry\\frontend\\src\\pages\\RiderLogin.js',
  'D:\\Hungry\\frontend\\src\\pages\\RiderRegister.js',
  'D:\\Hungry\\frontend\\src\\pages\\DeliveryDashboard.js',
  'D:\\Hungry\\frontend\\src\\pages\\DeliveryHome.jsx'
];

filesToTarget.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } else {
      console.log(`Skipped (not found): ${file}`);
    }
  } catch (err) {
    console.error(`Error deleting ${file}:`, err.message);
  }
});
