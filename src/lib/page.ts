export type Page = 'Brands' | 'Categories' | 'Products' | 'Promation' | 'Reviews' | 'Orders' | 'Invoice' | 'Revenue' | 'Blog' | 'Blog Comment';

export const pages: Page[] = [
  'Brands', 
  'Categories', 
  'Products', 
  'Promation', 
  'Reviews', 
  'Orders', 
  'Invoice', 
  'Revenue', 
  'Blog', 
  'Blog Comment', 

];

// Map pages to URLs for the admin panel
export  const pageUrls = [
    { name: 'Users', path: '/admin/users' },
    { name: 'Brands', path: '/admin/brandlist' },
    { name: 'Categories', path: '/admin/categorylist' },
    { name: 'Products', path: '/admin/productlist' },
    { name: 'Promation', path: '/admin/promotionlist' },
    { name: 'Reviews', path: '/admin/reviewlist' },
    { name: 'Orders', path: '/admin/orderlist' },
    { name: 'Invoice', path: '/admin/invoice' },
    { name: 'Company', path: '/admin/company' },
    { name: 'Revenue', path: '/admin/revenue' },
    { name: 'Role', path: '/admin/users/role' },
    { name: 'Blog', path: '/admin/blog' },
    { name: 'Blog Comment', path: '/admin/bloglike' }
  ];
  
