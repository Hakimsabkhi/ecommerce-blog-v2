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
    { name: 'Brands', path: '/admin/brand' },
    { name: 'Categories', path: '/admin/category' },
    { name: 'Products', path: '/admin/product' },
    { name: 'Promation', path: '/admin/promotion' },
    { name: 'Reviews', path: '/admin/reviewlist' },
    { name: 'Orders', path: '/admin/orderlist' },
    { name: 'Invoice', path: '/admin/invoice' },
    { name: 'Company', path: '/admin/company' },
    { name: 'Revenue', path: '/admin/revenue' },
    { name: 'Role', path: '/admin/users/role' },
    { name: 'Blog', path: '/admin/blog' },
    { name: 'Blog Comment', path: '/admin/bloglike' }
  ];
  
