export type Page = 'Brands' | 'Categories' | 'Products' | 'Promation' | 'Reviews' | 'Orders' | 'Invoice' | 'Revenue' | 'Blog' | 'B.Comments'| 'Post Category';

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
  'B.Comments', 
  'Post Category',
];

// Map pages to URLs for the admin panel
export  const pageUrls = [
    { name: 'Users', path: '/admin/users' },
    { name: 'Brands', path: '/admin/brand' },
    { name: 'Categories', path: '/admin/category' },
    { name: 'Products', path: '/admin/product' },
    { name: 'Promation', path: '/admin/promotion' },
    { name: 'Reviews', path: '/admin/review' },
    { name: 'Orders', path: '/admin/order' },
    { name: 'Invoice', path: '/admin/invoice' },
    { name: 'Company', path: '/admin/company' },
    { name: 'Revenue', path: '/admin/revenue' },
    { name: 'Role', path: '/admin/users/role' },
    { name: 'Blog', path: '/admin/blog' },
    { name: 'B.Comments', path: '/admin/bloglike' },
    { name: 'Post Category', path: '/admin/postcategory' }
    
  ];
  
