/**
 * @description 检查是否使用PNPM进行包管理
 * @author SquirrelYe <will@aesen.cc>
 * @time 2022.05.19 13:26:32
 */
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.error('\n\nThis repository requires using << PNPM >> as the package manager for scripts to work properly.\n\n');
  process.exit(1);
}
